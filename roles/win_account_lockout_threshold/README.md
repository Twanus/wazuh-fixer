# Windows Account Lockout Threshold Role

## Description

This role remediates CIS Benchmark check 1.2.2 (check ID 26006): "Ensure 'Account lockout threshold' is set to '5 or fewer invalid logon attempt(s), but not 0'".

The role configures the Windows account lockout threshold policy to specify the number of failed logon attempts before an account is locked. This is a critical security control that helps prevent brute force attacks while balancing security with usability.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_account_lockout_threshold_lockout_threshold` | `5` | The number of failed logon attempts before an account is locked. Must be between 1 and 5 (CIS requirement: <= 5 but not 0). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Account Lockout Threshold Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_account_lockout_threshold
```

### Override the default value

```yaml
---
- name: Set account lockout threshold to 3 attempts
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_account_lockout_threshold
      vars:
        win_account_lockout_threshold_lockout_threshold: 3
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.2.2 (check 26006)
- **CIS CSC v7**: 16.2, 16.11
- **CIS CSC v8**: 4.10
- **CMMC v2.0**: AC.L2-3.1.8, SC.L2-3.13.9
- **PCI DSS v4.0**: 8.3.4

## Rationale

Setting an account lockout threshold reduces the likelihood that an online password brute force attack will be successful. If an attacker attempts to guess a password through brute force, the account will be locked after the specified number of failed attempts, preventing further attempts.

However, setting the account lockout threshold too low introduces risk of increased accidental lockouts and/or a malicious actor intentionally locking out accounts (DoS attack). The CIS Benchmark recommends 5 or fewer attempts as a balance between security and usability.

## Notes

- Account Lockout Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- The value must be between 1 and 5 (CIS requirement: <= 5 but not 0).
- Setting the value to 0 disables account lockout (not allowed by CIS).
- This setting works in conjunction with the Account lockout duration (CIS 1.2.1) and Account lockout observation window settings.
- Custom exceptions to the default account lockout policy rules for specific domain users and/or groups can be defined using Password Settings Objects (PSOs).

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
