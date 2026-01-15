# win_audit_special_logon

This role remediates CIS Benchmark 17.5.6 (check 26150): Ensure 'Audit Special Logon' is set to include 'Success'.

## Description

This subcategory reports when a special logon is used. A special logon is a logon that has administrator-equivalent privileges and can be used to elevate a process to a higher level. Events for this subcategory include:
- 4964: Special groups have been assigned to a new logon.

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
- name: Configure Audit Special Logon
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_special_logon
```

Or using the development path:

```yaml
---
- name: Configure Audit Special Logon
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_special_logon  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.5.6 (check 26150)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Special Logon"`
- **Set Command**: `auditpol.exe /set /subcategory:"Special Logon" /success:enable [/failure:enable|/failure:disable]`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Special Logon                             Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Special Logon                             Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff\Audit Special Logon`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Special Logon"
```

The output should show "Success" or "Success and Failure" for the Special Logon subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff`
3. Check that "Audit Special Logon" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful special logon events.
- The role enables Success auditing and preserves the existing Failure auditing setting (if enabled, it remains enabled; if disabled, it remains disabled).
- Events generated (4964) are useful for investigating security incidents and tracking special logon usage.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Special logon auditing helps identify when administrator-equivalent privileges are used, which is important for security monitoring and incident response.
