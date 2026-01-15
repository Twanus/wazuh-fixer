# win_lxss_manager_service_disabled

This role remediates CIS Benchmark 5.9 (check 26080): Ensure 'LxssManager (LxssManager)' is set to 'Disabled' or 'Not Installed'.

## Description

The Linux Subsystem (LXSS) Manager allows full system access to Linux applications on Windows, including the file system. While this can certainly have some functionality and performance benefits for running those applications, it also creates new security risks in the event that a hacker injects malicious code into a Linux application. For best security, it is preferred to run Linux applications on Linux, and Windows applications on Windows.

The LXSS Manager service supports running native ELF binaries. The service provides the infrastructure necessary for ELF binaries to run on Windows. The recommended state for this setting is: Disabled or Not Installed.

**Important Notes:**
- This service is not installed by default. It is supplied with Windows, but is installed by enabling an optional Windows feature (Windows Subsystem for Linux).
- Disabling this service prevents the Linux Subsystem Manager from running and reduces the attack surface.
- If the service is not installed (registry key does not exist), this is also compliant and no action is taken.
- Removing the Windows Subsystem for Linux optional feature will also remediate this recommendation.
- This setting is recommended for all security environments.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_lxss_manager_service_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable LxssManager Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_lxss_manager_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable LxssManager Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_lxss_manager_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.9 (check 26080)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LxssManager`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled) OR service not installed (registry key does not exist) OR Start value not set

## Verification

You can verify the setting using PowerShell:

```powershell
if (Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LxssManager") {
    Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LxssManager" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
} else {
    Write-Output "Service not installed (registry key does not exist)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LxssManager`
3. If the key exists, check that `Start` is set to `4` (Disabled)
4. If the key does not exist, the service is not installed (also compliant)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "LxssManager" -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType
```

If the service is not installed, the command will return an error. If installed, the `StartType` should show as `Disabled`.

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\LxssManager`
3. Check that the service is set to `Disabled` or ensure the service is not installed

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the service Start value is already set to `4` (Disabled), no changes will be made. If the Start value is not set (NOT_SET), the role will set it to `4` (Disabled) for explicit security configuration.

## Notes

- **Security considerations**: Disabling or not installing the LxssManager service reduces the attack surface by preventing:
  - Full system access to Linux applications on Windows
  - Potential security risks from malicious code injection into Linux applications
  - Cross-platform security vulnerabilities

- **Compliance note**: The service is compliant if any of the following conditions are met:
  - The registry key does not exist (service not installed)
  - The Start value does not exist (NOT_SET)
  - The Start value is set to `4` (Disabled)

- **Windows Subsystem for Linux**: The LxssManager service is installed when the Windows Subsystem for Linux (WSL) optional feature is enabled. If you see "KEY_NOT_EXISTS" in the role output, the service is not installed, which is compliant.

- **WSL removal**: Removing the Windows Subsystem for Linux optional feature (if not needed) will also remove the LxssManager service, making this recommendation automatically compliant.

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "LxssManager" -Force -ErrorAction SilentlyContinue
  ```

- **Best practice**: For best security, it is preferred to run Linux applications on Linux, and Windows applications on Windows. If you need to run Linux applications, consider using a dedicated Linux system or virtual machine instead of WSL.
