# win_audit_group_membership

This role remediates CIS Benchmark 17.5.2 (check 26146): Ensure 'Audit Group Membership' is set to include 'Success'.

## Description

This policy allows you to audit the group membership information in the user's logon token. Events in this subcategory are generated on the computer on which a logon session is created. For an interactive logon, the security audit event is generated on the computer that the user logged on to. For a network logon, such as accessing a shared folder on the network, the security audit event is generated on the computer hosting the resource.

Auditing these events may be useful when investigating a security incident. The recommended state for this setting is to include: **Success**.

**Note**: A Windows 10, Server 2016 or newer OS is required to access and set this value in Group Policy.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)
- Windows 10, Server 2016 or newer OS (for Group Policy access)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to include "Success" by default.

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Audit Group Membership
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_group_membership
```

Or using the development path:

```yaml
---
- name: Configure Audit Group Membership
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_group_membership  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.5.2 (check 26146)
- **CIS CSC v7**: 4.8, 6.3, 16.6
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1, A.12.4.3, A.9.2.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"Group Membership"`
- **Set Command**: `auditpol.exe /set /subcategory:"Group Membership" /success:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Group Membership                          Success
```

Or if both success and failure are enabled:
```
System audit policy

Category/Subcategory                      Setting
Group Membership                          Success and Failure
```

Both configurations satisfy the CIS Benchmark requirement as long as "Success" is included.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff\Audit Group Membership`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Group Membership"
```

The output should show "Success" or "Success and Failure" for the Group Membership subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff`
3. Check that "Audit Group Membership" includes "Success"

## Idempotency

This role is idempotent. If the audit policy already includes "Success" (either as "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful group membership events during logon.
- The role only enables Success auditing; it preserves the Failure setting if it's already enabled.
- Events generated are useful for investigating security incidents and tracking group membership information in logon tokens.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- A Windows 10, Server 2016 or newer OS is required to access and set this value in Group Policy.
- Group membership auditing can generate events on every logon, so ensure appropriate log management is in place.
