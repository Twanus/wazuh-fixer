# win_rename_admin_account

This role remediates CIS Benchmark 2.3.1.4 (check 26011): Configure 'Accounts: Rename administrator account'.

## Description

The Administrator account exists on all computers that run the Windows 2000 or newer operating systems. If you rename this account, it is slightly more difficult for unauthorized persons to guess this privileged user name and password combination. The built-in Administrator account cannot be locked out, regardless of how many times an attacker might use a bad password. This capability makes the Administrator account a popular target for brute force attacks that attempt to guess passwords.

The value of this countermeasure is lessened because this account has a well-known SID, and there are third-party tools that allow authentication by using the SID rather than the account name. Therefore, even if you rename the Administrator account, an attacker could launch a brute force attack by using the SID to log on.

This role checks if the built-in administrator account is named one of the well-known administrator names in various languages, and if so, renames it to a custom name.

**Well-known administrator names that will trigger a rename:**
- Admin
- Administrator
- Администратор (Russian)
- Amministratore (Italian)
- Beheerder (Dutch)
- Järjestelmänvalvoja (Finnish)
- Správce (Czech)
- Rendszergazda (Hungarian)
- Yönetici (Turkish)
- Διαχειριστής (Greek)
- 管理者 (Japanese)
- 管理员 (Chinese Simplified)
- 系統管理員 (Chinese Traditional)
- 관리자 (Korean)
- مسؤول (Arabic)
- מנהל (Hebrew)
- ผู้ดูแลระบบ (Thai)

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to rename local user accounts

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_rename_admin_account_new_name` | `"LocalAdmin"` | The new name to assign to the administrator account if it currently has a well-known name |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Rename administrator account
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_rename_admin_account_new_name: "MyCustomAdmin"
  roles:
    - role: twanus.wazuh_fixer.win_rename_admin_account
```

Or using the development path:

```yaml
---
- name: Rename administrator account
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_rename_admin_account_new_name: "MyCustomAdmin"
  roles:
    - role: ../roles/win_rename_admin_account  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.1.4 (check 26011)
- **CIS CSC v8**: 4.7
- **PCI DSS v3.2.1**: 2.1, 2.1.1
- **PCI DSS v4.0**: 2.2.2, 2.3.1
- **SOC 2**: CC6.3

## Verification

You can verify the administrator account name using:

```powershell
Get-CimInstance -Query "SELECT * FROM Win32_UserAccount WHERE LocalAccount = TRUE AND SID LIKE 'S-1-5-21-%-500'" | Select-Object Name
```

Or using the net command:

```powershell
net user
```

## Idempotency

This role is idempotent. If the administrator account is already renamed to a non-well-known name, no changes will be made.

## Important Notes

- **Choose a non-obvious name**: It is recommended to choose a name that does not denote administrative or elevated access accounts. Avoid names like "Admin", "Administrator", or variations that suggest administrative privileges.

- **Change the description**: After renaming, it is also recommended to change the default description for the local administrator account through the Computer Management console.

- **SID limitation**: The built-in Administrator account has a well-known SID (ending in -500). Some tools can still authenticate using the SID rather than the account name, so renaming provides only partial protection.

- **Domain Controllers**: This setting will have no impact when applied to Domain Controllers via group policy because Domain Controllers have no local account database.

- **Testing**: Test this role in a safe environment first. Renaming the administrator account may affect scripts, services, or applications that reference the account by name.
