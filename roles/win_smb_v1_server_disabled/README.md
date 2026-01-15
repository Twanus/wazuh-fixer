# win_smb_v1_server_disabled

This role remediates CIS Benchmark 18.4.4 (check 26173): Ensure 'Configure SMB v1 server' is set to 'Disabled'.

## Description

Since September 2016, Microsoft has strongly encouraged that SMBv1 be disabled and no longer used on modern networks, as it is a 30 year old design that is much more vulnerable to attacks than much newer designs such as SMBv2 and SMBv3.

This setting configures the server-side processing of the Server Message Block version 1 (SMBv1) protocol.

**The recommended state for this setting is: Disabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_smb_v1_server_disabled_smb1_value` | `0` | Registry value for SMB1. Set to 0 to disable SMB v1 server (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable SMB v1 server
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_smb_v1_server_disabled
```

Or using the development path:

```yaml
---
- name: Disable SMB v1 server
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_smb_v1_server_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 18.4.4 (check 26173)
- **CIS CSC v7**: 9.2, 14.3
- **CIS CSC v8**: 4.8
- **CMMC v2.0**: CM.L2-3.4.7, CM.L2-3.4.8, SC.L2-3.13.6
- **ISO 27001-2013**: A.13.1.1, A.13.1.3
- **PCI DSS v3.2.1**: 1.1.6, 1.2.1, 2.2.2, 2.2.5
- **PCI DSS v4.0**: 1.2.5, 2.2.4, 6.4.1
- **SOC 2**: CC6.3, CC6.6

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters`
- **Value Name**: `SMB1`
- **Value Type**: `REG_DWORD`
- **Required Value**: 0 (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" -Name "SMB1" -ErrorAction SilentlyContinue | Select-Object SMB1
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters`
3. Check that `SMB1` is set to 0 (or does not exist, which is also compliant)

## Idempotency

This role is idempotent. If the registry value is already set to 0 (Disabled), or if the value does not exist (which is also compliant), no changes will be made. The role will update the value if it is different from 0.

## Notes

- **Security benefit**: Disabling SMB v1 server reduces the attack surface by preventing the use of an outdated and vulnerable protocol. SMBv1 is a 30-year-old design that is much more vulnerable to attacks than newer designs such as SMBv2 and SMBv3.

- **Microsoft recommendation**: Since September 2016, Microsoft has strongly encouraged that SMBv1 be disabled and no longer used on modern networks.

- **Compatibility**: Modern Windows systems and applications use SMBv2 and SMBv3, which provide better security and performance. Disabling SMBv1 should not impact normal operations on modern systems.

- **Group Policy**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Administrative Templates\MS Security Guide\Configure SMB v1 server`. Note that this Group Policy path does not exist by default and requires an additional Group Policy template (SecGuide.admx/adml) available from Microsoft.

- **Check condition**: The compliance check passes if any of the following conditions are met:
  - The registry key does not exist
  - The SMB1 value does not exist
  - The SMB1 value equals 0

- **If the registry value does not exist**, it is considered compliant (the check condition allows for the value not existing). However, this role will create the value and set it to 0 (Disabled) to ensure explicit compliance.

- **If the registry key does not exist**, it may indicate that the Server (LanmanServer) service is not installed. In this case, the role will not attempt to create the key, as this is already compliant.

## References

- [Stop using SMB1 | Storage at Microsoft](https://techcommunity.microsoft.com/t5/storage-at-microsoft/stop-using-smb1/ba-p/425858)
- [Disable SMB v1 in Managed Environments with Group Policy](https://techcommunity.microsoft.com/t5/storage-at-microsoft/disabling-smbv1-through-group-policy/ba-p/425858)
- [Disabling SMBv1 through Group Policy - Microsoft Security Guidance blog](https://techcommunity.microsoft.com/t5/storage-at-microsoft/disabling-smbv1-through-group-policy/ba-p/425858)
