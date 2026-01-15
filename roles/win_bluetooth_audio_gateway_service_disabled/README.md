# win_bluetooth_audio_gateway_service_disabled

This role remediates CIS Benchmark 5.1 (check 26072): Ensure 'Bluetooth Audio Gateway Service (BTAGService)' is set to 'Disabled'.

## Description

Service supporting the audio gateway role of the Bluetooth Handsfree Profile. Bluetooth technology has inherent security risks - especially prior to the v2.1 standard. Wireless Bluetooth traffic is not well encrypted (if at all), so in a high-security environment, it should not be permitted, in spite of the added inconvenience of not being able to use Bluetooth devices.

This policy setting controls the startup type of the Bluetooth Audio Gateway Service (BTAGService).

**The recommended state for this setting is: Disabled.**

When Disabled, the Bluetooth Audio Gateway Service is disabled and will not start, preventing Bluetooth audio gateway functionality and reducing the attack surface.

## Requirements

- Ansible 2.9 or higher
- Windows target host (Windows 10 Release 1803 or later)
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_bluetooth_audio_gateway_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Bluetooth Audio Gateway Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_bluetooth_audio_gateway_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Bluetooth Audio Gateway Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_bluetooth_audio_gateway_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.1 (check 26072)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTAGService`
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
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\BTAGService" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTAGService`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Bluetooth Audio Gateway Service`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Bluetooth Audio Gateway Service reduces the attack surface by preventing Bluetooth audio gateway functionality. Bluetooth technology has inherent security risks, especially prior to the v2.1 standard, and wireless Bluetooth traffic is not well encrypted (if at all).

- **Windows version requirement**: This service was first introduced in Windows 10 Release 1803. It appears to have replaced the older Bluetooth Handsfree Service (BthHFSrv), which was removed from Windows in that release (it is not simply a rename, but a different service).

- **High-security environments**: In high-security environments, Bluetooth should not be permitted, in spite of the added inconvenience of not being able to use Bluetooth devices.

- **If the registry value does not exist**, it will be treated as if it's set to 2 (Auto), and the role will create it and set it to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Bluetooth Audio Gateway Service`
