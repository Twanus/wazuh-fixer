# win_audit_file_share

This role remediates CIS Benchmark 17.6.2 (check 26152): Ensure 'Audit File Share' is set to 'Success and Failure'.

## Description

This policy setting allows you to audit attempts to access a shared folder. The recommended state for this setting is: **Success and Failure**.

**Note**: There are no system access control lists (SACLs) for shared folders. If this policy setting is enabled, access to all shared folders on the system is audited.

In an enterprise managed environment, workstations should have limited file sharing activity, as file servers would normally handle the overall burden of file sharing activities. Any unusual file sharing activity on workstations may therefore be useful in an investigation of potentially malicious activity.

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
- name: Configure Audit File Share
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_file_share
```

Or using the development path:

```yaml
---
- name: Configure Audit File Share
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_file_share  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.6.2 (check 26152)
- **CIS CSC v7**: 6.3, 14.6
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1, A.9.1.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"File Share"`
- **Set Command**: `auditpol.exe /set /subcategory:"File Share" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
File Share                                Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Object Access\Audit File Share`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"File Share"
```

The output should show "Success and Failure" for the File Share subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Object Access`
3. Check that "Audit File Share" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed attempts to access shared folders.
- When enabled, access to all shared folders on the system is audited (there are no SACLs for shared folders).
- In enterprise environments, workstations should have limited file sharing activity, making unusual activity useful for security investigations.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
