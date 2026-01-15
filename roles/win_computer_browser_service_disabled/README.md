# win_computer_browser_service_disabled

This role remediates CIS Benchmark 5.3 (check 26074): Ensure 'Computer Browser (Browser)' is set to 'Disabled' or 'Not Installed'.

## Description

The Computer Browser service is a legacy service that maintains a list of computers and their network shares in the environment (i.e., "Network Neighborhood"). If enabled, it generates a lot of unnecessary traffic, including "elections" to see who gets to be the "master browser". This noisy traffic could also aid malicious attackers in discovering online machines, because the service also allows anyone to "browse" for shared resources without any authentication.

This service used to be running by default in older Windows versions (e.g., Windows XP), but today it only remains for backward compatibility for very old software that requires it. In Windows 8.1 and Windows 10, this service is bundled with the SMB 1.0/CIFS File Sharing Support optional feature. The feature is not installed by default starting with Windows 10 R1709.

**Important Notes:**
- Disabling this service prevents the Computer Browser service from running and reduces network traffic.
- If the service is not installed (registry key does not exist), this is also compliant and no action is taken.
- Removing the SMB 1.0/CIFS File Sharing Support optional feature (highly recommended unless backward compatibility is needed) will also remediate this recommendation.
- This setting is recommended for all security environments.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_computer_browser_service_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable Computer Browser Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_computer_browser_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Computer Browser Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_computer_browser_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.3 (check 26074)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Browser`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled) OR service not installed (registry key does not exist)

## Verification

You can verify the setting using PowerShell:

```powershell
if (Test-Path -Path "HKLM:\System\CurrentControlSet\Services\Browser") {
    Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\Browser" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
} else {
    Write-Output "Service not installed (registry key does not exist)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Browser`
3. If the key exists, check that `Start` is set to `4` (Disabled)
4. If the key does not exist, the service is not installed (also compliant)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "Browser" -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType
```

If the service is not installed, the command will return an error. If installed, the `StartType` should show as `Disabled`.

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling or not installing the Computer Browser service reduces the attack surface by preventing:
  - Unnecessary network traffic (browser elections)
  - Anonymous browsing of network resources
  - Discovery of online machines by malicious attackers
  - Legacy network browsing functionality

- **Compliance note**: The service is compliant if either:
  - The registry key does not exist (service not installed)
  - The Start value is set to `4` (Disabled)

- **Windows 10 R1709+**: On Windows 10 R1709 and later, the Computer Browser service is not installed by default because SMB 1.0/CIFS File Sharing Support is not installed by default. If you see "KEY_NOT_EXISTS" in the role output, the service is not installed, which is compliant.

- **SMB 1.0 removal**: Removing the SMB 1.0/CIFS File Sharing Support optional feature (highly recommended for security) will also remove the Computer Browser service, making this recommendation automatically compliant.

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "Browser" -Force -ErrorAction SilentlyContinue
  ```

- **Backward compatibility**: This service is only needed for backward compatibility with very old software that requires it. In modern environments, it is safe to disable or remove.
