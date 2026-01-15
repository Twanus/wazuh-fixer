# win_special_administration_console_helper_disabled

This role remediates CIS Benchmark 5.29 (check 26100): Ensure 'Special Administration Console Helper (sacsvr)' is set to 'Disabled' or 'Not Installed'.

## Description

The Special Administration Console Helper (sacsvr) service allows administrators to remotely access a command prompt using Emergency Management Services (EMS). This service provides a remotely accessible command prompt that enables remote management tasks on a computer, which poses a security risk.

**Important Notes:**
- This service is not installed by default. It is supplied with Windows, but it is installed by enabling an optional Windows capability (Windows Emergency Management Services and Serial Console).
- Disabling this service prevents remote command prompt access via Emergency Management Services.
- If the service is not installed (registry key does not exist), this is also compliant and no action is taken.
- Allowing the use of a remotely accessible command prompt that provides the ability to perform remote management tasks on a computer is a security risk.
- This setting is recommended for all security environments.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_special_administration_console_helper_disabled_start_value` | `4` | Service Start value (4 = Disabled) |

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
- name: Disable Special Administration Console Helper Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_special_administration_console_helper_disabled
```

Or using the development path:

```yaml
---
- name: Disable Special Administration Console Helper Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_special_administration_console_helper_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.29 (check 26100)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\sacsvr`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled) OR service not installed (registry key does not exist)

## Verification

You can verify the setting using PowerShell:

```powershell
if (Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\sacsvr") {
    Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\sacsvr" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
} else {
    Write-Output "Service not installed (registry key does not exist)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\sacsvr`
3. If the key exists, check that `Start` is set to `4` (Disabled)
4. If the key does not exist, the service is not installed (also compliant)

You can also verify the service status using PowerShell:

```powershell
Get-Service -Name "sacsvr" -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType
```

If the service is not installed, the command will return an error. If installed, the `StartType` should show as `Disabled`.

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the service Start value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security considerations**: Disabling or not installing the Special Administration Console Helper service reduces the attack surface by preventing:
  - Remote command prompt access via Emergency Management Services
  - Remotely accessible command prompt that enables remote management tasks
  - Potential unauthorized administrative access

- **Compliance note**: The service is compliant if either:
  - The registry key does not exist (service not installed)
  - The Start value is set to `4` (Disabled)

- **Default installation**: This service is not installed by default. It is only installed when the Windows Emergency Management Services and Serial Console optional feature is enabled.

- **Service restart**: After changing the Start value, the service will not automatically restart. If the service is currently running, it will continue to run until the system is rebooted or the service is manually stopped. To immediately stop the service, you can use:

  ```powershell
  Stop-Service -Name "sacsvr" -Force -ErrorAction SilentlyContinue
  ```

- **Emergency Management Services**: If you need Emergency Management Services functionality, consider the security implications and ensure proper access controls are in place. For most environments, disabling this service is recommended.

## Rationale

Allowing the use of a remotely accessible command prompt that provides the ability to perform remote management tasks on a computer is a security risk. The Special Administration Console Helper service enables this functionality through Emergency Management Services, which should be disabled unless specifically required and properly secured.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
