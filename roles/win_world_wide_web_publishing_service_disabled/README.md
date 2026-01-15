# win_world_wide_web_publishing_service_disabled

This role remediates CIS Benchmark 5.40 (check 26111): Ensure 'World Wide Web Publishing Service (W3SVC)' is set to 'Disabled' or 'Not Installed'.

## Description

Provides Web connectivity and administration through the Internet Information Services Manager. The recommended state for this setting is: Disabled or Not Installed.

**The recommended state for this setting is: Disabled or Not Installed.**

Hosting a website from a workstation is an increased security risk, as the attack surface of that workstation is then greatly increased. If proper security mitigations are not followed, the chance of successful attack increases significantly. Note: This security concern applies to any web server application installed on a workstation, not just IIS.

When Disabled, the World Wide Web Publishing Service is disabled and will not start, preventing web server functionality and reducing the attack surface.

**Note**: This service is not installed by default. It is supplied with Windows, but is installed by enabling an optional Windows feature (Internet Information Services - World Wide Web Services).

**Note #2**: An organization may choose to selectively grant exceptions to web developers to allow IIS (or another web server) on their workstation, in order for them to locally test & develop web pages. However, the organization should track those machines and ensure the security controls and mitigations are kept up to date, to reduce risk of compromise.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_world_wide_web_publishing_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable World Wide Web Publishing Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_world_wide_web_publishing_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable World Wide Web Publishing Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_world_wide_web_publishing_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.40 (check 26111)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC`
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
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\W3SVC"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\W3SVC" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC`
3. If the key does not exist, the service is not installed (compliant)
4. If the key exists, check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\World Wide Web Publishing Service`
3. Check that the service is set to `Disabled` or is not installed

## Idempotency

This role is idempotent. If the service is not installed (registry key does not exist), no changes will be made and the role will report compliance. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the World Wide Web Publishing Service reduces the attack surface by preventing web server functionality. Hosting a website from a workstation is an increased security risk, as the attack surface of that workstation is then greatly increased.

- **Default installation**: This service is not installed by default. It is supplied with Windows, but is installed by enabling an optional Windows feature (Internet Information Services - World Wide Web Services).

- **Developer exceptions**: An organization may choose to selectively grant exceptions to web developers to allow IIS (or another web server) on their workstation, in order for them to locally test & develop web pages. However, the organization should track those machines and ensure the security controls and mitigations are kept up to date, to reduce risk of compromise.

- **If the service is not installed** (registry key does not exist), the role will report that the system is already compliant and no changes will be made.

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\World Wide Web Publishing Service`
