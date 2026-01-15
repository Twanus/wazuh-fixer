# win_remote_desktop_services_usermode_port_redirector_disabled

This role remediates CIS Benchmark 5.22 (check 26093): Ensure 'Remote Desktop Services UserMode Port Redirector (UmRdpService)' is set to 'Disabled'.

## Description

Remote Desktop Services UserMode Port Redirector (UmRdpService) allows the redirection of Printers/Drives/Ports for RDP connections.

**The recommended state for this setting is: Disabled.**

In a security-sensitive environment, it is desirable to reduce the possible attack surface - preventing the redirection of COM, LPT and PnP ports will reduce the number of unexpected avenues for data exfiltration and/or malicious code transfer within an RDP session.

When Disabled, the Remote Desktop Services UserMode Port Redirector service is disabled and will not start, preventing the redirection of COM, LPT and PnP ports for RDP connections, reducing the attack surface and preventing potential data exfiltration or malicious code transfer.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_remote_desktop_services_usermode_port_redirector_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Remote Desktop Services UserMode Port Redirector Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_remote_desktop_services_usermode_port_redirector_disabled
```

Or using the development path:

```yaml
---
- name: Disable Remote Desktop Services UserMode Port Redirector Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_remote_desktop_services_usermode_port_redirector_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.22 (check 26093)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UmRdpService`
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
# Check if service registry key exists
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\UmRdpService"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\UmRdpService" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UmRdpService`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Remote Desktop Services UserMode Port Redirector`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Remote Desktop Services UserMode Port Redirector service reduces the attack surface by preventing the redirection of COM, LPT and PnP ports for RDP connections. This reduces the number of unexpected avenues for data exfiltration and/or malicious code transfer within an RDP session.

- **If the service is not installed** (registry key does not exist), the role will report that the system is already compliant and no changes will be made.

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Remote Desktop Services UserMode Port Redirector`
