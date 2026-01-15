# win_rename_guest_account

This role remediates CIS Benchmark 2.3.1.5 (check 26012): Configure 'Accounts: Rename guest account'.

## Description

The Guest account exists on all computers that run the Windows 2000 or newer operating systems. If you rename this account, it is slightly more difficult for unauthorized persons to guess this privileged user name and password combination.

The built-in local guest account is another well-known name to attackers. It is recommended to rename this account to something that does not indicate its purpose. Even if you disable this account, which is recommended, ensure that you rename it for added security.

This role checks if the built-in guest account is named one of the well-known guest account names in various languages, and if so, renames it to a custom name.

**Well-known guest account names that will trigger a rename:**
- guest
- Guest
- Gast (German)
- Invité (French)
- Invitado (Spanish)
- Ospite (Italian)
- Convidado (Portuguese)
- Gäst (Swedish)
- Gjest (Norwegian)
- Gæst (Danish)
- Vieras (Finnish)
- Гость (Russian)
- Gość (Polish)
- Vendég (Hungarian)
- Host (Czech)
- Misafir (Turkish)
- Επισκέπτης (Greek)
- ゲスト (Japanese)
- 来宾 (Chinese Simplified)
- 來賓 (Chinese Traditional)
- 게스트 (Korean)
- ضيف (Arabic)
- אורח (Hebrew)
- บัญชีผู้ใช้ทั่วไป (Thai)

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to rename local user accounts

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_rename_guest_account_new_name` | `"LocalGuest"` | The new name to assign to the guest account if it currently has a well-known name |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Rename guest account
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_rename_guest_account_new_name: "MyCustomGuest"
  roles:
    - role: twanus.wazuh_fixer.win_rename_guest_account
```

Or using the development path:

```yaml
---
- name: Rename guest account
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_rename_guest_account_new_name: "MyCustomGuest"
  roles:
    - role: ../roles/win_rename_guest_account  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.1.5 (check 26012)
- **CIS CSC v8**: 4.7
- **PCI DSS v3.2.1**: 2.1, 2.1.1
- **PCI DSS v4.0**: 2.2.2, 2.3.1
- **SOC 2**: CC6.3

## Verification

You can verify the guest account name using:

```powershell
Get-CimInstance -Query "SELECT * FROM Win32_UserAccount WHERE LocalAccount = TRUE AND SID LIKE 'S-1-5-21-%-501'" | Select-Object Name
```

Or using the net command:

```powershell
net user
```

## Idempotency

This role is idempotent. If the guest account is already renamed to a non-well-known name, no changes will be made.

## Important Notes

- **Choose a non-obvious name**: It is recommended to choose a name that does not indicate its purpose as a guest account. Avoid names like "Guest", "guest", or variations that suggest guest access.

- **Disable and rename**: Even if you disable the guest account (which is recommended by CIS 2.3.1.2), ensure that you also rename it for added security. You can use this role in combination with the `win_guest_account_status` role.

- **SID limitation**: The built-in Guest account has a well-known SID (ending in -501). Some tools can still authenticate using the SID rather than the account name, so renaming provides only partial protection.

- **Domain Controllers**: This setting will have no impact when applied to Domain Controllers via group policy because Domain Controllers have no local account database.

- **Testing**: Test this role in a safe environment first. Renaming the guest account may affect scripts, services, or applications that reference the account by name.
