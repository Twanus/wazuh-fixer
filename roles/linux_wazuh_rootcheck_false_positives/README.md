# linux_wazuh_rootcheck_false_positives

This role verifies system binaries that trigger Wazuh rootcheck false positives (rule 510 - trojaned file detection) and configures the Wazuh agent to ignore them if they are legitimate.

## Description

Wazuh rootcheck rule 510 detects potential trojaned binaries by searching for suspicious patterns in system files. However, legitimate system binaries on Debian-based systems (like Raspberry Pi OS) can trigger false positives because they contain strings that match the detection patterns.

This role:
1. Verifies that specified files are legitimate ELF executables
2. Optionally verifies package integrity using `dpkg -V`
3. Adds verified legitimate files to the Wazuh agent's rootcheck ignore list
4. Restarts the Wazuh agent if configuration changes were made

**Common false positives:**
- `/bin/passwd` and `/usr/bin/passwd` (password management)
- `/bin/chfn` and `/usr/bin/chfn` (change finger information)
- `/bin/chsh` and `/usr/bin/chsh` (change shell)

## Requirements

- Ansible 2.9 or higher
- Linux target host (Debian/Ubuntu/Raspberry Pi OS)
- Wazuh agent installed (optional - role will skip configuration if not found)
- Appropriate permissions to:
  - Read system files
  - Modify `/var/ossec/etc/ossec.conf`
  - Restart `wazuh-agent` service (if auto-configure is enabled)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `linux_wazuh_rootcheck_false_positives_files` | See defaults | List of file paths to verify and potentially ignore |
| `linux_wazuh_rootcheck_false_positives_ossec_conf` | `/var/ossec/etc/ossec.conf` | Path to Wazuh agent configuration file |
| `linux_wazuh_rootcheck_false_positives_auto_configure` | `true` | Automatically add files to ignore list if verified as legitimate |

### Default Files List

By default, the role checks these files:
- `/bin/passwd`
- `/usr/bin/passwd`
- `/bin/chfn`
- `/usr/bin/chfn`
- `/bin/chsh`
- `/usr/bin/chsh`

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Wazuh to ignore rootcheck false positives
  hosts: linux
  become: true
  gather_facts: true
  roles:
    - role: twanus.wazuh_fixer.linux_wazuh_rootcheck_false_positives
```

Or using the development path:

```yaml
---
- name: Configure Wazuh to ignore rootcheck false positives
  hosts: linux
  become: true
  gather_facts: true
  roles:
    - role: ../roles/linux_wazuh_rootcheck_false_positives  # noqa role-name[path]
```

### Customizing Files to Check

```yaml
---
- name: Configure Wazuh with custom file list
  hosts: linux
  become: true
  gather_facts: true
  roles:
    - role: twanus.wazuh_fixer.linux_wazuh_rootcheck_false_positives
      vars:
        linux_wazuh_rootcheck_false_positives_files:
          - /bin/passwd
          - /usr/bin/passwd
          - /custom/path/to/file
```

### Verification Only (No Configuration Changes)

```yaml
---
- name: Verify files without configuring Wazuh
  hosts: linux
  become: true
  gather_facts: true
  roles:
    - role: twanus.wazuh_fixer.linux_wazuh_rootcheck_false_positives
      vars:
        linux_wazuh_rootcheck_false_positives_auto_configure: false
```

## How It Works

1. **File Existence Check**: Verifies that specified files exist on the system
2. **File Type Verification**: Uses `file` command to verify files are ELF executables
3. **Package Integrity Check** (Debian/Ubuntu only): Uses `dpkg -V` to verify files haven't been modified (excluding config files)
4. **Wazuh Configuration**: 
   - Reads current `/var/ossec/etc/ossec.conf`
   - Parses existing `<ignore>` entries in `<rootcheck>` section
   - Adds missing legitimate files to the ignore list
   - Creates `<rootcheck>` section if it doesn't exist
5. **Agent Restart**: Restarts `wazuh-agent` service if configuration was modified

## Verification Process

The role performs the following checks:

1. **ELF Binary Check**: Verifies files are ELF executables (not scripts or other file types)
2. **Package Verification**: On Debian-based systems, checks if files belong to installed packages and haven't been modified

Files that pass verification are considered legitimate and added to the Wazuh ignore list.

## Wazuh Configuration Format

The role modifies `/var/ossec/etc/ossec.conf` to add entries like:

```xml
<ossec_config>
  ...
  <rootcheck>
    <ignore>/bin/passwd</ignore>
    <ignore>/usr/bin/passwd</ignore>
    <ignore>/bin/chfn</ignore>
    <ignore>/usr/bin/chfn</ignore>
    <ignore>/bin/chsh</ignore>
    <ignore>/usr/bin/chsh</ignore>
  </rootcheck>
  ...
</ossec_config>
```

## Backup

Before modifying the Wazuh configuration, the role creates a backup:
- Location: `/var/ossec/etc/ossec.conf.backup-<timestamp>`
- Format: Timestamp is Unix epoch time

## Idempotency

The role is idempotent:
- Files are only added to the ignore list if they're not already present
- Wazuh agent is only restarted if configuration actually changed
- Verification steps are read-only and don't modify the system

## Troubleshooting

### Wazuh Agent Not Found

If the Wazuh agent configuration file is not found, the role will:
- Still perform file verification
- Skip Wazuh configuration
- Report that configuration was skipped

### Service Restart Fails

If the `wazuh-agent` service restart fails, the role:
- Reports the error but doesn't fail the playbook
- Configuration changes are still applied
- Manual restart may be required: `systemctl restart wazuh-agent`

### Package Verification Unavailable

On non-Debian systems (or if `dpkg` is not available):
- File type verification still occurs
- Package integrity checks are skipped
- Files are still added to ignore list if they pass ELF verification

## Compliance

This role addresses false positives from:
- **Wazuh Rule 510**: Host-based anomaly detection event (rootcheck) - Trojaned version of file detected

## Notes

- This role is designed for Debian-based Linux systems (Debian, Ubuntu, Raspberry Pi OS)
- Package verification (`dpkg -V`) is only performed on systems using `apt` package manager
- The role requires `become: true` to read system files and modify Wazuh configuration
- Files are verified as legitimate before being added to the ignore list
- The role will not add files that fail verification to the ignore list
