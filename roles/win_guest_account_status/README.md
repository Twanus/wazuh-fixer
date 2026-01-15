# win_guest_account_status

This role remediates CIS Benchmark 2.3.1.2 (check 26009): Ensure 'Accounts: Guest account status' is set to 'Disabled'.

## Description

The Guest account allows unauthenticated network users to log on as Guest with no password. These unauthorized users could access any resources that are accessible to the Guest account over the network. This capability means that any network shares with permissions that allow access to the Guest account, the Guests group, or the Everyone group will be accessible over the network, which could lead to the exposure or corruption of data.

This role checks the status of the Guest account and disables it if it is currently enabled.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to disable local user accounts

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_guest_account_status_should_be_disabled` | `true` | Ensures the Guest account is disabled (always enforced) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Guest account
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_guest_account_status
```

Or using the development path:

```yaml
---
- name: Disable Guest account
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_guest_account_status  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.1.2 (check 26009)
- **CIS CSC v7**: 16.8
- **CIS CSC v8**: 4.7
- **ISO 27001:2013**: A.9.2.1
- **PCI DSS v3.2.1**: 2.1, 2.1.1
- **PCI DSS v4.0**: 2.2.2, 2.3.1
- **SOC 2**: CC6.3

## Verification

The role uses WMI/CIM to query the Guest account status. The Guest account has a well-known SID ending in `-501`. After applying the role, you can verify the status using:

```powershell
Get-CimInstance -Query "SELECT * FROM Win32_UserAccount WHERE LocalAccount = TRUE AND SID LIKE 'S-1-5-21-%-501'" | Select-Object Name, Disabled
```

Or using the net command:

```powershell
net user Guest
```

## Idempotency

This role is idempotent. If the Guest account is already disabled, no changes will be made.

## Notes

- This setting will have no impact when applied to Domain Controllers via group policy because Domain Controllers have no local account database.
- The role uses PowerShell's `Disable-LocalUser` cmdlet to disable the account.
