# Windows Minimum Password Age Role

## Description

This role remediates CIS Benchmark 1.1.3 (check 26002): "Ensure 'Minimum password age' is set to '1 or more day(s)'".

The role configures the Windows minimum password age policy to prevent users from changing their passwords immediately. This security control works together with password history to prevent users from quickly cycling through passwords to reuse an old one.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_min_pwd_age_minimum_password_age` | `1` | The minimum number of days a password must be used before it can be changed. Must be at least 1 day. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Minimum Password Age Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_min_pwd_age
```

### Override the default value

```yaml
---
- name: Set minimum password age to 2 days
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_min_pwd_age
      vars:
        win_min_pwd_age_minimum_password_age: 2
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.1.3 (check 26002)
- **CIS CSC v7**: 16.10
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Rationale

If users are allowed to change their passwords immediately after setting them, they can easily bypass the password history requirement by rapidly changing their password multiple times until they can reuse their original password. Setting a minimum password age prevents users from immediately changing their passwords, ensuring that the password history policy is effective. This works together with the password history policy (CIS 1.1.1) to prevent password reuse.

## Notes

- Password Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- The minimum value is 1 day (CIS requirement).
- The minimum password age must be less than the maximum password age for the policy to be effective.
- This setting works in conjunction with password history (CIS 1.1.1) to prevent password reuse.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
