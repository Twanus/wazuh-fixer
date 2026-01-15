# win_audit_account_lockout

This role remediates CIS Benchmark 17.5.1 (check 26145): Ensure 'Audit Account Lockout' is set to include 'Failure'.

## Description

This subcategory reports when a user's account is locked out as a result of too many failed logon attempts. Auditing these events may be useful when investigating a security incident.

### Events Audited

When this audit policy is enabled, the following events are logged:

- **4625**: An account failed to log on.

## Rationale

Auditing account lockout events provides visibility into failed authentication attempts and potential brute-force attacks. By tracking these events, administrators can:

- Detect brute-force attacks against user accounts
- Identify accounts that are being targeted
- Investigate security incidents involving authentication failures
- Monitor for suspicious login patterns
- Track account lockout events for compliance and forensic purposes

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
- name: Configure Audit Account Lockout
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_account_lockout
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit Account Lockout
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_account_lockout  # noqa role-name[path]
```

## How It Works

1. **Check Current Setting**: The role uses `auditpol.exe /get /subcategory:"Account Lockout"` to retrieve the current audit policy configuration.

2. **Parse Output**: The output is parsed to determine if "Failure" auditing is currently enabled. The policy can be:
   - "No Auditing" - No auditing is enabled
   - "Success" - Only success events are audited
   - "Failure" - Only failure events are audited
   - "Success and Failure" - Both success and failure events are audited

3. **Apply Configuration**: If "Failure" is not included in the current setting, the role uses `auditpol.exe /set /subcategory:"Account Lockout" /failure:enable` to enable failure auditing. The role preserves the success setting if it was already enabled.

4. **Idempotency**: The role checks if "Failure" is already enabled before making changes, ensuring it can be run multiple times safely.

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"Account Lockout"`
- **Set Command**: `auditpol.exe /set /subcategory:"Account Lockout" /failure:enable` (preserves success setting if enabled)

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Account Lockout                           Failure
```

Or if both are enabled:
```
System audit policy

Category/Subcategory                      Setting
Account Lockout                           Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Logon/Logoff\Audit Account Lockout`

## Verification

### Manual Verification

To verify the audit policy is configured correctly, run:

```powershell
auditpol.exe /get /subcategory:"Account Lockout"
```

The output should show that "Failure" is included. For example:
- `Account Lockout          Failure`
- `Account Lockout          Success and Failure`

### Using PowerShell

You can also verify using PowerShell:

```powershell
$auditPolicy = auditpol.exe /get /subcategory:"Account Lockout"
if ($auditPolicy -match "Failure") {
    Write-Host "Failure auditing is enabled"
} else {
    Write-Host "Failure auditing is NOT enabled"
}
```

### Check Event Logs

After enabling this audit policy, you can monitor the Security event log for event ID 4625 when account lockouts occur due to failed logon attempts.

## Idempotency

This role is idempotent. If "Failure" auditing is already enabled, the role will report that no changes are needed and will not attempt to modify the audit policy.

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.5.1
- **CIS CSC v7**: 6.3, 16.6
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1, A.9.2.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Security Benefits

- **Attack Detection**: Enables detection of brute-force attacks and repeated failed authentication attempts
- **Forensic Analysis**: Provides audit trail for account lockout events
- **Compliance**: Meets multiple compliance framework requirements for audit logging
- **Incident Response**: Helps identify compromised or targeted accounts
- **Monitoring**: Supports security monitoring and alerting for suspicious authentication patterns

## Notes

- This role requires Administrator privileges to modify audit policy settings
- The audit policy changes take effect immediately
- Enabling failure auditing for account lockout generates events when accounts are locked out, which is essential for security monitoring
- The role preserves existing success auditing settings if they are already enabled
- If you want to enable both success and failure auditing, you can manually run: `auditpol.exe /set /subcategory:"Account Lockout" /success:enable /failure:enable`
- This setting is particularly important in environments where account lockout policies are configured to prevent brute-force attacks

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
- Verify that account lockout events (4625) are being generated by attempting failed logons that trigger account lockout
