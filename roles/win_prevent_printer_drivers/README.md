# win_prevent_printer_drivers

This role remediates CIS Benchmark 2.3.4.1 (check 26015): Ensure 'Devices: Prevent users from installing printer drivers' is set to 'Enabled'.

## Description

It may be appropriate in some organizations to allow users to install printer drivers on their own workstations. However, in a high security environment, you should allow only Administrators, not users, to do this, because printer driver installation may unintentionally cause the computer to become less stable. A malicious user could install inappropriate printer drivers in a deliberate attempt to damage the computer, or a user might accidentally install malicious software that masquerades as a printer driver. It is feasible for an attacker to disguise a Trojan horse program as a printer driver. The program may appear to users as if they must use it to print, but such a program could unleash malicious code on your computer network.

For a computer to print to a shared printer, the driver for that shared printer must be installed on the local computer. This security setting determines who is allowed to install a printer driver as part of connecting to a shared printer.

**Important Notes:**
- This setting does not affect the ability to add a local printer.
- This setting does not affect Administrators.
- This setting only applies when connecting to shared network printers.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_prevent_printer_drivers_enabled_value` | `1` | Registry value for AddPrinterDrivers (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Prevent users from installing printer drivers
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_prevent_printer_drivers
```

Or using the development path:

```yaml
---
- name: Prevent users from installing printer drivers
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_prevent_printer_drivers  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.4.1 (check 26015)
- **CIS CSC v8**: 6.8
- **CMMC v2.0**: AC.L1-3.1.2, AC.L2-3.1.4, AC.L2-3.1.5, SC.L2-3.13.3
- **HIPAA**: 164.308(a)(3)(ii)(B), 164.308(a)(4)(i), 164.308(a)(4)(ii)(C)
- **NIST SP 800-53**: AC-5, AC-6, AC-6(1), AC-6(7), AU-9(4)
- **PCI DSS v4.0**: 10.3.1, 7.1, 7.1.1, 7.2, 7.2.1, 7.2.2, 7.2.4, 7.2.6, 7.3, 7.3.1, 7.3.2
- **SOC 2**: CC5.2, CC6.3

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Print\Providers\LanMan Print Services\Servers`
- **Value Name**: `AddPrinterDrivers`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Print\Providers\LanMan Print Services\Servers" -Name "AddPrinterDrivers" -ErrorAction SilentlyContinue | Select-Object AddPrinterDrivers
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Print\Providers\LanMan Print Services\Servers`
3. Check that `AddPrinterDrivers` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Local printers**: This setting does not affect the ability to add local printers, only network shared printers.

- **Administrator privilege**: This setting does not affect Administrators, who can always install printer drivers regardless of this setting.

- **Security considerations**: Enabling this setting prevents users from installing printer drivers, which helps protect against:
  - Malicious software disguised as printer drivers
  - System instability from inappropriate drivers
  - Trojan horse programs masquerading as printer drivers

- **User impact**: When enabled, users will not be able to install printer drivers when connecting to shared network printers. Administrators will need to install printer drivers manually for users, or the drivers can be pre-installed via group policy or other deployment methods.

- **If the registry value does not exist**, it will be created and set to `1` (Enabled).
