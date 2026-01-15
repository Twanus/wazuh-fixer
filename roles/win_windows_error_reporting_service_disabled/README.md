# win_windows_error_reporting_service_disabled

This role remediates CIS Benchmark 5.33 (check 26104): Ensure 'Windows Error Reporting Service (WerSvc)' is set to 'Disabled'.

## Description

Allows errors to be reported when programs stop working or responding and allows existing solutions to be delivered. Also allows logs to be generated for diagnostic and repair services.

If a Windows Error occurs in a secure, enterprise managed environment, the error should be reported directly to IT staff for troubleshooting and remediation. There is no benefit to the corporation to report these errors directly to Microsoft, and there is some risk of unknowingly exposing sensitive data as part of the error.

This policy setting controls the startup type of the Windows Error Reporting Service (WerSvc).

**The recommended state for this setting is: Disabled.**

When Disabled, the Windows Error Reporting Service is disabled and will not start, preventing error reports from being sent to Microsoft and reducing the risk of exposing sensitive data.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_windows_error_reporting_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Windows Error Reporting Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_windows_error_reporting_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Windows Error Reporting Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_windows_error_reporting_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.33 (check 26104)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WerSvc`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled)

Service Start values:
- `0` = Boot
- `1` = System
- `2` = Auto
- `3` = Manual
- `4` = Disabled (recommended)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\WerSvc" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WerSvc`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Windows Error Reporting Service`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Windows Error Reporting Service prevents error reports from being sent to Microsoft, reducing the risk of unknowingly exposing sensitive data as part of error reports. In secure, enterprise managed environments, errors should be reported directly to IT staff for troubleshooting and remediation.

- **Enterprise environments**: In secure, enterprise managed environments, there is no benefit to reporting errors directly to Microsoft, and there is some risk of unknowingly exposing sensitive data as part of the error.

- **If the registry value does not exist**, it will be treated as `NOT_SET`, and the role will create it and set it to `4` (Disabled) to ensure compliance.

- **If the service is not installed** (registry key does not exist), the role will report this as compliant, as the requirement is that the service should be disabled or not installed.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Windows Error Reporting Service`
