# win_upnp_device_host_disabled

This role remediates CIS Benchmark 5.31 (check 26102): Ensure 'UPnP Device Host (upnphost)' is set to 'Disabled'.

## Description

Universal Plug n Play (UPnP) is a real security risk - it allows automatic discovery and attachment to network devices. Notes that UPnP is different than regular Plug n Play (PnP). Workstations should not be advertising their services (or automatically discovering and connecting to networked services) in a security-conscious enterprise managed environment.

**Important Notes:**
- Disabling this service prevents UPnP devices from being hosted on this computer.
- This setting is recommended for security-conscious enterprise managed environments.
- UPnP allows automatic discovery and attachment to network devices, which poses security risks.
- The service can be re-enabled if UPnP functionality is required, but this reduces security posture.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_upnp_device_host_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable UPnP Device Host
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_upnp_device_host_disabled
```

Or using the development path:

```yaml
---
- name: Disable UPnP Device Host
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_upnp_device_host_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.31 (check 26102)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\upnphost`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\upnphost" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\upnphost`
3. Check that `Start` is set to `4` (Disabled)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "upnphost" | Select-Object Name, Status, StartType
```

The `StartType` should show as `Disabled`.

## Idempotency

This role is idempotent. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling UPnP reduces the attack surface by preventing:
  - Automatic discovery and attachment to network devices
  - Unauthorized device connections
  - Service advertisement on the network
  - Automatic network service discovery

- **User impact**: When disabled, users will not be able to:
  - Host UPnP devices on this computer
  - Automatically discover and connect to UPnP-enabled network devices
  - Use UPnP-based network services

- **Alternative configuration**: If UPnP is required for business purposes, consider:
  - Using Group Policy to restrict UPnP usage
  - Implementing network segmentation
  - Monitoring UPnP traffic
  - Using firewall rules to restrict UPnP ports

- **If the registry value does not exist**, it will be created and set to `4` (Disabled).

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "upnphost" -Force
  ```
