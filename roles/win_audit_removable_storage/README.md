# win_audit_removable_storage

This role remediates CIS Benchmark 17.6.4 (check 26154): Ensure 'Audit Removable Storage' is set to 'Success and Failure'.

## Description

This policy setting allows you to audit user attempts to access file system objects on a removable storage device. A security audit event is generated only for all objects for all types of access requested. If you configure this policy setting, an audit event is generated each time an account accesses a file system object on a removable storage. Success audits record successful attempts and Failure audits record unsuccessful attempts. If you do not configure this policy setting, no audit event is generated when an account accesses a file system object on a removable storage.

Auditing removable storage may be useful when investigating an incident. For example, if an individual is suspected of copying sensitive information onto a USB drive. The recommended state for this setting is: **Success and Failure**.

**Note**: A Windows 8.0, Server 2012 (non-R2) or newer OS is required to access and set this value in Group Policy.

## Requirements

- Ansible 2.9 or higher
- Windows target host (Windows 8.0, Server 2012 or newer)
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
- name: Configure Audit Removable Storage
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_removable_storage
```

Or using the development path:

```yaml
---
- name: Configure Audit Removable Storage
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_removable_storage  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.6.4 (check 26154)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Removable Storage"`
- **Set Command**: `auditpol.exe /set /subcategory:"Removable Storage" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Removable Storage                         Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Object Access\Audit Removable Storage`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Removable Storage"
```

The output should show "Success and Failure" for the Removable Storage subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Object Access`
3. Check that "Audit Removable Storage" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed attempts to access file system objects on removable storage devices.
- Auditing removable storage may be useful when investigating an incident, such as when an individual is suspected of copying sensitive information onto a USB drive.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- This setting requires Windows 8.0, Server 2012 (non-R2) or newer OS to access and set via Group Policy.
