# win_ssdp_discovery_service_disabled

This role remediates CIS Benchmark 5.30 (check 26101): Ensure 'SSDP Discovery (SSDPSRV)' is set to 'Disabled'.

## Description

SSDP Discovery discovers networked devices and services that use the SSDP discovery protocol, such as UPnP devices. It also announces SSDP devices and services running on the local computer.

Universal Plug n Play (UPnP) is a real security risk - it allows automatic discovery and attachment to network devices. Note that UPnP is different than regular Plug n Play (PnP). Workstations should not be advertising their services (or automatically discovering and connecting to networked services) in a security-conscious enterprise managed environment.

**Important Notes:**
- Disabling this service prevents SSDP-based device discovery.
- This setting is recommended for high-security environments.
- Users will not be able to use UPnP devices when this service is disabled.
- The service can be re-enabled if UPnP functionality is required, but this reduces security posture.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_ssdp_discovery_service_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable SSDP Discovery Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_ssdp_discovery_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable SSDP Discovery Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_ssdp_discovery_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.30 (check 26101)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SSDPSRV`
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
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SSDPSRV" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SSDPSRV`
3. Check that `Start` is set to `4` (Disabled)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "SSDPSRV" | Select-Object Name, Status, StartType
```

The `StartType` should show as `Disabled`.

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\SSDP Discovery`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling SSDP Discovery reduces the attack surface by preventing:
  - Automatic discovery of network devices (UPnP)
  - Unauthorized device attachment
  - SSDP-based attacks
  - Service advertisement on the network
  - Automatic network service discovery

- **User impact**: When disabled, users will not be able to:
  - Use UPnP devices automatically
  - Discover network devices via SSDP
  - Use services that rely on SSDP discovery

- **Alternative configuration**: If UPnP functionality is required for business purposes, consider:
  - Using Group Policy to restrict SSDP usage
  - Implementing network segmentation
  - Monitoring SSDP traffic
  - Using firewall rules to restrict SSDP traffic

- **If the registry value does not exist**, it will be created and set to `4` (Disabled).

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "SSDPSRV" -Force
  ```

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\SSDP Discovery`
