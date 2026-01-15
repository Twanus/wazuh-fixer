# Windows Account Lockout Duration Role

## Description

This role remediates CIS Benchmark check 1.2.1 (check ID 26005): "Ensure 'Account lockout duration' is set to '15 or more minute(s)'".

The role configures the Windows account lockout duration policy to specify how long an account remains locked after failed login attempts. This is a critical security control that helps prevent brute force attacks while balancing security with usability.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify local security policy (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_account_lockout_duration_lockout_duration` | `15` | The number of minutes a locked out account will remain unavailable. Must be at least 15 minutes (CIS requirement). Set to 0 to require manual unlock by administrator. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Account Lockout Duration Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_account_lockout_duration
```

### Override the default value

```yaml
---
- name: Set account lockout duration to 30 minutes
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: twanus.wazuh_fixer.win_account_lockout_duration
      vars:
        win_account_lockout_duration_lockout_duration: 30
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.2.1 (check 26005)
- **CIS CSC v7**: 16.2, 16.11
- **CIS CSC v8**: 4.10
- **CMMC v2.0**: AC.L2-3.1.8, SC.L2-3.13.9
- **PCI DSS v4.0**: 8.3.4

## Rationale

A denial of service (DoS) condition can be created if an attacker abuses the Account lockout threshold and repeatedly attempts to log on with a specific account. Once you configure the Account lockout threshold setting, the account will be locked out after the specified number of failed attempts. If you configure the Account lockout duration setting to 0, then the account will remain locked out until an administrator unlocks it manually.

Although it might seem like a good idea to configure the value for this policy setting to a high value, such a configuration will likely increase the number of calls that the help desk receives to unlock accounts locked by mistake. Users should be aware of the length of time a lock remains in place, so that they realize they only need to call the help desk if they have an extremely urgent need to regain access to their computer.

## Notes

- Account Lockout Policy settings must be applied via the Default Domain Policy GPO in order to be globally in effect on domain user accounts as their default behavior.
- If these settings are configured in another GPO, they will only affect local user accounts on the computers that receive the GPO.
- The minimum value is 15 minutes (CIS requirement).
- Setting the value to 0 means accounts will remain locked until manually unlocked by an administrator.
- This setting works in conjunction with the Account lockout threshold setting.
- Custom exceptions to the default account lockout policy rules for specific domain users and/or groups can be defined using Password Settings Objects (PSOs).

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
