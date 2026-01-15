# win_audit_security_group_management

This role remediates CIS Benchmark 17.2.2 (check 26141): Ensure 'Audit Security Group Management' is set to include 'Success'.

## Description

This subcategory reports each event of security group management, such as when a security group is created, changed, or deleted or when a member is added to or removed from a security group. If you enable this Audit policy setting, administrators can track events to detect malicious, accidental, and authorized creation of security group accounts.

### Events Audited

When this audit policy is enabled, the following events are logged:

- **4727**: A security-enabled global group was created
- **4728**: A member was added to a security-enabled global group
- **4729**: A member was removed from a security-enabled global group
- **4730**: A security-enabled global group was deleted
- **4731**: A security-enabled local group was created
- **4732**: A member was added to a security-enabled local group
- **4733**: A member was removed from a security-enabled local group
- **4734**: A security-enabled local group was deleted
- **4735**: A security-enabled local group was changed
- **4737**: A security-enabled global group was changed
- **4754**: A security-enabled universal group was created
- **4755**: A security-enabled universal group was changed
- **4756**: A member was added to a security-enabled universal group
- **4757**: A member was removed from a security-enabled universal group
- **4758**: A security-enabled universal group was deleted
- **4764**: A group's type was changed

## Rationale

Auditing these events may be useful when investigating a security incident. By tracking security group management activities, administrators can:

- Detect unauthorized changes to security groups
- Identify when privileged groups are modified
- Track membership changes in critical security groups
- Investigate security incidents involving group membership

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
- name: Configure Audit Security Group Management
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_security_group_management
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit Security Group Management
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_security_group_management  # noqa role-name[path]
```

## How It Works

1. **Check Current Setting**: The role uses `auditpol.exe /get /subcategory:"Security Group Management"` to retrieve the current audit policy configuration.

2. **Parse Output**: The output is parsed to determine if "Success" auditing is currently enabled. The policy can be:
   - "No Auditing" - No auditing is enabled
   - "Success" - Only success events are audited
   - "Failure" - Only failure events are audited
   - "Success and Failure" - Both success and failure events are audited

3. **Apply Configuration**: If "Success" is not included in the current setting, the role uses `auditpol.exe /set /subcategory:"Security Group Management" /success:enable` to enable success auditing. The role preserves the failure setting if it was already enabled.

4. **Idempotency**: The role checks if "Success" is already enabled before making changes, ensuring it can be run multiple times safely.

## Verification

### Manual Verification

To verify the audit policy is configured correctly, run:

```powershell
auditpol.exe /get /subcategory:"Security Group Management"
```

The output should show that "Success" is included. For example:
- `Security Group Management          Success`
- `Security Group Management          Success and Failure`

### Using PowerShell

You can also verify using PowerShell:

```powershell
$auditPolicy = auditpol.exe /get /subcategory:"Security Group Management"
if ($auditPolicy -match "Success") {
    Write-Host "Success auditing is enabled"
} else {
    Write-Host "Success auditing is NOT enabled"
}
```

### Check Event Logs

After enabling this audit policy, you can monitor the Security event log for the events listed above (4727, 4728, 4729, etc.) when security group management activities occur.

## Idempotency

This role is idempotent. If "Success" auditing is already enabled, the role will report that no changes are needed and will not attempt to modify the audit policy.

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.2.2
- **CIS CSC v7**: 6.3, 16.6
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1, A.9.2.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Security Benefits

- **Incident Detection**: Enables detection of unauthorized security group modifications
- **Forensic Analysis**: Provides audit trail for security group management activities
- **Compliance**: Meets multiple compliance framework requirements for audit logging
- **Accountability**: Tracks who made changes to security groups and when

## Notes

- This role requires Administrator privileges to modify audit policy settings
- The audit policy changes take effect immediately
- Enabling success auditing for security group management can generate a moderate volume of events, but this is generally acceptable for security monitoring
- The role preserves existing failure auditing settings if they are already enabled
- If you want to enable both success and failure auditing, you can manually run: `auditpol.exe /set /subcategory:"Security Group Management" /success:enable /failure:enable`

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
- Verify that the appropriate events (4727-4764) are being generated by performing a test security group operation
