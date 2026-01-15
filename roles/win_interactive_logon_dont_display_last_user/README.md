# win_interactive_logon_dont_display_last_user

This role remediates CIS Benchmark 2.3.7.2 (check 26023): Ensure 'Interactive logon: Don't display last signed-in' is set to 'Enabled'.

## Description

An attacker with access to the console (for example, someone with physical access or someone who is able to connect to the server through Remote Desktop Services) could view the name of the last user who logged on to the server. The attacker could then try to guess the password, use a dictionary, or use a brute-force attack to try and log on.

This policy setting determines whether the account name of the last user to log on to the client computers in your organization will be displayed in each computer's respective Windows logon screen. Enable this policy setting to prevent intruders from collecting account names visually from the screens of desktop or laptop computers in your organization.

**The recommended state for this setting is: Enabled.**

**Note**: In older versions of Microsoft Windows, this setting was named "Interactive logon: Do not display last user name", but it was renamed starting with Windows 10 Release 1703.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_dont_display_last_user_enabled_value` | `1` | Registry value for DontDisplayLastUserName (1 = Enabled - does not display last user name) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Don't display last signed-in user name
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_dont_display_last_user
```

Or using the development path:

```yaml
---
- name: Don't display last signed-in user name
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_interactive_logon_dont_display_last_user  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.2 (check 26023)
- **CIS CSC v7**: 5.1
- **CIS CSC v8**: 4.1
- **CMMC v2.0**: AC.L1-3.1.1, AC.L1-3.1.2, CM.L2-3.4.1, CM.L2-3.4.2, CM.L2-3.4.6, CM.L2-3.4.7
- **ISO 27001:2013**: A.14.2.5, A.8.1.3
- **NIST SP 800-53**: CM-7(1), CM-9, SA-10
- **PCI DSS v3.2.1**: 11.5, 2.2
- **PCI DSS v4.0**: 1.1.1, 1.2.1, 1.2.6, 1.2.7, 1.5.1, 2.1.1, 2.2.1
- **SOC 2**: CC7.1, CC8.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `DontDisplayLastUserName`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled - does not display last user name)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "DontDisplayLastUserName" -ErrorAction SilentlyContinue | Select-Object DontDisplayLastUserName
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `DontDisplayLastUserName` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Security benefit**: Preventing the display of the last signed-in user name helps protect against attackers who may have physical or remote access to the console. By hiding account names, attackers cannot easily identify valid user accounts to target.

- **Attack prevention**: When the last user name is displayed, attackers can:
  - Try to guess the password for that account
  - Use dictionary attacks against that account
  - Use brute-force attacks against that account

- **User experience**: When enabled, users will need to type their full username instead of selecting from a previously signed-in user list. This is a minor inconvenience that significantly improves security.

- **Setting name change**: In older versions of Microsoft Windows, this setting was named "Interactive logon: Do not display last user name", but it was renamed starting with Windows 10 Release 1703 to "Interactive logon: Don't display last signed-in".

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure compliance.
