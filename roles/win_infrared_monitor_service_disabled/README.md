# win_infrared_monitor_service_disabled

This role remediates CIS Benchmark 5.7 (check 26078): Ensure 'Infrared monitor service (irmon)' is set to 'Disabled' or 'Not Installed'.

## Description

The Infrared monitor service (irmon) detects other Infrared devices that are in range and launches the file transfer application. Infrared connections can potentially be a source of data compromise - especially via the automatic "file transfer application" functionality. Enterprise-managed systems should utilize a more secure method of connection than infrared.

**Important Notes:**
- Disabling this service prevents the Infrared monitor service from running and reduces the attack surface.
- If the service is not installed (registry key does not exist), this is also compliant and no action is taken.
- This setting is recommended for all security environments, especially enterprise-managed systems.
- Modern systems typically do not have infrared hardware, so the service may not be installed by default.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_infrared_monitor_service_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable Infrared monitor Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_infrared_monitor_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Infrared monitor Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_infrared_monitor_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.7 (check 26078)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\irmon`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled) OR service not installed (registry key does not exist)

## Verification

You can verify the setting using PowerShell:

```powershell
if (Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\irmon") {
    Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\irmon" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
} else {
    Write-Output "Service not installed (registry key does not exist)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\irmon`
3. If the key exists, check that `Start` is set to `4` (Disabled)
4. If the key does not exist, the service is not installed (also compliant)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "irmon" -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType
```

If the service is not installed, the command will return an error. If installed, the `StartType` should show as `Disabled`.

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Infrared monitor service`
3. Check that the service is set to `Disabled` (or ensure the service is not installed)

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling or not installing the Infrared monitor service reduces the attack surface by preventing:
  - Automatic file transfer application launches when infrared devices are detected
  - Potential data compromise through infrared connections
  - Unnecessary service running on systems without infrared hardware

- **Compliance note**: The service is compliant if either:
  - The registry key does not exist (service not installed)
  - The Start value is set to `4` (Disabled)

- **Modern systems**: Most modern Windows systems do not have infrared hardware, so the service may not be installed by default. If you see "KEY_NOT_EXISTS" in the role output, the service is not installed, which is compliant.

- **Enterprise environments**: Enterprise-managed systems should utilize more secure methods of connection than infrared (e.g., USB, network shares, cloud storage). Infrared technology has inherent security risks and should be disabled in enterprise environments.

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "irmon" -Force -ErrorAction SilentlyContinue
  ```

- **Hardware dependency**: This service is only useful on systems with infrared hardware. Most modern laptops and desktops do not include infrared ports, making this service unnecessary.
