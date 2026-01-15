# win_audit_other_policy_change_events

This role remediates CIS Benchmark 17.7.5 (check 26159): Ensure 'Audit Other Policy Change Events' is set to include 'Failure'.

## Description

This subcategory contains events about EFS Data Recovery Agent policy changes, changes in Windows Filtering Platform filter, status on Security policy settings updates for local Group Policy settings, Central Access Policy changes, and detailed troubleshooting events for Cryptographic Next Generation (CNG) operations.

Events for this subcategory include:
- **5063**: A cryptographic provider operation was attempted.
- **5064**: A cryptographic context operation was attempted.
- **5065**: A cryptographic context modification was attempted.
- **5066**: A cryptographic function operation was attempted.
- **5067**: A cryptographic function modification was attempted.
- **5068**: A cryptographic function provider operation was attempted.
- **5069**: A cryptographic function property operation was attempted.
- **5070**: A cryptographic function property modification was attempted.
- **6145**: One or more errors occurred while processing security policy in the group policy objects.

The recommended state for this setting is to include: **Failure**.

## Rationale

This setting can help detect errors in applied Security settings which came from Group Policy, and failure events related to Cryptographic Next Generation (CNG) functions.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to include "Failure" by default (Success auditing is preserved if already enabled).

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Audit Other Policy Change Events
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_other_policy_change_events
```

Or using the development path:

```yaml
---
- name: Configure Audit Other Policy Change Events
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_other_policy_change_events  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.7.5 (check 26159)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Other Policy Change Events"`
- **Set Command**: `auditpol.exe /set /subcategory:"Other Policy Change Events" /failure:enable` (Success is preserved if already enabled)

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Other Policy Change Events                Failure
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Other Policy Change Events                Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Failure" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change\Audit Other Policy Change Events`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Other Policy Change Events"
```

The output should show "Failure" or "Success and Failure" for the Other Policy Change Events subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change`
3. Check that "Audit Other Policy Change Events" includes "Failure"

## Idempotency

This role is idempotent. If the audit policy already includes "Failure" (either as "Failure" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for failure events related to policy changes, including errors in applied Security settings from Group Policy and CNG function failures.
- The role only enables Failure auditing; it does not disable Success auditing if it's already enabled.
- The events generated (5063-5070, 6145) are useful for investigating security policy errors and cryptographic operation failures.
- Without this setting enabled, it is difficult or impossible to detect errors in security policy application and CNG operations.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
