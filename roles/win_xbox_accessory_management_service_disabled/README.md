# win_xbox_accessory_management_service_disabled

This role remediates CIS Benchmark 5.41 (check 26112): Ensure 'Xbox Accessory Management Service (XboxGipSvc)' is set to 'Disabled'.

## Description

This service manages connected Xbox Accessories. The recommended state for this setting is: Disabled.

**The recommended state for this setting is: Disabled.**

Xbox Live is a gaming service and has no place in an enterprise managed environment (perhaps unless it is a gaming company). Disabling the Xbox Accessory Management Service prevents Xbox accessories from being managed on the system, reducing the attack surface and ensuring that gaming-related services are not running in enterprise environments.

When Disabled, the Xbox Accessory Management Service is disabled and will not start, preventing Xbox accessories from being managed on the system.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_xbox_accessory_management_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Xbox Accessory Management Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_xbox_accessory_management_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Xbox Accessory Management Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_xbox_accessory_management_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.41 (check 26112)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\XboxGipSvc`
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
# Check if service registry key exists
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\XboxGipSvc"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\XboxGipSvc" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\XboxGipSvc`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Xbox Accessory Management Service`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made. If the registry value does not exist (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

## Notes

- **Security benefit**: Disabling the Xbox Accessory Management Service reduces the attack surface by preventing Xbox accessories from being managed on the system. Xbox Live is a gaming service and has no place in an enterprise managed environment (perhaps unless it is a gaming company).

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **If the service is not installed** (registry key does not exist), this is considered compliant as the service is not present on the system.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Xbox Accessory Management Service`
