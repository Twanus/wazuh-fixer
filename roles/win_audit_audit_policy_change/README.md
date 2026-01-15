# win_audit_audit_policy_change

This role remediates CIS Benchmark 17.7.1 (check 26155): Ensure 'Audit Audit Policy Change' is set to include 'Success'.

## Description

This subcategory reports changes in audit policy including SACL changes. Events for this subcategory include:
- 4715: The audit policy (SACL) on an object was changed.
- 4719: System audit policy was changed.
- 4902: The Per-user audit policy table was created.
- 4904: An attempt was made to register a security event source.
- 4905: An attempt was made to unregister a security event source.
- 4906: The CrashOnAuditFail value has changed.
- 4907: Auditing settings on object were changed.
- 4908: Special Groups Logon table modified.
- 4912: Per User Audit Policy was changed.

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
- name: Configure Audit Audit Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_audit_policy_change
```

Or using the development path:

```yaml
---
- name: Configure Audit Audit Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_audit_policy_change  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.7.1 (check 26155)
- **CIS CSC v7**: 5.5, 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.1.2, A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"Audit Policy Change"`
- **Set Command**: `auditpol.exe /set /subcategory:"Audit Policy Change" /success:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Audit Policy Change                       Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Audit Policy Change                       Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change\Audit Audit Policy Change`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Audit Policy Change"
```

The output should show "Success" or "Success and Failure" for the Audit Policy Change subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change`
3. Check that "Audit Audit Policy Change" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful audit policy change events, which is critical for security monitoring.
- The role only enables Success auditing; it does not disable Failure auditing if it's already enabled.
- Events generated (4715, 4719, 4902, 4904, 4905, 4906, 4907, 4908, 4912) are useful for investigating security incidents and tracking changes to audit policies.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Monitoring audit policy changes is essential for maintaining audit trail integrity and detecting unauthorized modifications to security audit configurations.
