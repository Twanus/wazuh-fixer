# win_audit_security_state_change

This role remediates CIS Benchmark 17.9.3 (check 26163): Ensure 'Audit Security State Change' is set to include 'Success'.

## Description

This subcategory reports changes in security state of the system, such as when the security subsystem starts and stops. Events for this subcategory include:
- 4608: Windows is starting up.
- 4609: Windows is shutting down.
- 4616: The system time was changed.
- 4621: Administrator recovered system from CrashOnAuditFail. Users who are not administrators will now be allowed to log on. Some audit-able activity might not have been recorded.

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

### Using the Collection Format

```yaml
---
- name: Configure Audit Security State Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_security_state_change
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit Security State Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_security_state_change  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.9.3 (check 26163)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Security State Change"`
- **Set Command**: `auditpol.exe /set /subcategory:"Security State Change" /success:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Security State Change                     Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Security State Change                     Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System\Audit Security State Change`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Security State Change"
```

The output should show "Success" or "Success and Failure" for the Security State Change subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System`
3. Check that "Audit Security State Change" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful security state change events.
- The role only enables Success auditing; it does not disable Failure auditing if it's already enabled.
- Events generated (4608, 4609, 4616, 4621) are useful for investigating security incidents and tracking system security state changes.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Security state change events are typically low volume and important for security monitoring.
