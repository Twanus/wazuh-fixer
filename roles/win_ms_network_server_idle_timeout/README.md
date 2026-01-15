# win_ms_network_server_idle_timeout

This role remediates CIS Benchmark 2.3.9.1 (check 26034): Ensure 'Microsoft network server: Amount of idle time required before suspending session' is set to '15 or fewer minute(s)'.

## Description

Each SMB session consumes server resources, and numerous null sessions will slow the server or possibly cause it to fail. An attacker could repeatedly establish SMB sessions until the server's SMB services become slow or unresponsive.

This policy setting allows you to specify the amount of continuous idle time that must pass in an SMB session before the session is suspended because of inactivity. Administrators can use this policy setting to control when a computer suspends an inactive SMB session. If client activity resumes, the session is automatically reestablished. The maximum value is 99999, which is over 69 days; in effect, this value disables the setting.

**The recommended state for this setting is: 15 or fewer minute(s).**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_ms_network_server_idle_timeout_idle_timeout_minutes` | `15` | Number of minutes of idle time before suspending SMB session. Must be between 1 and 15 minutes (inclusive). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set Microsoft network server idle timeout
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_server_idle_timeout
```

Or using the development path:

```yaml
---
- name: Set Microsoft network server idle timeout
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_ms_network_server_idle_timeout_idle_timeout_minutes: 15
  roles:
    - role: ../roles/win_ms_network_server_idle_timeout  # noqa role-name[path]
```

### Override to use a different timeout period

```yaml
---
- name: Set Microsoft network server idle timeout to 10 minutes
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_ms_network_server_idle_timeout_idle_timeout_minutes: 10
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_server_idle_timeout
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.9.1 (check 26034)
- **CIS CSC v7**: 16.11
- **ISO 27001:2013**: A.8.1.3

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `AutoDisconnect`
- **Value Type**: `REG_DWORD`
- **Required Value**: Between 1 and 15 minutes (inclusive)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanManServer\Parameters" -Name "AutoDisconnect" -ErrorAction SilentlyContinue | Select-Object AutoDisconnect
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `AutoDisconnect` is set to a value between 1 and 15 minutes

## Idempotency

This role is idempotent. If the registry value is already set to a value between 1 and 15 minutes (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to 0 (not set/disabled)
- It is currently set to a value greater than 15 minutes
- It is currently set to a different value than the configured value

## Notes

- **Security benefit**: Suspending idle SMB sessions helps prevent resource exhaustion attacks. An attacker could repeatedly establish SMB sessions until the server's SMB services become slow or unresponsive. By automatically suspending idle sessions, the server can free up resources and remain responsive.

- **Session suspension**: When an SMB session is suspended due to inactivity, it is not terminated. If client activity resumes, the session is automatically reestablished without requiring the client to reconnect.

- **Recommended range**: The CIS Benchmark recommends 15 or fewer minutes. The default value is 15 minutes (the maximum recommended), which balances security with usability.

- **Maximum value**: The maximum value that can be set is 99999 minutes (over 69 days), which effectively disables the setting. This is not recommended as it allows idle sessions to consume server resources indefinitely.

- **Server resources**: Each SMB session consumes server resources, and numerous null sessions will slow the server or possibly cause it to fail. Setting an appropriate idle timeout helps prevent resource exhaustion.

- **If the registry value does not exist**, it will be created and set to 15 minutes (or the configured value) to ensure compliance. According to the CIS check, the absence of this value is also considered compliant, but setting it explicitly is recommended.
