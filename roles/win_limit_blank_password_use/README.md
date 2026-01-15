# win_limit_blank_password_use

This role remediates CIS Benchmark 2.3.1.3 (check 26010): Ensure 'Accounts: Limit local account use of blank passwords to console logon only' is set to 'Enabled'.

## Description

Blank passwords are a serious threat to computer security and should be forbidden through both organizational policy and suitable technical measures. In fact, the default settings for Active Directory domains require complex passwords of at least seven characters. However, if users with the ability to create new accounts bypass your domain-based password policies, they could create accounts with blank passwords. For example, a user could build a stand-alone computer, create one or more accounts with blank passwords, and then join the computer to the domain. The local accounts with blank passwords would still function. Anyone who knows the name of one of these unprotected accounts could then use it to log on.

This policy setting determines whether local accounts that are not password protected can be used to log on from locations other than the physical computer console. If you enable this policy setting, local accounts that have blank passwords will not be able to log on to the network from remote client computers. Such accounts will only be able to log on at the keyboard of the computer.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_limit_blank_password_use_enabled_value` | `1` | Registry value for LimitBlankPasswordUse (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Limit blank password accounts to console logon only
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_limit_blank_password_use
```

Or using the development path:

```yaml
---
- name: Limit blank password accounts to console logon only
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_limit_blank_password_use  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.1.3 (check 26010)
- **CIS CSC v7**: 4.4
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **ISO 27001:2013**: A.9.4.3
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
- **Value Name**: `LimitBlankPasswordUse`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa" -Name "LimitBlankPasswordUse" | Select-Object LimitBlankPasswordUse
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
3. Check that `LimitBlankPasswordUse` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- This setting only affects local accounts on the computer. Domain accounts are not affected by this setting.
- If the registry value does not exist, it will be created and set to `1` (Enabled).
