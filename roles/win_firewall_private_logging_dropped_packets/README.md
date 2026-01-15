# win_firewall_private_logging_dropped_packets

This role remediates CIS Benchmark 9.2.6 (check 26128): Ensure 'Windows Firewall: Private: Logging: Log dropped packets' is set to 'Yes'.

## Description

Use this option to log when Windows Firewall with Advanced Security discards an inbound packet for any reason. The log records why and when the packet was dropped. Look for entries with the word DROP in the action column of the log.

**The recommended state for this setting is: Yes.**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_private_logging_dropped_packets_log_dropped_packets` | `1` | Registry value for LogDroppedPackets in Private Profile Logging. 0 = No, 1 = Yes (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Private Profile Logging Dropped Packets
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_private_logging_dropped_packets
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Private Profile Logging Dropped Packets Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_private_logging_dropped_packets  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile\Logging`
- **Registry Value**: `LogDroppedPackets` (DWORD)
- **Value 0**: No - Windows Firewall will not log dropped packets
- **Value 1**: Yes - Windows Firewall will log when packets are dropped (CIS requirement)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Private Profile\Logging Customize\Log dropped packets`
3. Verify that "Log dropped packets" is set to "Yes"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile\Logging" -Name "LogDroppedPackets" | Select-Object -ExpandProperty LogDroppedPackets
```

Expected output: `1`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.2.6 (check 26128)
- **CIS CSC v7**: 6.3, 9.4
- **CIS CSC v8**: 4.5, 8.5
- **CMMC v2.0**: AC.L1-3.1.20, AU.L2-3.3.1, CM.L2-3.4.7, SC.L1-3.13.1, SC.L2-3.13.6
- **ISO 27001:2013**: A.12.4.1, A.13.1.1
- **NIST SP 800-53**: AU-3(1), AU-7, SC-7(5)
- **PCI DSS v3.2.1**: 1.1.4, 1.4, 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 1.2.1, 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC6.6, CC7.2

## Rationale

If events are not recorded it may be difficult or impossible to determine the root cause of system problems or the unauthorized activities of malicious users.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "Yes":

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Private Profile\Logging Customize\Log dropped packets`

## Checks

The Wazuh check (26128) passes if all of the following conditions are met (Condition: all):

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile\Logging` exists, AND
- The registry value `LogDroppedPackets` exists, AND
- The registry value `LogDroppedPackets` equals `1`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Audit Trail**: Provides logging of dropped packets for security analysis and incident investigation
- **Troubleshooting**: Helps identify why connections are being blocked
- **Compliance**: Meets requirements for multiple security frameworks and standards that require event logging
- **Threat Detection**: Enables detection of potential attacks by analyzing dropped packet patterns

## Notes

- This setting applies specifically to the Private Profile logging, which is used when the device is connected to a private network (home or work network)
- Logged events will appear in the firewall log file with "DROP" in the action column
- The firewall logging file location is configured separately (typically `%SystemRoot%\System32\logfiles\firewall\privatefw.log`)
- This role only configures the Private Profile; other profiles (Domain, Public) may need separate configuration
- If the registry key or value does not exist, the role will create them

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
