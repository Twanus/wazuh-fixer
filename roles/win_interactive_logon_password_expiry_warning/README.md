# win_interactive_logon_password_expiry_warning

This role remediates CIS Benchmark 2.3.7.8 (check 26029): Ensure 'Interactive logon: Prompt user to change password before expiration' is set to 'between 5 and 14 days'.

## Description

Users will need to be warned that their passwords are going to expire, or they may inadvertently be locked out of the computer when their passwords expire. This condition could lead to confusion for users who access the network locally, or make it impossible for users to access your organization's network through dial-up or virtual private network (VPN) connections.

This policy setting determines how far in advance users are warned that their password will expire. It is recommended that you configure this policy setting to at least 5 days but no more than 14 days to sufficiently warn users when their passwords will expire.

**The recommended state for this setting is: between 5 and 14 days.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_password_expiry_warning_warning_days` | `14` | Number of days before password expiration to warn users. Must be between 5 and 14 days (inclusive). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set password expiry warning
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_password_expiry_warning
```

Or using the development path:

```yaml
---
- name: Set password expiry warning
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_password_expiry_warning_warning_days: 14
  roles:
    - role: ../roles/win_interactive_logon_password_expiry_warning  # noqa role-name[path]
```

### Override to use a different warning period

```yaml
---
- name: Set password expiry warning to 7 days
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_password_expiry_warning_warning_days: 7
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_password_expiry_warning
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.8 (check 26029)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon`
- **Value Name**: `PasswordExpiryWarning`
- **Value Type**: `REG_DWORD`
- **Required Value**: Between 5 and 14 days (inclusive)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" -Name "PasswordExpiryWarning" -ErrorAction SilentlyContinue | Select-Object PasswordExpiryWarning
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon`
3. Check that `PasswordExpiryWarning` is set to a value between 5 and 14 days

## Idempotency

This role is idempotent. If the registry value is already set to a value between 5 and 14 days (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to a value less than 5 days
- It is currently set to a value greater than 14 days
- It is currently set to a different value than the configured value

## Notes

- **User experience**: Warning users before their password expires helps prevent inadvertent lockouts. Users will receive a warning message the specified number of days before their password expires, giving them time to change it.

- **Recommended range**: The CIS Benchmark recommends at least 5 days but no more than 14 days. This provides sufficient warning time without being excessive.

- **Default value**: The default value is 14 days (the maximum recommended), which provides the maximum warning time. Organizations may choose a shorter period (e.g., 7 or 10 days) if desired.

- **VPN and dial-up connections**: This setting is particularly important for users who access the network through dial-up or VPN connections, as they may not be aware that their password is about to expire.

- **Password expiration**: This setting works in conjunction with the maximum password age setting (CIS 1.1.2) to ensure users are properly notified before their passwords expire.

- **If the registry value does not exist**, it will be created and set to 14 days (or the configured value) to ensure compliance. Note that according to the CIS check, the absence of this value is also considered compliant, but setting it explicitly is recommended.
