# win_audit_logoff

This role remediates CIS Benchmark 17.5.3 (check 26147): Ensure 'Audit Logoff' is set to include 'Success'.

## Description

This subcategory reports when a user logs off from the system. These events occur on the accessed computer. For interactive logons, the generation of these events occurs on the computer that is logged on to. If a network logon takes place to access a share, these events generate on the computer that hosts the accessed resource. If you configure this setting to No auditing, it is difficult or impossible to determine which user has accessed or attempted to access organization computers.

Events for this subcategory include:
- 4634: An account was logged off.
- 4647: User initiated logoff.

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
- name: Configure Audit Logoff
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_logoff
```

Or using the development path:

```yaml
---
- name: Configure Audit Logoff
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_logoff  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.5.3 (check 26147)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Logoff"`
- **Set Command**: `auditpol.exe /set /subcategory:"Logoff" /success:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Logoff                                   Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Logoff                                   Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff\Audit Logoff`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Logoff"
```

The output should show "Success" or "Success and Failure" for the Logoff subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff`
3. Check that "Audit Logoff" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful logoff events.
- The role only enables Success auditing; it does not disable Failure auditing if it's already enabled.
- Events generated (4634, 4647) are useful for investigating security incidents and tracking user logoff activities.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Logoff auditing helps track user access patterns and can assist in forensic investigations.
