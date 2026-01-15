# win_audit_pnp_activity

This role remediates CIS Benchmark 17.3.1 (check 26143): Ensure 'Audit PNP Activity' is set to include 'Success'.

## Description

This policy setting allows you to audit when plug and play detects an external device. Enabling this setting will allow a user to audit events when a device is plugged into a system. This can help alert IT staff if unapproved devices are plugged in.

The recommended state for this setting is to include: **Success**.

**Note**: A Windows 10, Server 2016 or newer OS is required to access and set this value in Group Policy.

## Requirements

- Ansible 2.9 or higher
- Windows target host (Windows 10, Server 2016 or newer recommended)
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to include "Success" by default.

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Audit PNP Activity
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_pnp_activity
```

Or using the development path:

```yaml
---
- name: Configure Audit PNP Activity
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_pnp_activity  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.3.1 (check 26143)
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

- **Check Command**: `auditpol.exe /get /subcategory:"Plug and Play Events"`
- **Set Command**: `auditpol.exe /set /subcategory:"Plug and Play Events" /success:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
Plug and Play Events                      Success
```

Or:
```
System audit policy

Category/Subcategory                      Setting
Plug and Play Events                      Success and Failure
```

Both "Success" and "Success and Failure" are compliant, as both include Success auditing.

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to include Success:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Detailed Tracking\Audit PNP Activity`

**Note**: A Windows 10, Server 2016 or newer OS is required to access and set this value in Group Policy.

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"Plug and Play Events"
```

The output should show "Success" or "Success and Failure" for the Plug and Play Events subcategory (both are compliant as they include Success auditing).

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Detailed Tracking`
3. Check that "Audit PNP Activity" includes "Success" (can be "Success" or "Success and Failure")

## Idempotency

This role is idempotent. If the audit policy already includes "Success" auditing (either "Success" or "Success and Failure"), no changes will be made.

## Notes

- This setting enables auditing for successful plug and play device detection events.
- This helps alert IT staff if unapproved devices are plugged into systems.
- The role accepts both "Success" and "Success and Failure" as compliant settings, as both include Success auditing.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
- Windows 10, Server 2016 or newer OS is recommended for full Group Policy support.
