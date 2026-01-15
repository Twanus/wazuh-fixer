# win_remote_desktop_services_disabled

This role remediates CIS Benchmark 5.21 (check 26092): Ensure 'Remote Desktop Services (TermService)' is set to 'Disabled'.

## Description

Remote Desktop Services allows users to connect interactively to a remote computer. Remote Desktop and Remote Desktop Session Host Server depend on this service.

**The recommended state for this setting is: Disabled.**

In a high security environment, Remote Desktop access is an increased security risk. For these environments, only local console access should be permitted.

When Disabled, the Remote Desktop Services service is disabled and will not start, preventing users from connecting interactively to a remote computer, reducing the attack surface.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_remote_desktop_services_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Remote Desktop Services
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_remote_desktop_services_disabled
```

Or using the development path:

```yaml
---
- name: Disable Remote Desktop Services
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_remote_desktop_services_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.21 (check 26092)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TermService`
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
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\TermService"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\TermService" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TermService`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Remote Desktop Services`
3. Check that the service is set to `Disabled`

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Remote Desktop Services reduces the attack surface by preventing users from connecting interactively to a remote computer. In a high security environment, Remote Desktop access is an increased security risk. For these environments, only local console access should be permitted.

- **If the service is not installed** (registry key does not exist), the role will report that the system is already compliant and no changes will be made.

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Remote Desktop Services`
