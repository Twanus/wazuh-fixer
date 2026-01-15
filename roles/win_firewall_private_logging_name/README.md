# win_firewall_private_logging_name

This role remediates CIS Benchmark 9.2.4 (check 26126): Ensure 'Windows Firewall: Private: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\privatefw.log'.

## Description

Windows Firewall with Advanced Security provides host-based, two-way network traffic filtering for a device and blocks unauthorized network traffic flowing into or out of the local device. The Private Profile applies to networks at locations where the host recognizes and trusts the computers and devices on the network.

If Windows Firewall events are not recorded it may be difficult or impossible for Administrators to analyze system issues or unauthorized activities of malicious users. Microsoft stores all firewall events as one file on the system (pfirewall.log). To improve logging, separate each firewall profile (domain, private, public) into its own distinct log file (domainfw.log, privatefw.log, publicfw.log) for better organization and identification of specific issues within each profile.

Use this option to specify the path and name of the file in which Windows Firewall will write its log information. The recommended state for this setting is: %SystemRoot%\System32\logfiles\firewall\privatefw.log.

**The recommended state for this setting is: %SystemRoot%\System32\logfiles\firewall\privatefw.log.**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_private_logging_name_log_file_path` | `%SystemRoot%\System32\logfiles\firewall\privatefw.log` | Registry value for LogFilePath in Private Profile Logging. The recommended path for the Private Profile firewall log file (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Private Profile Logging Name
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_private_logging_name
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Private Profile Logging Name Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_private_logging_name  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile\Logging`
- **Registry Value**: `LogFilePath` (REG_SZ)
- **Recommended Value**: `%SystemRoot%\System32\logfiles\firewall\privatefw.log`
- **Purpose**: Specifies the path and name of the file in which Windows Firewall will write its log information for the Private Profile

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Private Profile\Logging Customize\Name`
3. Verify that "Name" is set to `%SystemRoot%\System32\logfiles\firewall\privatefw.log`

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile\Logging" -Name "LogFilePath" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty LogFilePath
```

Expected output: `%SystemRoot%\System32\logfiles\firewall\privatefw.log`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.2.4 (check 26126)
- **CIS CSC v7**: 6.3, 9.4
- **CIS CSC v8**: 8.2
- **CMMC v2.0**: AU.L2-3.3.1
- **HIPAA**: 164.312(b)
- **ISO 27001:2013**: A.12.4.1, A.13.1.1
- **NIST SP 800-53**: AU-7
- **PCI DSS v3.2.1**: 10.2, 10.3
- **PCI DSS v4.0**: 10.2.1, 10.2.1.1, 10.2.1.2, 10.2.1.3, 10.2.1.4, 10.2.1.5, 10.2.1.6, 10.2.1.7, 10.2.2, 5.3.4, 6.4.1, 6.4.2

## Rationale

If Windows Firewall events are not recorded it may be difficult or impossible for Administrators to analyze system issues or unauthorized activities of malicious users. Microsoft stores all firewall events as one file on the system (pfirewall.log). To improve logging, separate each firewall profile (domain, private, public) into its own distinct log file (domainfw.log, privatefw.log, publicfw.log) for better organization and identification of specific issues within each profile.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to %SystemRoot%\System32\logfiles\firewall\privatefw.log:

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Private Profile\Logging Customize\Name`

## Checks

The Wazuh check (26126) passes if all of the following conditions are met (Condition: all):

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile\Logging` exists, AND
- The registry value `LogFilePath` exists, AND
- The registry value `LogFilePath` equals `%SystemRoot%\System32\logfiles\firewall\privatefw.log`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Audit Trail**: Provides a dedicated log file for Private Profile firewall events
- **Troubleshooting**: Enables administrators to analyze firewall events and identify security issues
- **Separation of Concerns**: Uses separate log files for each firewall profile (domain, private, public) for better organization
- **Compliance**: Meets requirements for multiple security frameworks and standards that require audit logging

## Notes

- This setting applies specifically to the Private Profile logging configuration
- The log file path uses the `%SystemRoot%` environment variable, which expands to the Windows system directory (typically `C:\Windows`)
- If the registry key or value does not exist, the role will create them
- This role only configures the Private Profile logging; other profiles (Domain, Public) may need separate configuration
- The log directory `%SystemRoot%\System32\logfiles\firewall\` must exist or be created by Windows Firewall when logging begins
- Ensure adequate disk space is available for firewall log files

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
