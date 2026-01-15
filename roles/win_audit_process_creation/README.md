# win_audit_process_creation

This role remediates CIS Benchmark 17.3.2 (check 26144): Ensure 'Audit Process Creation' is set to include 'Success'.

## Description

This subcategory reports the creation of a process and the name of the program or user that created it. Events for this subcategory include:
- 4688: A new process has been created.
- 4696: A primary token was assigned to process.

Refer to Microsoft Knowledge Base article 947226: Description of security events in Windows Vista and in Windows Server 2008 for the most recent information about this setting.

Auditing these events may be useful when investigating a security incident. The recommended state for this setting is to include: **Success**.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to include "Success" by default.

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Audit Process Creation
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_process_creation
```

Or using the development path:

```yaml
---
- name: Configure Audit Process Creation
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_process_creation  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.3.2 (check 26144)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Process Creation"`
- **Set Command**: `auditpol.exe /set /subcategory:"Process Creation" /success:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Process Creation                          Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Process Creation                          Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Detailed Tracking\Audit Process Creation`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Process Creation"
```

The output should show "Success" or "Success and Failure" for the Process Creation subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Detailed Tracking`
3. Check that "Audit Process Creation" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful process creation events.
- The role only enables Success auditing; it does not disable Failure auditing if it's already enabled.
- Events generated (4688, 4696) are useful for investigating security incidents and tracking process creation.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Process creation auditing can generate a significant volume of events on busy systems, so ensure appropriate log management is in place.
