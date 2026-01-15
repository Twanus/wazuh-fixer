# win_downloaded_maps_manager_disabled

This role remediates CIS Benchmark 5.4 (check 26075): Ensure 'Downloaded Maps Manager (MapsBroker)' is set to 'Disabled'.

## Description

Windows service for application access to downloaded maps. This service is started on-demand by application accessing downloaded maps.

Mapping technologies can unwillingly reveal your location to attackers and other software that picks up the information. In addition, automatic downloads of data from third-party sources should be minimized when not needed. Therefore, this service should not be needed in high security environments.

This policy setting controls the startup type of the Downloaded Maps Manager (MapsBroker) service.

**The recommended state for this setting is: Disabled.**

When Disabled, the Downloaded Maps Manager service is disabled and will not start, preventing automatic downloads of map data and reducing the risk of location information being revealed to attackers.

## Requirements

- Ansible 2.9 or higher
- Windows target host (Windows 10 or later)
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_downloaded_maps_manager_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Downloaded Maps Manager Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_downloaded_maps_manager_disabled
```

Or using the development path:

```yaml
---
- name: Disable Downloaded Maps Manager Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_downloaded_maps_manager_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.4 (check 26075)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MapsBroker`
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
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\MapsBroker" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MapsBroker`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Downloaded Maps Manager`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Downloaded Maps Manager service reduces the risk of location information being revealed to attackers and other software. Mapping technologies can unwillingly reveal your location, and automatic downloads of data from third-party sources should be minimized when not needed.

- **High-security environments**: In high-security environments, this service should not be needed and should be disabled to minimize the attack surface and prevent location information leakage.

- **If the registry value does not exist**, it will be treated as if it's set to 2 (Auto), and the role will create it and set it to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Downloaded Maps Manager`
