# win_peer_name_resolution_protocol_service_disabled

This role remediates CIS Benchmark 5.13 (check 26084): Ensure 'Peer Name Resolution Protocol (PNRPsvc)' is set to 'Disabled' or 'Not Installed'.

## Description

The Peer Name Resolution Protocol (PNRP) service enables serverless peer name resolution over the Internet using the Peer Name Resolution Protocol. PNRP is a distributed and (mostly) serverless way to handle name resolution of clients with each other.

**Rationale:**

In a high security environment, it is more secure to rely on centralized name resolution methods maintained by authorized staff rather than distributed peer-to-peer name resolution. PNRP can potentially expose systems to unnecessary network traffic and discovery mechanisms that could be exploited by malicious actors.

**Important Notes:**
- Disabling this service prevents the Peer Name Resolution Protocol service from running and reduces the attack surface.
- If the service is not installed (registry key does not exist), this is also compliant and no action is taken.
- This setting is recommended for all security environments, especially high-security environments where centralized name resolution is preferred.
- PNRP is typically not needed in enterprise environments that use DNS and other centralized name resolution services.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_peer_name_resolution_protocol_service_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable Peer Name Resolution Protocol Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_peer_name_resolution_protocol_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Peer Name Resolution Protocol Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_peer_name_resolution_protocol_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.13 (check 26084)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PNRPsvc`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled) OR service not installed (registry key does not exist)

## Verification

You can verify the setting using PowerShell:

```powershell
if (Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\PNRPsvc") {
    Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\PNRPsvc" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
} else {
    Write-Output "Service not installed (registry key does not exist)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\PNRPsvc`
3. If the key exists, check that `Start` is set to `4` (Disabled)
4. If the key does not exist, the service is not installed (also compliant)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "PNRPsvc" -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType
```

If the service is not installed, the command will return an error. If installed, the `StartType` should show as `Disabled`.

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling or not installing the Peer Name Resolution Protocol service reduces the attack surface by preventing:
  - Distributed peer-to-peer name resolution
  - Unnecessary network traffic
  - Potential discovery mechanisms that could be exploited
  - Serverless name resolution that bypasses centralized controls

- **Compliance note**: The service is compliant if either:
  - The registry key does not exist (service not installed)
  - The Start value is set to `4` (Disabled)

- **Enterprise environments**: In enterprise environments with centralized DNS and other name resolution services, PNRP is typically not needed and should be disabled.

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "PNRPsvc" -Force -ErrorAction SilentlyContinue
  ```

- **Centralized name resolution**: This role supports the security best practice of using centralized name resolution methods (DNS, Active Directory, etc.) maintained by authorized staff rather than distributed peer-to-peer mechanisms.
