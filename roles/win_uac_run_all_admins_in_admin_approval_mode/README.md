# Windows UAC Run All Administrators in Admin Approval Mode Role

## Description

This role remediates CIS Benchmark check 2.3.17.6 (check ID 26069): "Ensure 'User Account Control: Run all administrators in Admin Approval Mode' is set to 'Enabled'".

The role configures the Windows registry setting to enable User Account Control (UAC) and Admin Approval Mode for all administrators. This is a critical security control that controls the behavior of all User Account Control (UAC) policy settings for the computer. If this setting is disabled, UAC will not be used and any security benefits and risk mitigations that are dependent on UAC will not be present on the system.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_run_all_admins_in_admin_approval_mode_enable_lua` | `1` | Registry value for EnableLUA. 0 = Disabled - UAC is disabled and security benefits are not present, 1 = Enabled - UAC is enabled and Admin Approval Mode is active for all administrators (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Run All Administrators in Admin Approval Mode Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_run_all_admins_in_admin_approval_mode
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Run All Administrators in Admin Approval Mode Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_run_all_admins_in_admin_approval_mode  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.6 (check 26069)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

This is the setting that turns on or off UAC. If this setting is disabled, UAC will not be used and any security benefits and risk mitigations that are dependent on UAC will not be present on the system. User Account Control (UAC) helps mitigate the impact of malware by helping prevent unauthorized changes to your computer. UAC ensures that important changes can only be made by users who have administrative rights. If you are logged on as an administrator, UAC prompts you for approval before performing any action that requires administrator privileges. If you are logged on as a standard user, UAC prompts you for an administrator password before performing such actions.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `EnableLUA`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "EnableLUA" -ErrorAction SilentlyContinue | Select-Object EnableLUA
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `EnableLUA` is set to 1 (Enabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Run all administrators in Admin Approval Mode`
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that UAC is active and all administrators run in Admin Approval Mode, providing critical security benefits and risk mitigations that depend on UAC.

- **System restart**: If you change this policy setting, you must restart your computer for the changes to take effect.

- **Security Center notification**: If this policy setting is disabled, the Security Center notifies you that the overall security of the operating system has been reduced.

- **UAC dependency**: This setting controls the behavior of all User Account Control (UAC) policy settings for the computer. All other UAC settings depend on this setting being enabled.

- **Admin Approval Mode**: When enabled, this setting ensures that all administrators run in Admin Approval Mode, which means that even administrative actions will prompt for approval, helping to prevent unauthorized changes.

- **Malware mitigation**: This setting helps mitigate the impact of malware by helping prevent unauthorized changes to your computer. UAC ensures that important changes can only be made by users who have administrative rights.

- **Best practice**: This setting should always be enabled on production systems to ensure that UAC security benefits are present.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
