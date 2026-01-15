# Windows Reset Account Lockout Counter Role

## Description

This role remediates CIS Benchmark check 1.2.4 (check ID 26007): "Ensure 'Reset account lockout counter after' is set to '15 or more minute(s)'".

The role configures the Windows reset account lockout counter policy to specify how long before the failed logon attempt counter is reset. This works in conjunction with the account lockout threshold to prevent accidental account lockouts.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_account_lockout_reset_reset_lockout_count` | `15` | The number of minutes before the Account lockout threshold counter resets to zero. Must be at least 15 minutes (CIS requirement). This value should be less than or equal to the Account lockout duration. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Reset Account Lockout Counter Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_account_lockout_reset
```

### Override the default value

```yaml
---
- name: Set reset account lockout counter to 30 minutes
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_account_lockout_reset
      vars:
        win_account_lockout_reset_reset_lockout_count: 30
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.2.4 (check 26007)
- **CIS CSC v7**: 16.2, 16.11
- **CIS CSC v8**: 4.10
- **CMMC v2.0**: AC.L2-3.1.8, SC.L2-3.13.9
- **PCI DSS v4.0**: 8.3.4

## Rationale

Users can accidentally lock themselves out of their accounts if they mistype their password multiple times. To reduce the chance of such accidental lockouts, the Reset account lockout counter after setting determines the number of minutes that must elapse before the counter that tracks failed logon attempts and triggers lockouts is reset to 0.

If you leave this policy setting at its default value or configure the value to an interval that is too long, your environment could be vulnerable to a DoS attack. An attacker could maliciously perform a number of failed logon attempts on all users in the organization, which will lock out their accounts. If no policy were determined to reset the account lockout, it would be a manual task for administrators. Conversely, if a reasonable time value is configured for this policy setting, users would be locked out for a set period until all of the accounts are unlocked automatically.

## Notes

- Account Lockout Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- The minimum value is 15 minutes (CIS requirement).
- This value must be less than or equal to the Account lockout duration setting for the policy to be effective.
- This setting works in conjunction with the Account lockout threshold (CIS 1.2.2) and Account lockout duration (CIS 1.2.1) settings.
- Custom exceptions to the default account lockout policy rules for specific domain users and/or groups can be defined using Password Settings Objects (PSOs).

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
