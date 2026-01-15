# win_firewall_public_logging_size_limit

This role remediates CIS Benchmark 9.3.7 (check 26136): Ensure 'Windows Firewall: Public: Logging: Size limit (KB)' is set to '16,384 KB or greater'.

## Description

Windows Firewall with Advanced Security provides host-based, two-way network traffic filtering for a device and blocks unauthorized network traffic flowing into or out of the local device. The Public Profile applies to networks that are not trusted, such as public Wi-Fi networks at airports, coffee shops, or other public locations.

The logging size limit setting specifies the maximum size of the file in which Windows Firewall will write its log information for the Public Profile. When the log file reaches this size limit, Windows Firewall will stop logging new events unless logging is configured to overwrite old entries.

**The recommended state for this setting is: 16,384 KB or greater.**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_public_logging_size_limit_log_file_size` | `16384` | Registry value for LogFileSize in Public Profile Logging (in KB). Must be >= 16384 KB per CIS requirement. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Public Profile Logging Size Limit
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_public_logging_size_limit
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Public Profile Logging Size Limit Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_public_logging_size_limit  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile\Logging`
- **Registry Value**: `LogFileSize` (DWORD)
- **Value Range**: Must be >= 16384 KB (CIS requirement)
- **Default Value**: 16384 KB (16 MB)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Public Profile\Logging Customize\Size limit (KB)`
3. Verify that "Size limit (KB)" is set to "16,384 KB or greater"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile\Logging" -Name "LogFileSize" | Select-Object -ExpandProperty LogFileSize
```

Expected output: A value >= `16384`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.3.7 (check 26136)
- **CIS CSC v7**: 6.4, 9.4
- **CIS CSC v8**: 8.3
- **ISO 27001:2013**: A.12.4.1, A.13.1.1
- **PCI DSS v3.2.1**: 10.7
- **SOC 2**: A1.1

## Rationale

If events are not recorded, it may be difficult or impossible to determine the root cause of system problems or the unauthorized activities of malicious users. A sufficient log file size ensures that important security events are not lost due to log file size limitations. Setting the log file size to at least 16,384 KB (16 MB) provides adequate space for logging firewall events while preventing excessive disk usage.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to 16,384 KB or greater:

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Public Profile\Logging Customize\Size limit (KB)`

## Checks

The Wazuh check (26136) passes if all of the following conditions are met:

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile\Logging` exists, AND
- The registry value `LogFileSize` exists, AND
- The registry value `LogFileSize` is >= 16384

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly (>= 16384 KB), the role will report that no changes were needed. If the current value is less than the required minimum, the role will update it to meet the requirement.

## Security Benefits

- **Audit Trail**: Ensures sufficient log file size to capture important security events
- **Forensic Analysis**: Provides adequate logging capacity for incident investigation
- **Compliance**: Meets requirements for multiple security frameworks and standards
- **Event Retention**: Prevents loss of critical security events due to log file size limitations

## Notes

- This setting applies specifically to the Public Profile logging, which is used when the device is connected to untrusted networks (e.g., public Wi-Fi)
- The log file size is specified in kilobytes (KB)
- If the registry key or value does not exist, the role will create them
- The role sets the value to the minimum required (16384 KB) by default, but you can override it with a larger value if needed
- This role only configures the Public Profile logging; other profiles (Domain, Private) may need separate configuration
- Larger log files provide more historical data but consume more disk space

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
