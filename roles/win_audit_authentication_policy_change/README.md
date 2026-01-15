# win_audit_authentication_policy_change

This role remediates CIS Benchmark 17.7.2 (check 26156): Ensure 'Audit Authentication Policy Change' is set to include 'Success'.

## Description

This subcategory reports changes in authentication policy. Events for this subcategory include:
- 4706: A new trust was created to a domain.
- 4707: A trust to a domain was removed.
- 4713: Kerberos policy was changed.
- 4716: Trusted domain information was modified.
- 4717: System security access was granted to an account.
- 4718: System security access was removed from an account.
- 4739: Domain Policy was changed.
- 4864: A namespace collision was detected.
- 4865: A trusted forest information entry was added.
- 4866: A trusted forest information entry was removed.
- 4867: A trusted forest information entry was modified.

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
- name: Configure Audit Authentication Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_authentication_policy_change
```

Or using the development path:

```yaml
---
- name: Configure Audit Authentication Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_authentication_policy_change  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.7.2 (check 26156)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Authentication Policy Change"`
- **Set Command**: `auditpol.exe /set /subcategory:"Authentication Policy Change" /success:enable [/failure:enable|/failure:disable]`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Authentication Policy Change              Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Authentication Policy Change              Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change\Audit Authentication Policy Change`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Authentication Policy Change"
```

The output should show "Success" or "Success and Failure" for the Authentication Policy Change subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change`
3. Check that "Audit Authentication Policy Change" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made. The role preserves the existing Failure setting if it's already enabled.

## Notes

- This setting enables auditing for successful authentication policy change events.
- The role enables Success auditing and preserves Failure auditing if it's already enabled.
- Events generated (4706, 4707, 4713, 4716, 4717, 4718, 4739, 4864, 4865, 4866, 4867) are useful for investigating security incidents and tracking authentication policy changes.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Authentication policy change auditing is important for tracking changes to domain trusts, Kerberos policies, and system security access grants.
