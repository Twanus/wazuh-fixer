# win_ms_network_server_disconnect_logon_hours

This role remediates CIS Benchmark 2.3.9.4 (check 26037): Ensure 'Microsoft network server: Disconnect clients when logon hours expire' is set to 'Enabled'.

## Description

If your organization configures logon hours for users, then it makes sense to enable this policy setting. Otherwise, users who should not have access to network resources outside of their logon hours may actually be able to continue to use those resources with sessions that were established during allowed hours.

This security setting determines whether to disconnect users who are connected to the local computer outside their user account's valid logon hours. This setting affects the Server Message Block (SMB) component. If you enable this policy setting you should also enable Network security: Force logoff when logon hours expire (Rule 2.3.11.6). If your organization configures logon hours for users, this policy setting is necessary to ensure they are effective.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_ms_network_server_disconnect_logon_hours_enabled_value` | `1` | Registry value for EnableForcedLogOff. Set to 1 to enable disconnecting clients when logon hours expire (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable Microsoft network server disconnect on logon hours expire
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_server_disconnect_logon_hours
```

Or using the development path:

```yaml
---
- name: Enable Microsoft network server disconnect on logon hours expire
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_ms_network_server_disconnect_logon_hours  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.9.4 (check 26037)
- **CIS CSC v7**: 16.13

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `EnableForcedLogOff`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanManServer\Parameters" -Name "EnableForcedLogOff" -ErrorAction SilentlyContinue | Select-Object EnableForcedLogOff
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `EnableForcedLogOff` is set to 1 (or does not exist, which is also compliant)

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that users who should not have access to network resources outside of their logon hours are disconnected when their logon hours expire. This prevents users from continuing to use network resources with sessions that were established during allowed hours.

- **Logon hours**: This setting is only effective if logon hours are configured for users. If your organization does not configure logon hours, this setting has no effect.

- **Companion setting**: If you enable this policy setting, you should also enable "Network security: Force logoff when logon hours expire" (CIS 2.3.11.6) for comprehensive enforcement of logon hours.

- **SMB component**: This setting affects the Server Message Block (SMB) component, which means it applies to SMB file and print sharing sessions.

- **User experience**: When logon hours expire, users will be disconnected from network resources. They will need to wait until their logon hours are valid again, or an administrator can adjust their logon hours.

- **If the registry value does not exist**, it is considered compliant (the check condition allows for the value not existing). However, this role will create the value and set it to 1 (Enabled) to ensure explicit compliance.
