# win_audit_shutdown_on_fail

This role remediates CIS Benchmark 2.3.2.2 (check 26014): Ensure 'Audit: Shut down system immediately if unable to log security audits' is set to 'Disabled'.

## Description

If the computer is unable to record events to the Security log, critical evidence or important troubleshooting information may not be available for review after a security incident. Also, an attacker could potentially generate a large volume of Security log events to purposely force a computer shutdown.

This policy setting determines whether the system shuts down if it is unable to log Security events. It is a requirement for Trusted Computer System Evaluation Criteria (TCSEC)-C2 and Common Criteria certification to prevent auditable events from occurring if the audit system is unable to log them. Microsoft has chosen to meet this requirement by halting the system and displaying a stop message if the auditing system experiences a failure.

**When this policy setting is enabled**, the system will be shut down if a security audit cannot be logged for any reason. This can lead to:
- Unplanned system failures
- Significant administrative burden, especially if you also configure the Retention method for the Security log to "Do not overwrite events (clear log manually)"
- Conversion of a repudiation threat to a denial of service (DoS) vulnerability, as a server could be forced to shut down if overwhelmed with logon events and other security events
- Potential for irreparable damage to the operating system, applications, or data due to ungraceful shutdowns

Although the NTFS file system guarantees its integrity when an ungraceful computer shutdown occurs, it cannot guarantee that every data file for every application will still be in a usable form when the computer restarts.

**The recommended state for this setting is: Disabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_audit_shutdown_on_fail_disabled_value` | `0` | Registry value for CrashOnAuditFail (0 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable audit shutdown on fail
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_shutdown_on_fail
```

Or using the development path:

```yaml
---
- name: Disable audit shutdown on fail
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_shutdown_on_fail  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.2.2 (check 26014)
- **CIS CSC v7**: 6.4
- **CIS CSC v8**: 8.3
- **ISO 27001:2013**: A.12.4.1
- **PCI DSS v3.2.1**: 10.7
- **SOC 2**: A1.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
- **Value Name**: `CrashOnAuditFail`
- **Value Type**: `REG_DWORD`
- **Required Value**: `0` (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa" -Name "CrashOnAuditFail" -ErrorAction SilentlyContinue | Select-Object CrashOnAuditFail
```

If the value doesn't exist, that's also compliant (Disabled by default), but this role explicitly sets it to `0` to ensure compliance.

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
3. Check that `CrashOnAuditFail` is either not present (Disabled by default) or set to `0` (Disabled)

## Idempotency

This role is idempotent. If the registry value is already set to `0` (Disabled) or doesn't exist, no changes will be made. However, this role will explicitly set the value to `0` if it doesn't exist to ensure compliance.

## Notes

- **Default behavior**: If the `CrashOnAuditFail` registry value doesn't exist, Windows treats it as Disabled (the system will not shut down if unable to log security audits). This role explicitly sets it to `0` to ensure compliance.

- **Security vs Availability**: While disabling this setting (as recommended by CIS) prevents unplanned system shutdowns, it does mean that some security events might not be logged if the audit system fails. Organizations should implement proper log management and monitoring to ensure audit logs are functioning correctly.

- **Risk of DoS**: Enabling this setting can create a denial of service vulnerability, as an attacker could potentially generate a large volume of Security log events to force a shutdown.

- **If the registry value does not exist**, this role will create it and set it to `0` (Disabled) to ensure explicit compliance.
