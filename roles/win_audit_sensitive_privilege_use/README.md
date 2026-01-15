# win_audit_sensitive_privilege_use

This role remediates CIS Benchmark 17.8.1 (check 26160): Ensure 'Audit Sensitive Privilege Use' is set to 'Success and Failure'.

## Description

This subcategory reports when a user account or service uses a sensitive privilege. A sensitive privilege includes the following user rights:
- Act as part of the operating system
- Back up files and directories
- Create a token object
- Debug programs
- Enable computer and user accounts to be trusted for delegation
- Generate security audits
- Load and unload device drivers
- Manage auditing and security log
- Modify firmware environment values
- Replace a process-level token
- Restore files and directories
- Take ownership of files or other objects
- Impersonate a client after authentication

Auditing this subcategory will create a high volume of events. Events for this subcategory include:
- 4672: Special privileges assigned to new logon.
- 4673: A privileged service was called.
- 4674: An operation was attempted on a privileged object.

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
- name: Configure Audit Sensitive Privilege Use
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_sensitive_privilege_use
```

Or using the development path:

```yaml
---
- name: Configure Audit Sensitive Privilege Use
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_sensitive_privilege_use  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.8.1 (check 26160)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Sensitive Privilege Use"`
- **Set Command**: `auditpol.exe /set /subcategory:"Sensitive Privilege Use" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Sensitive Privilege Use                  Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Privilege Use\Audit Sensitive Privilege Use`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Sensitive Privilege Use"
```

The output should show "Success and Failure" for the Sensitive Privilege Use subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Privilege Use`
3. Check that "Audit Sensitive Privilege Use" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed sensitive privilege use attempts.
- Auditing this subcategory will create a high volume of events.
- The events generated (4672, 4673, 4674) are useful for investigating security incidents.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
