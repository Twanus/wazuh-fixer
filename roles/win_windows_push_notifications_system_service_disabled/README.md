# win_windows_push_notifications_system_service_disabled

This role remediates CIS Benchmark 5.37 (check 26108): Ensure 'Windows Push Notifications System Service (WpnService)' is set to 'Disabled'.

## Description

This service runs in session 0 and hosts the notification platform and connection provider which handles the connection between the device and WNS server.

**The recommended state for this setting is: Disabled.**

Windows Push Notification Services (WNS) is a mechanism to receive third-party notifications and updates from the cloud/Internet. In a high security environment, external systems, especially those hosted outside the organization, should be prevented from having an impact on the secure workstations.

When Disabled, the Windows Push Notifications System Service is disabled and will not start, preventing the connection between the device and WNS server and reducing the attack surface by preventing external systems from having an impact on the secure workstations.

**Note:** In the first two releases of Windows 10 (R1507 & R1511), the display name of this service was initially named Windows Push Notifications Service - but it was renamed to Windows Push Notifications System Service starting with Windows 10 R1607.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_windows_push_notifications_system_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Windows Push Notifications System Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_windows_push_notifications_system_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Windows Push Notifications System Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_windows_push_notifications_system_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.37 (check 26108)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WpnService`
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
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\WpnService"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\WpnService" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WpnService`
3. If the key does not exist, the service is not installed (compliant)
4. If the key exists, check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Windows Push Notifications System Service`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Windows Push Notifications System Service reduces the attack surface by preventing the connection between the device and WNS server. In a high security environment, external systems, especially those hosted outside the organization, should be prevented from having an impact on the secure workstations.

- **If the service is not installed** (registry key does not exist), the role will report that the system is already compliant and no changes will be made.

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Windows Push Notifications System Service`

- **Service name note**: In the first two releases of Windows 10 (R1507 & R1511), the display name of this service was initially named Windows Push Notifications Service - but it was renamed to Windows Push Notifications System Service starting with Windows 10 R1607.