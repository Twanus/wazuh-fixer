# win_audit_other_system_events

This role remediates CIS Benchmark 17.9.2 (check 26162): Ensure 'Audit Other System Events' is set to 'Success and Failure'.

## Description

This subcategory reports on other system events. Events for this subcategory include:
- **5024**: The Windows Firewall Service has started successfully.
- **5025**: The Windows Firewall Service has been stopped.
- **5027**: The Windows Firewall Service was unable to retrieve the security policy from the local storage. The service will continue enforcing the current policy.
- **5028**: The Windows Firewall Service was unable to parse the new security policy. The service will continue with currently enforced policy.
- **5029**: The Windows Firewall Service failed to initialize the driver. The service will continue to enforce the current policy.
- **5030**: The Windows Firewall Service failed to start.
- **5032**: Windows Firewall was unable to notify the user that it blocked an application from accepting incoming connections on the network.
- **5033**: The Windows Firewall Driver has started successfully.
- **5034**: The Windows Firewall Driver has been stopped.
- **5035**: The Windows Firewall Driver failed to start.
- **5037**: The Windows Firewall Driver detected critical runtime error. Terminating.
- **5058**: Key file operation.
- **5059**: Key migration operation.

Capturing these audit events may be useful for identifying when the Windows Firewall is not performing as expected. The recommended state for this setting is: **Success and Failure**.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to "Success and Failure" by default.

## Dependencies

None.

## Example Playbook

### Using the Collection Format

```yaml
---
- name: Configure Audit Other System Events
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_other_system_events
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit Other System Events
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_other_system_events  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.9.2 (check 26162)
- **CIS CSC v7**: 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"Other System Events"`
- **Set Command**: `auditpol.exe /set /subcategory:"Other System Events" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Other System Events                       Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System\Audit Other System Events`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Other System Events"
```

The output should show "Success and Failure" for the Other System Events subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System`
3. Check that "Audit Other System Events" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed system events, particularly Windows Firewall events.
- The events generated (5024, 5025, 5027-5030, 5032-5035, 5037, 5058, 5059) are useful for identifying when the Windows Firewall is not performing as expected.
- Capturing these audit events helps with troubleshooting firewall issues and security monitoring.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
