# win_network_security_force_logoff_logon_hours_expire

This role remediates CIS Benchmark 2.3.11.6 (check 26055): Ensure 'Network security: Force logoff when logon hours expire' is set to 'Enabled'.

## Description

This policy setting determines whether to disconnect users who are connected to the local computer outside their user account's valid logon hours. This setting affects the Server Message Block (SMB) component.

If this setting is disabled, a user could remain connected to the computer outside of their allotted logon hours. This can be a security risk as it allows access outside of the intended time window.

If you enable this policy setting, you should also enable "Microsoft network server: Disconnect clients when logon hours expire" (Rule 2.3.9.4) for complete protection.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_force_logoff_logon_hours_expire_enabled_value` | `1` | Registry value for EnableForcedLogOff. Set to 1 to enable the policy (users are disconnected when logon hours expire). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable network security - force logoff when logon hours expire
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_force_logoff_logon_hours_expire
```

Or using the development path:

```yaml
---
- name: Enable network security - force logoff when logon hours expire
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_force_logoff_logon_hours_expire  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.6 (check 26055)
- **CIS CSC v7**: 16.13

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `EnableForcedLogOff`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters" -Name "EnableForcedLogOff" -ErrorAction SilentlyContinue | Select-Object EnableForcedLogOff
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `EnableForcedLogOff` is set to 1

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will create the value if it does not exist, or update it if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that users who are connected to the computer via SMB are automatically disconnected when their logon hours expire, preventing unauthorized access outside of designated time windows.

- **Related settings**: For complete protection, this setting should be used in conjunction with "Microsoft network server: Disconnect clients when logon hours expire" (Rule 2.3.9.4). The win_ms_network_server_disconnect_logon_hours role can be used to configure that setting.

- **SMB component**: This setting specifically affects the Server Message Block (SMB) component, which is used for file and printer sharing over the network.

- **User logon hours**: This setting works in conjunction with user account logon hours configured in Active Directory or local user accounts. Users must have logon hours configured for this policy to have effect.

- **If the registry value does not exist**, it will be created and set to 1 (Enabled) to ensure compliance.
