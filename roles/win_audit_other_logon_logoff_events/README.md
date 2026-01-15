# win_audit_other_logon_logoff_events

This role remediates CIS Benchmark 17.5.5 (check 26149): Ensure 'Audit Other Logon/Logoff Events' is set to 'Success and Failure'.

## Description

This subcategory reports other logon/logoff-related events, such as Remote Desktop Services session disconnects and reconnects, using RunAs to run processes under a different account, and locking and unlocking a workstation.

Events for this subcategory include:
- 4649: A replay attack was detected.
- 4778: A session was reconnected to a Window Station.
- 4779: A session was disconnected from a Window Station.
- 4800: The workstation was locked.
- 4801: The workstation was unlocked.
- 4802: The screen saver was invoked.
- 4803: The screen saver was dismissed.
- 5378: The requested credentials delegation was disallowed by policy.
- 5632: A request was made to authenticate to a wireless network.
- 5633: A request was made to authenticate to a wired network.

Auditing these events may be useful when investigating a security incident. The recommended state for this setting is: **Success and Failure**.

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

```yaml
---
- name: Configure Audit Other Logon/Logoff Events
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_other_logon_logoff_events
```

Or using the development path:

```yaml
---
- name: Configure Audit Other Logon/Logoff Events
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_other_logon_logoff_events  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.5.5 (check 26149)
- **CIS CSC v7**: 6.3, 16.13
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"Other Logon/Logoff Events"`
- **Set Command**: `auditpol.exe /set /subcategory:"Other Logon/Logoff Events" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Other Logon/Logoff Events                 Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff\Audit Other Logon/Logoff Events`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Other Logon/Logoff Events"
```

The output should show "Success and Failure" for the Other Logon/Logoff Events subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff`
3. Check that "Audit Other Logon/Logoff Events" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed other logon/logoff events.
- The events generated (4649, 4778, 4779, 4800, 4801, 4802, 4803, 5378, 5632, 5633) are useful for investigating security incidents.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- This subcategory covers various logon/logoff-related events including Remote Desktop Services sessions, workstation locking/unlocking, screen saver events, and wireless/wired network authentication requests.
