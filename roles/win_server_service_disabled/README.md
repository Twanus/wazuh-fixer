# win_server_service_disabled

This role remediates CIS Benchmark 5.26 (check 26097): Ensure 'Server (LanmanServer)' is set to 'Disabled'.

## Description

The Server (LanmanServer) service supports file, print, and named-pipe sharing over the network for this computer. If this service is stopped, these functions will be unavailable.

In a high security environment, a secure workstation should only be a client, not a server. Sharing workstation resources for remote access increases security risk as the attack surface is notably higher.

This policy setting controls the startup type of the Server (LanmanServer) service.

**The recommended state for this setting is: Disabled.**

When Disabled, the Server service is disabled and will not start, preventing file, print, and named-pipe sharing over the network and reducing the attack surface.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_server_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Server (LanmanServer) Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_server_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Server (LanmanServer) Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_server_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.26 (check 26097)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer`
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
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Server`
3. Check that the service is set to `Disabled`

You can also verify using the Services console:

1. Open `services.msc`
2. Find `Server` service
3. Check that the Startup type is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Server (LanmanServer) service reduces the attack surface by preventing file, print, and named-pipe sharing over the network. In a high security environment, a secure workstation should only be a client, not a server.

- **File and print sharing**: When the Server service is disabled, users will not be able to share files, printers, or named pipes over the network. This is acceptable in high-security environments where workstation resources should not be shared for remote access.

- **High-security environments**: In high-security environments, workstations should only be clients, not servers. Sharing workstation resources for remote access increases security risk as the attack surface is notably higher.

- **If the registry value does not exist**, it will be treated as if it's set to 2 (Auto), and the role will create it and set it to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Server`

- **System impact**: Disabling the Server service will prevent all file, print, and named-pipe sharing over the network. Ensure this is acceptable in your environment before applying this role. This is recommended for workstations in high-security environments.
