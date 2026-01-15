# Windows UAC Detect Application Installations Role

## Description

This role remediates CIS Benchmark check 2.3.17.4 (check ID 26067): "Ensure 'User Account Control: Detect application installations and prompt for elevation' is set to 'Enabled'".

The role configures the Windows registry setting to enable application installation detection for the computer. This policy setting controls the behavior of application installation detection, which helps prevent malicious software from installing itself after being given permission to run.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_detect_app_installations_enable_installer_detection` | `1` | Registry value for EnableInstallerDetection. 0 = Disabled - application installation detection disabled, 1 = Enabled - application installation detection enabled and prompts for elevation (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Detect Application Installations Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_detect_app_installations
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Detect Application Installations Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_detect_app_installations  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.4 (check 26067)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

Some malicious software will attempt to install itself after being given permission to run. For example, malicious software with a trusted application shell. The user may have given permission for the program to run because the program is trusted, but if they are then prompted for installation of an unknown component this provides another way of trapping the software before it can do damage.

When this policy setting is enabled, Windows will detect application installation attempts and prompt for elevation, providing an additional layer of security against malicious software installation.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `EnableInstallerDetection`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "EnableInstallerDetection" -ErrorAction SilentlyContinue | Select-Object EnableInstallerDetection
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `EnableInstallerDetection` is set to 1 (Enabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Detect application installations and prompt for elevation`
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that Windows detects application installation attempts and prompts for elevation, providing an additional layer of security against malicious software that may attempt to install itself after being given permission to run.

- **Application installation detection**: When enabled, Windows monitors for application installation patterns and prompts for elevation when detected, even if the initial application was trusted.

- **Attack mitigation**: This setting helps mitigate the risk of malicious software with trusted application shells attempting to install additional components without user awareness.

- **User experience**: Users will see elevation prompts when application installations are detected, which may slightly impact user experience but significantly improves security.

- **Trusted applications**: Even trusted applications that attempt to install components will trigger elevation prompts, ensuring users are aware of all installation activities.

- **Best practice**: This setting should be enabled on all Windows systems to provide defense-in-depth against malicious software installation attempts.

## License

GPL-2.0-or-later

## Author Information

This role is part of the `twanus.wazuh_fixer` Ansible collection.
