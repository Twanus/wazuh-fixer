# win_bluetooth_support_service_disabled

This role remediates CIS Benchmark 5.2 (check 26073): Ensure 'Bluetooth Support Service (bthserv)' is set to 'Disabled'.

## Description

The Bluetooth service supports discovery and association of remote Bluetooth devices. Bluetooth technology has inherent security risks - especially prior to the v2.1 standard. Wireless Bluetooth traffic is not well encrypted (if at all), so in a high-security environment, it should not be permitted, in spite of the added inconvenience of not being able to use Bluetooth devices.

**Important Notes:**
- Disabling this service prevents Bluetooth devices from being discovered and associated.
- This setting is recommended for high-security environments.
- Users will not be able to use Bluetooth devices when this service is disabled.
- The service can be re-enabled if Bluetooth functionality is required, but this reduces security posture.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_bluetooth_support_service_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

### Windows Service Start Values

- `0` = Boot (loaded by kernel loader)
- `1` = System (loaded by I/O subsystem)
- `2` = Auto (starts automatically at boot)
- `3` = Manual (must be started manually)
- `4` = Disabled (cannot be started)

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Bluetooth Support Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_bluetooth_support_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Bluetooth Support Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_bluetooth_support_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.2 (check 26073)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\bthserv`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\bthserv" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\bthserv`
3. Check that `Start` is set to `4` (Disabled)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "bthserv" | Select-Object Name, Status, StartType
```

The `StartType` should show as `Disabled`.

## Idempotency

This role is idempotent. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling Bluetooth reduces the attack surface by preventing:
  - Unauthorized device pairing
  - Bluetooth-based attacks (BlueBorne, etc.)
  - Data exfiltration via Bluetooth
  - Unencrypted or weakly encrypted Bluetooth traffic

- **User impact**: When disabled, users will not be able to:
  - Pair Bluetooth devices (keyboards, mice, headsets, etc.)
  - Use Bluetooth for file transfers
  - Connect to Bluetooth-enabled peripherals

- **Alternative configuration**: If Bluetooth is required for business purposes, consider:
  - Using Group Policy to restrict Bluetooth usage
  - Implementing device whitelisting
  - Ensuring Bluetooth devices use encryption (v2.1+)
  - Monitoring Bluetooth connections

- **If the registry value does not exist**, it will be created and set to `4` (Disabled).

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "bthserv" -Force
  ```
