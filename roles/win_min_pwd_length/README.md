# Windows Minimum Password Length Role

## Description

This role remediates CIS Benchmark 1.1.4 (check 26003): "Ensure 'Minimum password length' is set to '14 or more characters'".

The role configures the Windows minimum password length policy to require passwords to be at least 14 characters long. This is a critical security control that helps prevent password-based attacks by requiring stronger passwords.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_min_pwd_length_minimum_password_length` | `14` | The minimum number of characters required in a password. Must be at least 14 characters (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Minimum Password Length Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_min_pwd_length
```

### Override the default value

```yaml
---
- name: Set minimum password length to 16 characters
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_min_pwd_length
      vars:
        win_min_pwd_length_minimum_password_length: 16
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.1.4 (check 26003)
- **CIS CSC v7**: 4.4, 16.2
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **ISO 27001:2013**: A.9.4.3
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Rationale

Longer passwords are more resistant to brute force attacks. A password of 14 characters or more significantly increases the time and computational resources required to crack a password, making it much more secure. Short passwords can be cracked quickly using modern computing power, even if they contain a mix of characters. The CIS Benchmark recommends a minimum of 14 characters as a balance between security and usability.

## Notes

- Password Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- The minimum value is 14 characters (CIS requirement).
- Windows supports password lengths up to 128 characters.
- This setting applies to new passwords and password changes; existing passwords are not affected until changed.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
