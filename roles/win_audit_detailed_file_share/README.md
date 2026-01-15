# win_audit_detailed_file_share

This role remediates CIS Benchmark 17.6.1 (check 26151): Ensure 'Audit Detailed File Share' is set to include 'Failure'.

## Description

This subcategory allows you to audit attempts to access files and folders on a shared folder. Events for this subcategory include:

- **5145**: A network share object was checked to see whether client can be granted desired access.

The recommended state for this setting is to include: **Failure**.

## Rationale

Auditing the Failures will log which unauthorized users attempted (and failed) to get access to a file or folder on a network share on this computer, which could possibly be an indication of malicious intent. By tracking these events, administrators can:

- Detect unauthorized access attempts to network shares
- Identify potential security threats and malicious activity
- Investigate security incidents involving file share access
- Monitor for suspicious access patterns
- Track failed access attempts for compliance and forensic purposes
- Detect reconnaissance activities targeting network shares

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. It uses `auditpol.exe` to configure the audit policy directly.

## Dependencies

None.

## Example Playbook

### Using the Collection Format

```yaml
---
- name: Configure Audit Detailed File Share
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_detailed_file_share
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit Detailed File Share
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_detailed_file_share  # noqa role-name[path]
```

## How It Works

1. **Check Current Setting**: The role uses `auditpol.exe /get /subcategory:"Detailed File Share"` to retrieve the current audit policy configuration.

2. **Parse Output**: The output is parsed to determine if "Failure" auditing is currently enabled. The policy can be:
   - "No Auditing" - No auditing is enabled
   - "Success" - Only success events are audited
   - "Failure" - Only failure events are audited
   - "Success and Failure" - Both success and failure events are audited

3. **Apply Configuration**: If "Failure" is not included in the current setting, the role uses `auditpol.exe /set /subcategory:"Detailed File Share" /failure:enable` to enable failure auditing. The role preserves the success setting if it was already enabled.

4. **Idempotency**: The role checks if "Failure" is already enabled before making changes, ensuring it can be run multiple times safely.

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"Detailed File Share"`
- **Set Command**: `auditpol.exe /set /subcategory:"Detailed File Share" /failure:enable` (preserves success setting if enabled)

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Detailed File Share                       Failure
```

Or if both are enabled:
```
System audit policy

Category/Subcategory                      Setting
Detailed File Share                       Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Object Access\Audit Detailed File Share`

## Verification

### Manual Verification

To verify the audit policy is configured correctly, run:

```powershell
auditpol.exe /get /subcategory:"Detailed File Share"
```

The output should show that "Failure" is included. For example:
- `Detailed File Share          Failure`
- `Detailed File Share          Success and Failure`

### Using PowerShell

You can also verify using PowerShell:

```powershell
$auditPolicy = auditpol.exe /get /subcategory:"Detailed File Share"
if ($auditPolicy -match "Failure") {
    Write-Host "Failure auditing is enabled"
} else {
    Write-Host "Failure auditing is NOT enabled"
}
```

### Check Event Logs

After enabling this audit policy, you can monitor the Security event log for event ID 5145 when failed access attempts to network shares occur.

## Idempotency

This role is idempotent. If "Failure" auditing is already enabled, the role will report that no changes are needed and will not attempt to modify the audit policy.

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.6.1
- **CIS CSC v7**: 6.3, 14.6
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1, A.9.1.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Security Benefits

- **Attack Detection**: Enables detection of unauthorized access attempts to network shares
- **Forensic Analysis**: Provides audit trail for failed file share access attempts
- **Compliance**: Meets multiple compliance framework requirements for audit logging
- **Incident Response**: Helps identify compromised or targeted network shares
- **Monitoring**: Supports security monitoring and alerting for suspicious file share access patterns
- **Reconnaissance Detection**: Can help identify attackers probing network shares for vulnerabilities

## Notes

- This role requires Administrator privileges to modify audit policy settings
- The audit policy changes take effect immediately
- Enabling failure auditing for detailed file share generates events when access attempts fail, which is essential for security monitoring
- The role preserves existing success auditing settings if they are already enabled
- If you want to enable both success and failure auditing, you can manually run: `auditpol.exe /set /subcategory:"Detailed File Share" /success:enable /failure:enable`
- This setting is particularly important in environments with network file shares that contain sensitive data
- Event ID 5145 provides detailed information about access checks on network shares, including the account name, source IP address, and requested access rights

## Troubleshooting

### Error: "Failed to get audit policy"

This may occur if:
- The system does not have `auditpol.exe` available (unlikely on modern Windows systems)
- Insufficient permissions to read audit policy
- The subcategory name has changed (unlikely)

**Solution**: Ensure you are running with Administrator privileges.

### Error: "Failed to set audit policy"

This may occur if:
- Insufficient permissions to modify audit policy
- Group Policy is overriding local audit policy settings

**Solution**: 
- Ensure you are running with Administrator privileges
- Check if Group Policy is managing audit policies and configure it via Group Policy instead

### Policy Not Taking Effect

If the policy appears to be set but events are not being logged:
- Verify that the "Audit: Force audit policy subcategory settings" policy is enabled (see `win_force_audit_subcategory` role)
- Check that the Security event log is not full
- Verify that file share access attempts are being made (test by attempting to access a network share with insufficient permissions)
- Ensure that the file share is actually being accessed over the network (local file access may not generate these events)
