# win_wmp_network_sharing_service_disabled

This role remediates CIS Benchmark 5.35 (check 26106): Ensure 'Windows Media Player Network Sharing Service (WMPNetworkSvc)' is set to 'Disabled' or 'Not Installed'.

## Description

Shares Windows Media Player libraries to other networked players and media devices using Universal Plug and Play.

**The recommended state for this setting is: Disabled or Not Installed.**

Network sharing of media from Media Player has no place in an enterprise managed environment. The Windows Media Player Network Sharing Service allows users to share their media libraries over the network, which can expose sensitive information and create unnecessary network traffic.

When Disabled or Not Installed, the Windows Media Player Network Sharing Service cannot share media libraries, preventing unauthorized access to media content and reducing the attack surface.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_wmp_network_sharing_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Windows Media Player Network Sharing Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_wmp_network_sharing_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Windows Media Player Network Sharing Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_wmp_network_sharing_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.35 (check 26106)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WMPNetworkSvc`
- **Value Name**: `Start`
- **Value Type**: `REG_DWORD`
- **Required Value**: `4` (Disabled) or service not installed

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
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\WMPNetworkSvc"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\WMPNetworkSvc" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WMPNetworkSvc`
3. If the key does not exist, the service is not installed (compliant)
4. If the key exists, check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Windows Media Player Network Sharing Service`
3. Check that the service is set to `Disabled` or is not installed

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Windows Media Player Network Sharing Service reduces the attack surface by preventing media library sharing over the network. Network sharing of media from Media Player has no place in an enterprise managed environment.

- **Enterprise environments**: In enterprise managed environments, media sharing should be controlled and managed through proper IT policies rather than allowing individual users to share their media libraries. Disabling this service ensures that media content remains private and does not create unnecessary network traffic.

- **Universal Plug and Play (UPnP)**: This service uses UPnP to discover and share media libraries. UPnP can be a security risk as it automatically opens ports and creates firewall rules, which can be exploited by malicious software.

- **If the service is not installed** (registry key does not exist), the role will report that the system is already compliant and no changes will be made.

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Windows Media Player Network Sharing Service`
