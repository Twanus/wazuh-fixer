# win_audit_authorization_policy_change

This role remediates CIS Benchmark 17.7.3 (check 26157): Ensure 'Audit Authorization Policy Change' is set to include 'Success'.

## Description

This subcategory reports changes in authorization policy. Events for this subcategory include:

- **4703**: A user right was adjusted.
- **4704**: A user right was assigned.
- **4705**: A user right was removed.
- **4670**: Permissions on an object were changed.
- **4911**: Resource attributes of the object were changed.
- **4913**: Central Access Policy on the object was changed.

The recommended state for this setting is to include: Success.

## Rationale

Auditing these events may be useful when investigating a security incident. By tracking authorization policy changes, administrators can:

- Detect unauthorized changes to user rights and permissions
- Identify when critical security policies are modified
- Track changes to object permissions and access controls
- Investigate security incidents involving privilege escalation
- Monitor changes to Central Access Policies

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
- name: Configure Audit Authorization Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_authorization_policy_change
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit Authorization Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_authorization_policy_change  # noqa role-name[path]
```

## How It Works

1. **Check Current Setting**: The role uses `auditpol.exe /get /subcategory:"Authorization Policy Change"` to retrieve the current audit policy configuration.

2. **Parse Output**: The output is parsed to determine if "Success" auditing is currently enabled. The policy can be:
   - "No Auditing" - No auditing is enabled
   - "Success" - Only success events are audited
   - "Failure" - Only failure events are audited
   - "Success and Failure" - Both success and failure events are audited

3. **Apply Configuration**: If "Success" is not included in the current setting, the role uses `auditpol.exe /set /subcategory:"Authorization Policy Change" /success:enable` to enable success auditing. The role preserves the failure setting if it was already enabled.

4. **Idempotency**: The role checks if "Success" is already enabled before making changes, ensuring it can be run multiple times safely.

## Verification

### Manual Verification

To verify the audit policy is configured correctly, run:

```powershell
auditpol.exe /get /subcategory:"Authorization Policy Change"
```

The output should show that "Success" is included. For example:
- `Authorization Policy Change          Success`
- `Authorization Policy Change          Success and Failure`

### Using PowerShell

You can also verify using PowerShell:

```powershell
$auditPolicy = auditpol.exe /get /subcategory:"Authorization Policy Change"
if ($auditPolicy -match "Success") {
    Write-Host "Success auditing is enabled"
} else {
    Write-Host "Success auditing is NOT enabled"
}
```

### Check Event Logs

After enabling this audit policy, you can monitor the Security event log for the events listed above (4703, 4704, 4705, 4670, 4911, 4913) when authorization policy changes occur.

## Idempotency

This role is idempotent. If "Success" auditing is already enabled, the role will report that no changes are needed and will not attempt to modify the audit policy.

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.7.3
- **CIS CSC v7**: 5.5, 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.1.2, A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Security Benefits

- **Incident Detection**: Enables detection of unauthorized authorization policy modifications
- **Forensic Analysis**: Provides audit trail for authorization policy changes
- **Compliance**: Meets multiple compliance framework requirements for audit logging
- **Accountability**: Tracks who made changes to authorization policies and when
- **Privilege Escalation Detection**: Helps identify when user rights are modified, which could indicate privilege escalation attempts

## Notes

- This role requires Administrator privileges to modify audit policy settings
- The audit policy changes take effect immediately
- Enabling success auditing for authorization policy changes can generate a moderate volume of events, but this is generally acceptable for security monitoring
- The role preserves existing failure auditing settings if they are already enabled
- If you want to enable both success and failure auditing, you can manually run: `auditpol.exe /set /subcategory:"Authorization Policy Change" /success:enable /failure:enable`

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
- Verify that the appropriate events (4703, 4704, 4705, 4670, 4911, 4913) are being generated by performing a test authorization policy change
