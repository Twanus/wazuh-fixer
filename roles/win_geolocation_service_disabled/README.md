# win_geolocation_service_disabled

This role remediates CIS Benchmark 5.5 (check 26076): Ensure 'Geolocation Service (lfsvc)' is set to 'Disabled'.

## Description

This service monitors the current location of the system and manages geofences (a geographical location with associated events). From a security perspective, it's not a good idea to reveal your location to software in most cases, but there are legitimate uses, such as mapping software. However, they should not be used in high security environments.

This policy setting controls the startup type of the Geolocation Service (lfsvc).

**The recommended state for this setting is: Disabled.**

When Disabled, the Geolocation Service is disabled and will not start, preventing location tracking and reducing the attack surface.

## Requirements

- Ansible 2.9 or higher
- Windows target host (Windows 10 or later)
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_geolocation_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Geolocation Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_geolocation_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Geolocation Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_geolocation_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.5 (check 26076)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\lfsvc`
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
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\lfsvc" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\lfsvc`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Geolocation Service`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Geolocation Service reduces the attack surface by preventing location tracking. From a security perspective, it's not a good idea to reveal your location to software in most cases.

- **High-security environments**: In high-security environments, location services should not be used, in spite of the added inconvenience of not being able to use location-based features.

- **Legitimate uses**: There are legitimate uses for location services, such as mapping software. However, they should not be used in high security environments.

- **If the registry value does not exist**, it will be treated as if it's set to 2 (Auto), and the role will create it and set it to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Geolocation Service`
