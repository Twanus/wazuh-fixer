# win_firewall_domain_logging_successful_connections

This role remediates CIS Benchmark 9.1.7 (check 26122): Ensure 'Windows Firewall: Domain: Logging: Log successful connections' is set to 'Yes'.

## Description

Use this option to log when Windows Firewall with Advanced Security allows an inbound connection. The log records why and when the connection was formed. Look for entries with the word ALLOW in the action column of the log.

**The recommended state for this setting is: Yes.**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_domain_logging_successful_connections_value` | `1` | Registry value for LogSuccessfulConnections in Domain Profile Logging. 0 = No, 1 = Yes (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Domain Profile Logging Successful Connections
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_domain_logging_successful_connections
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Domain Profile Logging Successful Connections Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_domain_logging_successful_connections  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile\Logging`
- **Registry Value**: `LogSuccessfulConnections` (DWORD)
- **Value 0**: No - Windows Firewall will not log successful connections
- **Value 1**: Yes - Windows Firewall will log successful connections (CIS requirement)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Domain Profile\Logging Customize\Log successful connections`
3. Verify that "Log successful connections" is set to "Yes"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile\Logging" -Name "LogSuccessfulConnections" | Select-Object -ExpandProperty LogSuccessfulConnections
```

Expected output: `1`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.1.7 (check 26122)
- **CIS CSC v7**: 6.3, 9.4
- **CIS CSC v8**: 4.5, 8.5
- **CMMC v2.0**: AC.L1-3.1.20, AU.L2-3.3.1, CM.L2-3.4.7, SC.L1-3.13.1, SC.L2-3.13.6
- **ISO 27001:2013**: A.12.4.1, A.13.1.1
- **NIST SP 800-53**: AU-3(1), AU-7, SC-7(5)
- **PCI DSS v3.2.1**: 1.1.4, 1.4, 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 1.2.1, 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC6.6, CC7.2

## Rationale

If events are not recorded it may be difficult or impossible to determine the root cause of system problems or the unauthorized activities of malicious users. Logging successful connections helps create an audit trail of allowed network traffic, which is essential for security monitoring, incident response, and compliance.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "Yes":

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Domain Profile\Logging Customize\Log successful connections`

## Checks

The Wazuh check (26122) passes if all of the following conditions are met:

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile\Logging` exists, AND
- The registry value `LogSuccessfulConnections` exists, AND
- The registry value `LogSuccessfulConnections` equals `1`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Audit Trail**: Creates a record of all allowed firewall connections for security analysis
- **Incident Response**: Enables forensic analysis of network traffic patterns
- **Compliance**: Meets requirements for multiple security frameworks requiring audit logging
- **Security Monitoring**: Provides visibility into allowed network connections for threat detection
- **Troubleshooting**: Helps diagnose network connectivity issues by showing successful connection attempts

## Notes

- This setting applies specifically to the Domain Profile, which is used when the device is connected to a network where it can authenticate to a domain controller
- Logging successful connections can generate significant log volume on busy systems
- The firewall log file location and size limits should be configured appropriately to prevent disk space issues
- This role only configures the Domain Profile; other profiles (Private, Public) may need separate configuration
- If the registry key or value does not exist, the role will create them

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
