# Windows Block Microsoft Accounts Role

## Description

This role remediates CIS Benchmark check 2.3.1.1 (check ID 26008): "Ensure 'Accounts: Block Microsoft accounts' is set to 'Users can't add or log on with Microsoft accounts'".

The role configures the Windows registry setting to prevent users from adding or logging on with Microsoft accounts. This is a critical security control that helps organizations maintain firm control of what accounts are used to log onto their computers.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_block_ms_accounts_no_connected_user` | `3` | Registry value for NoConnectedUser. 0 = User's Microsoft account optional, 1 = User's Microsoft account optional for Windows Store apps, 3 = Users can't add or log on with Microsoft accounts (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Block Microsoft Accounts Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_block_ms_accounts
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 2.3.1.1 (check 26008)
- **CIS CSC v7**: 16.2
- **CIS CSC v8**: 5.6
- **NIST SP 800-53**: AC-2(1)
- **SOC 2**: CC6.1

## Rationale

Organizations that want to effectively implement identity management policies and maintain firm control of what accounts are used to log onto their computers will probably want to block Microsoft accounts. Organizations may also need to block Microsoft accounts in order to meet the requirements of compliance standards that apply to their information systems.

## Notes

- Registry path: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- Registry value: `NoConnectedUser` (DWORD)
- Value 0: User's Microsoft account optional
- Value 1: User's Microsoft account optional for Windows Store apps
- Value 3: Users can't add or log on with Microsoft accounts (CIS requirement)
- This setting prevents users from adding new Microsoft accounts on this computer.
- This setting applies to local accounts on the computer; domain accounts are not affected.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
