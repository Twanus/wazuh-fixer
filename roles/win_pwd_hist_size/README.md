# Windows Password History Role

## Description

This role remediates CIS Benchmark 1.1.1 (check 26000): "Ensure 'Enforce password history' is set to '24 or more password(s)'".

The role configures the Windows password history policy to prevent users from reusing passwords. This is a critical security control that helps prevent password-based attacks.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_pwd_hist_size_password_history_size` | `24` | The number of unique passwords that must be used before a password can be reused. Must be between 0 and 24. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Password History Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_pwd_hist_size
```

### Override the default value

```yaml
---
- name: Set password history to maximum (24)
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_pwd_hist_size
      vars:
        win_pwd_hist_size_password_history_size: 24
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.1.1 (check 26000)
- **CIS CSC v7**: 16.2
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Rationale

The longer a user uses the same password, the greater the chance that an attacker can determine the password through brute force attacks. Also, any accounts that may have been compromised will remain exploitable for as long as the password is left unchanged. If password changes are required but password reuse is not prevented, or if users continually reuse a small number of passwords, the effectiveness of a good password policy is greatly reduced.

## Notes

- Password Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- Microsoft currently has a maximum limit of 24 saved passwords.
- To maintain the effectiveness of this policy setting, use the Minimum password age setting to prevent users from repeatedly changing their password.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
