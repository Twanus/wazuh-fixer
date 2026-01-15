# win_interactive_logon_require_ctrl_alt_del

This role remediates CIS Benchmark 2.3.7.1 (check 26022): Ensure 'Interactive logon: Do not require CTRL+ALT+DEL' is set to 'Disabled'.

## Description

Microsoft developed this feature to make it easier for users with certain types of physical impairments to log on to computers that run Windows. If users are not required to press CTRL+ALT+DEL, they are susceptible to attacks that attempt to intercept their passwords. If CTRL+ALT+DEL is required before logon, user passwords are communicated by means of a trusted path. An attacker could install a Trojan horse program that looks like the standard Windows logon dialog box and capture the user's password. The attacker would then be able to log on to the compromised account with whatever level of privilege that user has.

This policy setting determines whether users must press CTRL+ALT+DEL before they log on.

**The recommended state for this setting is: Disabled.**

When Disabled, users must press CTRL+ALT+DEL before logging on, which ensures that user passwords are communicated via a trusted path and protects against Trojan horse programs that mimic the Windows logon dialog box.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_require_ctrl_alt_del_disabled_value` | `0` | Registry value for DisableCAD (0 = Disabled - requires CTRL+ALT+DEL) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Require CTRL+ALT+DEL for interactive logon
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_require_ctrl_alt_del
```

Or using the development path:

```yaml
---
- name: Require CTRL+ALT+DEL for interactive logon
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_interactive_logon_require_ctrl_alt_del  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.1 (check 26022)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `DisableCAD`
- **Value Type**: `REG_DWORD`
- **Required Value**: `0` (Disabled - requires CTRL+ALT+DEL)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "DisableCAD" -ErrorAction SilentlyContinue | Select-Object DisableCAD
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `DisableCAD` is set to `0`

## Idempotency

This role is idempotent. If the registry value is already set to `0` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Requiring CTRL+ALT+DEL before logon ensures that user passwords are communicated via a trusted path, protecting against Trojan horse programs that mimic the Windows logon dialog box.

- **Accessibility consideration**: This feature was originally developed to make it easier for users with certain types of physical impairments to log on. However, disabling CTRL+ALT+DEL requirement creates a security vulnerability.

- **Trojan horse protection**: If CTRL+ALT+DEL is not required, an attacker could install a Trojan horse program that looks like the standard Windows logon dialog box and capture the user's password. The attacker would then be able to log on to the compromised account with whatever level of privilege that user has.

- **Trusted path**: The CTRL+ALT+DEL key combination invokes Windows' secure attention sequence (SAS), which cannot be intercepted by applications. This ensures that the logon dialog box is displayed by the Windows operating system itself, not by a malicious program.

- **If the registry value does not exist**, it will be treated as if it's set to 1 (Enabled), and the role will create it and set it to `0` (Disabled) to ensure compliance.
