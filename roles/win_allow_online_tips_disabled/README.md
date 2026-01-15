# win_allow_online_tips_disabled

This role remediates CIS Benchmark 18.1.3 (check 26169): Ensure 'Allow Online Tips' is set to 'Disabled'.

## Description

This policy setting configures the retrieval of online tips and help for the Settings app. When enabled, the Settings app can retrieve online tips and help content from Microsoft servers.

**The recommended state for this setting is:** Disabled

Due to privacy concerns, data should never be sent to any third-party since this data could contain sensitive information. Disabling this setting prevents the Settings app from retrieving online tips and help content, protecting user privacy and sensitive information.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically requires Administrator privileges)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_allow_online_tips_disabled_value` | `0` | Registry value for AllowOnlineTips. 0 = Disabled - online tips disabled (CIS requirement), 1 = Enabled - online tips enabled. |

## Dependencies

None.

## Example Playbook

### Using the Collection Format

```yaml
---
- name: Disable Allow Online Tips
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_allow_online_tips_disabled
```

### Using Development Path (for testing)

```yaml
---
- name: Disable Allow Online Tips
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_allow_online_tips_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 18.1.3 (check 26169)
- **CIS CSC v7**: 9.2
- **ISO 27001:2013**: A.13.1.3

## Rationale

Due to privacy concerns, data should never be sent to any third-party since this data could contain sensitive information. Disabling the Allow Online Tips setting prevents the Settings app from retrieving online tips and help content from Microsoft servers, protecting user privacy and preventing the transmission of potentially sensitive information.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to Disabled:

`Computer Configuration\Policies\Administrative Templates\Control Panel\Allow Online Tips`

Note: This Group Policy path is provided by the Group Policy template `ControlPanel.admx/adml` that is included with the Microsoft Windows 10 Release 1709 Administrative Templates (or newer).

## Checks

The Wazuh check (26169) passes if all of the following conditions are met:

1. Registry key exists: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer`
2. Registry value exists: `AllowOnlineTips`
3. Registry value equals: `0` (Disabled)

Condition: all (all conditions must be met)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer`
- **Value Name**: `AllowOnlineTips`
- **Value Type**: `REG_DWORD`
- **Required Value**: `0` (Disabled)

### Value Meanings

- **Value 0**: Disabled - online tips disabled (CIS requirement)
- **Value 1**: Enabled - online tips enabled
- **NOT_SET**: Not configured (default behavior may allow online tips)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "AllowOnlineTips" -ErrorAction SilentlyContinue | Select-Object AllowOnlineTips
```

Expected output: `0`

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer`
3. Check that `AllowOnlineTips` is set to `0`

Or via Group Policy:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Administrative Templates\Control Panel\Allow Online Tips`
3. Verify that the setting is set to "Disabled"

## Idempotency

This role is idempotent. If the registry value is already set to `0` (Disabled), no changes will be made. The role will create the value if it does not exist, or update it if it is different from `0`.

## Notes

- **Privacy benefit**: Disabling this setting prevents the Settings app from retrieving online tips and help content from Microsoft servers, protecting user privacy and preventing the transmission of potentially sensitive information.

- **Data transmission**: When enabled, this setting allows the Settings app to send data to Microsoft servers to retrieve online tips and help content. This data could contain sensitive information, so it should be disabled in security-conscious environments.

- **Settings app**: This setting specifically affects the Windows Settings app (Settings.exe), not other applications or help systems.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Administrative Templates\Control Panel\Allow Online Tips`

- **Windows version**: This policy setting is available in Windows 10 Release 1709 and later versions.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
