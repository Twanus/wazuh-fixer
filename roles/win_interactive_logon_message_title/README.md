# win_interactive_logon_message_title

This role remediates CIS Benchmark 2.3.7.6 (check 26027): Configure 'Interactive logon: Message title for users attempting to log on'.

## Description

Displaying a warning message before logon may help prevent an attack by warning the attacker about the consequences of their misconduct before it happens. It may also help to reinforce corporate policy by notifying employees of the appropriate policy during the logon process.

This policy setting specifies the text displayed in the title bar of the window that users see when they log on to the system. Configure this setting in a manner that is consistent with the security and operational requirements of your organization.

**The recommended state for this setting is: Configured (any non-empty value).**

**Note**: This setting works in conjunction with "Interactive logon: Message text for users attempting to log on" to display a complete warning message to users before they log on.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_message_title_message_title` | `"Security Notice"` | The message title text to display in the title bar of the logon warning window. Should be consistent with your organization's security and operational requirements. |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure interactive logon message title
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_message_title
```

Or using the development path:

```yaml
---
- name: Configure interactive logon message title
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_message_title_message_title: "Company Security Policy"
  roles:
    - role: ../roles/win_interactive_logon_message_title  # noqa role-name[path]
```

### Customize the message title

```yaml
---
- name: Configure custom interactive logon message title
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_message_title_message_title: "Unauthorized Access Prohibited"
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_message_title
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.6 (check 26027)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `LegalNoticeCaption`
- **Value Type**: `REG_SZ` (String)
- **Required Value**: Any non-empty text (not empty/blank)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "LegalNoticeCaption" -ErrorAction SilentlyContinue | Select-Object LegalNoticeCaption
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `LegalNoticeCaption` is set to a non-empty text value

Or using the command line:

```cmd
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system /v legalnoticecaption
```

## Idempotency

This role is idempotent. If the registry value is already set to the configured value (non-empty text), no changes will be made.

## Notes

- **Security benefit**: Displaying a warning message before logon helps prevent attacks by warning attackers about the consequences of their misconduct before it happens.

- **Corporate policy**: This setting helps reinforce corporate policy by notifying employees of the appropriate policy during the logon process.

- **Message title vs message text**: This setting configures the title of the warning window. You may also want to configure "Interactive logon: Message text for users attempting to log on" to provide the actual warning message content.

- **Customization**: The default value is "Security Notice", but you should customize this to match your organization's security and operational requirements. Common examples include:
  - "Security Notice"
  - "Unauthorized Access Prohibited"
  - "Company Security Policy"
  - "Warning: Authorized Use Only"

- **Legal compliance**: In some jurisdictions, displaying warning messages before logon may help establish legal grounds for prosecution if unauthorized access occurs.

- **If the registry value does not exist or is empty**, it will be created and set to the configured value (default: "Security Notice") to ensure compliance.
