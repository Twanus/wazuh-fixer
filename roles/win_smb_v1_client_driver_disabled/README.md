# win_smb_v1_client_driver_disabled

This role remediates CIS Benchmark 18.4.3 (check 26172): Ensure 'Configure SMB v1 client driver' is set to 'Enabled: Disable driver (recommended)'.

## Description

This setting configures the start type for the Server Message Block version 1 (SMBv1) client driver service (MRxSmb10), which is recommended to be disabled.

**The recommended state for this setting is: Enabled: Disable driver (recommended).**

Since September 2016, Microsoft has strongly encouraged that SMBv1 be disabled and no longer used on modern networks, as it is a 30 year old design that is much more vulnerable to attacks than much newer designs such as SMBv2 and SMBv3. SMBv1 lacks many security features present in SMBv2 and SMBv3, making it susceptible to various attacks including man-in-the-middle attacks and the WannaCry ransomware exploit.

When the SMB v1 client driver is disabled (Start value = 4), the driver service will not start, preventing the system from using SMBv1 for file and printer sharing. This reduces the attack surface and forces the use of more secure SMBv2 or SMBv3 protocols.

**Important Note**: Do not, under any circumstances, configure this overall setting as Disabled (in Group Policy), as doing so will delete the underlying registry entry altogether, which will cause serious problems. The registry value should be set to `4` (Disabled) rather than removing the registry key entirely.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_smb_v1_client_driver_disabled_start_value` | `4` | Service Start registry value (4 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable SMB v1 Client Driver
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_smb_v1_client_driver_disabled
```

Or using the development path:

```yaml
---
- name: Disable SMB v1 Client Driver
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_smb_v1_client_driver_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 18.4.3 (check 26172)
- **CIS CSC v7**: 9.2, 14.3
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.1, A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\mrxsmb10`
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
Test-Path -Path "HKLM:\SYSTEM\CurrentControlSet\Services\mrxsmb10"

# If it exists, check the Start value
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\mrxsmb10" -Name "Start" -ErrorAction SilentlyContinue | Select-Object Start
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\mrxsmb10`
3. Check that `Start` is set to `4` (Disabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Administrative Templates\MS Security Guide\Configure SMB v1 client driver`
3. Check that the setting is set to `Enabled: Disable driver (recommended)`

**Note**: The Group Policy path does not exist by default. An additional Group Policy template (SecGuide.admx/adml) is required - it is available from Microsoft at this link: [Microsoft Security Guidance](https://www.microsoft.com/en-us/download/details.aspx?id=55319)

## Idempotency

This role is idempotent. If the registry value is already set to `4` (Disabled), no changes will be made. If the registry value does not exist (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance. If the registry key does not exist (service driver not installed), this is also considered compliant.

## Notes

- **Security benefit**: Disabling SMBv1 reduces the attack surface by preventing the use of an outdated and vulnerable protocol. SMBv1 lacks many security features present in SMBv2 and SMBv3, making it susceptible to various attacks including man-in-the-middle attacks and ransomware exploits like WannaCry.

- **Microsoft recommendation**: Since September 2016, Microsoft has strongly encouraged that SMBv1 be disabled and no longer used on modern networks, as it is a 30 year old design that is much more vulnerable to attacks than much newer designs such as SMBv2 and SMBv3.

- **If the registry value does not exist** (but the service registry key exists), it will be created and set to `4` (Disabled) to ensure compliance.

- **If the registry key does not exist** (service driver not installed), this is also considered compliant, as SMBv1 should not be installed on modern Windows systems.

- **Group Policy alternative**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Administrative Templates\MS Security Guide\Configure SMB v1 client driver`. However, the Group Policy template (SecGuide.admx/adml) must be installed first.

- **Critical warning**: Do not, under any circumstances, configure this overall setting as Disabled (in Group Policy), as doing so will delete the underlying registry entry altogether, which will cause serious problems. The registry value should be set to `4` (Disabled) rather than removing the registry key entirely.

- **SMBv2 and SMBv3**: Modern Windows systems should use SMBv2 or SMBv3, which provide significantly better security features including encryption, improved authentication, and protection against various attack vectors.

- **Compatibility**: Disabling SMBv1 may affect connectivity to older systems or devices that only support SMBv1. However, the security benefits far outweigh compatibility concerns, and organizations should upgrade or replace systems that require SMBv1.
