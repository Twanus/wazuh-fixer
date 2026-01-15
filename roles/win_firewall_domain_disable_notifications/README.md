# win_firewall_domain_disable_notifications

This role remediates CIS Benchmark 9.1.3 (check 26118): Ensure 'Windows Firewall: Domain: Settings: Display a notification' is set to 'No'.

## Description

Windows Firewall with Advanced Security can display notifications to users when a program is blocked from receiving inbound connections. The Domain Profile applies to networks where the host can authenticate to a domain controller.

Select this option to have Windows Firewall with Advanced Security display notifications to the user when a program is blocked from receiving inbound connections. Firewall notifications can be complex and may confuse the end users, who would not be able to address the alert.

**The recommended state for this setting is: No.**

Note: When the Apply local firewall rules setting is configured to No, it's recommended to also configure the Display a notification setting to No. Otherwise, users will continue to receive messages that ask if they want to unblock a restricted inbound connection, but the user's response will be ignored.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_domain_disable_notifications_disable_notifications` | `1` | Registry value for DisableNotifications in Domain Profile. 0 = Yes (display notifications), 1 = No (disable notifications, CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Domain Profile Display Notification Setting
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_domain_disable_notifications
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Domain Profile Display Notification Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_domain_disable_notifications  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile`
- **Registry Value**: `DisableNotifications` (DWORD)
- **Value 0**: Yes - Display notifications when programs are blocked
- **Value 1**: No - Do not display notifications (CIS requirement)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Domain Profile\Settings Customize\Display a notification`
3. Verify that "Display a notification" is set to "No"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile" -Name "DisableNotifications" | Select-Object -ExpandProperty DisableNotifications
```

Expected output: `1`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.1.3 (check 26118)
- **CIS CSC v7**: 9.4, 11.2
- **CIS CSC v8**: 4.5
- **CMMC v2.0**: AC.L1-3.1.20, CM.L2-3.4.7, SC.L1-3.13.1, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.1
- **NIST SP 800-53**: SC-7(5)
- **PCI DSS v3.2.1**: 1.1.4, 1.4
- **PCI DSS v4.0**: 1.2.1
- **SOC 2**: CC6.6

## Rationale

Firewall notifications can be complex and may confuse the end users, who would not be able to address the alert. Disabling notifications prevents user confusion and reduces the risk of users making incorrect decisions when prompted about firewall blocks.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "No":

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Domain Profile\Settings Customize\Display a notification`

## Checks

The Wazuh check (26118) passes if all of the following conditions are met:

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile` exists, AND
- The registry value `DisableNotifications` exists, AND
- The registry value `DisableNotifications` equals `1`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Reduced User Confusion**: Prevents complex firewall notifications that users may not understand
- **Consistent Policy Enforcement**: Ensures firewall rules are applied without user intervention
- **Compliance**: Meets requirements for multiple security frameworks and standards
- **User Experience**: Eliminates unnecessary prompts that users cannot effectively respond to

## Notes

- This setting applies specifically to the Domain Profile, which is used when the device is connected to a network where it can authenticate to a domain controller
- When the Apply local firewall rules setting is configured to No, it's recommended to also configure the Display a notification setting to No
- If the registry key or value does not exist, the role will create them
- This role only configures the Domain Profile; other profiles (Private, Public) may need separate configuration

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
