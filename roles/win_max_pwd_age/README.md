# Windows Maximum Password Age Role

## Description

This role remediates CIS Benchmark 1.1.2 (check 26001): "Ensure 'Maximum password age' is set to '365 or fewer days, but not 0'".

The role configures the Windows maximum password age policy to require users to change their passwords periodically. This is a critical security control that helps prevent long-term password compromise.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_max_pwd_age_maximum_password_age` | `365` | The maximum number of days a password can be used before it must be changed. Must be between 1 and 365 days. Cannot be 0. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Maximum Password Age Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_max_pwd_age
```

### Override the default value

```yaml
---
- name: Set maximum password age to 90 days
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_max_pwd_age
      vars:
        win_max_pwd_age_maximum_password_age: 90
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.1.2 (check 26001)
- **CIS CSC v7**: 16.10
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Rationale

Passwords that are not changed regularly are more vulnerable to compromise. If a password is compromised and never changed, an attacker can maintain access indefinitely. Setting a maximum password age ensures that even if a password is compromised, the window of opportunity for an attacker is limited. However, setting the age to 0 (never expire) defeats this security measure entirely.

## Notes

- Password Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- The value 0 means "never expire" and is explicitly not allowed by this role.
- The maximum value is 365 days (1 year).
- To maintain the effectiveness of this policy setting, use the Minimum password age setting to prevent users from immediately changing passwords back.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
