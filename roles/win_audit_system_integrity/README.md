# win_audit_system_integrity

This role remediates CIS Benchmark 17.9.5 (check 26165): Ensure 'Audit System Integrity' is set to 'Success and Failure'.

## Description

This subcategory reports on violations of integrity of the security subsystem. Auditing these events may be useful when investigating a security incident.

Events for this subcategory include:
- **4612**: Internal resources allocated for the queuing of audit messages have been exhausted, leading to the loss of some audits.
- **4615**: Invalid use of LPC port.
- **4618**: A monitored security event pattern has occurred.
- **4816**: RPC detected an integrity violation while decrypting an incoming message.
- **5038**: Code integrity determined that the image hash of a file is not valid. The file could be corrupt due to unauthorized modification or the invalid hash could indicate a potential disk device error.
- **5056**: A cryptographic self test was performed.
- **5057**: A cryptographic primitive operation failed.
- **5060**: Verification operation failed.
- **5061**: Cryptographic operation.
- **5062**: A kernel-mode cryptographic self test was performed.

The recommended state for this setting is: **Success and Failure**.

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
- name: Configure Audit System Integrity
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_system_integrity
```

Or using the development path:

```yaml
---
- name: Configure Audit System Integrity
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_system_integrity  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.9.5 (check 26165)
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

- **Check Command**: `auditpol.exe /get /subcategory:"System Integrity"`
- **Set Command**: `auditpol.exe /set /subcategory:"System Integrity" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
System Integrity                          Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System\Audit System Integrity`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"System Integrity"
```

The output should show "Success and Failure" for the System Integrity subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System`
3. Check that "Audit System Integrity" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed system integrity events.
- The events generated (4612, 4615, 4618, 4816, 5038, 5056, 5057, 5060, 5061, 5062) are useful for investigating security incidents and detecting integrity violations.
- Without this setting enabled, it is difficult to detect violations of the security subsystem's integrity.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Code integrity violations (event 5038) can indicate unauthorized file modifications or disk errors.
