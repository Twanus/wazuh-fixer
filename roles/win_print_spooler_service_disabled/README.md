# win_print_spooler_service_disabled

This role remediates CIS Benchmark 5.17 (check 26088): Ensure 'Print Spooler (Spooler)' is set to 'Disabled'.

## Description

This service spools print jobs and handles interaction with printers. The Print Spooler service is used to manage print queues and send print jobs to printers. However, in a high security environment, unnecessary services especially those with known vulnerabilities should be disabled.

Disabling the Print Spooler (Spooler) service mitigates the PrintNightmare vulnerability (CVE-2021-34527) and other attacks against the service. The PrintNightmare vulnerability allows remote code execution through the Print Spooler service.

This policy setting controls the startup type of the Print Spooler (Spooler) service.

**The recommended state for this setting is: Disabled.**

When Disabled, the Print Spooler service is disabled and will not start, preventing print functionality and reducing the attack surface.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_print_spooler_service_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Print Spooler Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_print_spooler_service_disabled
```

Or using the development path:

```yaml
---
- name: Disable Print Spooler Service
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_print_spooler_service_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 5.17 (check 26088)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Spooler`
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
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Spooler" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Spooler`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Print Spooler`
3. Check that the service is set to `Disabled`

You can also verify using the Services console:

1. Open `services.msc`
2. Find `Print Spooler` service
3. Check that the Startup type is set to `Disabled`

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling the Print Spooler service reduces the attack surface by preventing print functionality and mitigating the PrintNightmare vulnerability (CVE-2021-34527) and other attacks against the service.

- **Print functionality**: When the Print Spooler service is disabled, users will not be able to print documents. This is acceptable in high-security environments where print functionality is not required.

- **Vulnerability mitigation**: The PrintNightmare vulnerability (CVE-2021-34527) allows remote code execution through the Print Spooler service. Disabling the service completely mitigates this vulnerability and prevents similar attacks.

- **High-security environments**: In high-security environments, unnecessary services especially those with known vulnerabilities should be disabled, even if it causes inconvenience.

- **If the registry value does not exist**, it will be treated as if it's set to 2 (Auto), and the role will create it and set it to `4` (Disabled) to ensure compliance.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Windows Settings\Security Settings\System Services\Print Spooler`

- **System impact**: Disabling the Print Spooler service will prevent all printing functionality on the system. Ensure this is acceptable in your environment before applying this role.
