# Windows UAC Virtualize File and Registry Write Failures Role

## Description

This role remediates CIS Benchmark check 2.3.17.8 (check ID 26071): "Ensure 'User Account Control: Virtualize file and registry write failures to per-user locations' is set to 'Enabled'".

The role configures the Windows registry setting to enable virtualization of file and registry write failures to per-user locations. This policy setting controls whether application write failures are redirected to defined registry and file system locations, mitigating applications that run as administrator and write run-time application data to protected system locations.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_virtualize_file_registry_write_failures_enable_virtualization` | `1` | Registry value for EnableVirtualization. 0 = Disabled/Not Set - application write failures not redirected, 1 = Enabled - application write failures redirected to per-user locations (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Virtualize File and Registry Write Failures Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_virtualize_file_registry_write_failures
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Virtualize File and Registry Write Failures Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_virtualize_file_registry_write_failures  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.8 (check 26071)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

This setting reduces vulnerabilities by ensuring that legacy applications only write data to permitted locations. When enabled, this policy setting mitigates applications that run as administrator and write run-time application data to:

- `%ProgramFiles%`
- `%windir%`
- `%windir%\System32`
- `HKLM\SOFTWARE`

Instead of allowing these writes to fail or potentially cause security issues, Windows redirects them to per-user locations where the application can write safely without requiring elevated privileges or modifying system directories.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `EnableVirtualization`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "EnableVirtualization" -ErrorAction SilentlyContinue | Select-Object EnableVirtualization
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `EnableVirtualization` is set to 1 (Enabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Virtualize file and registry write failures to per-user locations`
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that legacy applications that attempt to write to protected system locations are redirected to per-user locations, reducing the risk of unauthorized system modifications and improving security posture.

- **Legacy application compatibility**: This setting is particularly important for legacy applications that were designed to write to system directories. Virtualization allows these applications to function correctly while maintaining security boundaries.

- **Protected locations**: The following locations are protected and will trigger virtualization when applications attempt to write to them:
  - `%ProgramFiles%`
  - `%windir%`
  - `%windir%\System32`
  - `HKLM\SOFTWARE`

- **Per-user locations**: Virtualized writes are redirected to per-user locations in the user's profile, ensuring that each user's application data is isolated and does not affect system-wide settings or other users.

- **Attack mitigation**: This setting helps mitigate the risk of applications running with elevated privileges attempting to modify system directories, which could be exploited by malicious software.

- **Best practice**: This setting should be enabled on all Windows systems to provide defense-in-depth against unauthorized system modifications and improve compatibility with legacy applications.

## License

GPL-2.0-or-later

## Author Information

This role is part of the `twanus.wazuh_fixer` Ansible collection.
