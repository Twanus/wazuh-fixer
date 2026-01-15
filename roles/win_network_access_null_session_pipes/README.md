# win_network_access_null_session_pipes

This role remediates CIS Benchmark 2.3.10.6 (check 26043): Ensure 'Network access: Named Pipes that can be accessed anonymously' is set to 'None'.

## Description

Limiting named pipes that can be accessed anonymously will reduce the attack surface of the system.

This policy setting determines which communication sessions, or pipes, will have attributes and permissions that allow anonymous access.

**The recommended state for this setting is: <blank> (i.e. None).**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

This role does not require any variables. The registry value `NullSessionPipes` should simply not exist (be removed).

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set network access named pipes to None
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_null_session_pipes
```

Or using the development path:

```yaml
---
- name: Set network access named pipes to None
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_null_session_pipes  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.6 (check 26043)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `NullSessionPipes`
- **Value Type**: `REG_MULTI_SZ` or `REG_SZ`
- **Required Value**: The value should not exist (be removed/absent) or be empty

## Verification

You can verify the setting using PowerShell:

```powershell
$value = Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanManServer\Parameters" -Name "NullSessionPipes" -ErrorAction SilentlyContinue
if ($null -eq $value) {
    Write-Output "NullSessionPipes does not exist (compliant)"
} else {
    Write-Output "NullSessionPipes exists: $($value.NullSessionPipes)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `NullSessionPipes` does not exist (or is empty if it exists)

## Idempotency

This role is idempotent. If the registry value does not exist (or is empty), no changes will be made. The role will remove the value if it exists and contains any data.

## Notes

- **Security benefit**: Setting this to None (blank/empty) prevents anonymous access to named pipes, which reduces the attack surface of the system. Named pipes are communication sessions used by Windows services, and allowing anonymous access to them can provide attackers with information about the system or potentially allow unauthorized access.

- **Attack surface reduction**: Limiting named pipes that can be accessed anonymously helps reduce the attack surface by preventing anonymous users from accessing communication sessions that could provide system information or allow unauthorized operations.

- **Default behavior**: When this value is not set (does not exist), no named pipes can be accessed anonymously, which is the recommended state.

- **Named pipes**: Named pipes are inter-process communication mechanisms used by Windows services. By default, many named pipes require authentication, but this setting can allow specific named pipes to be accessed anonymously if configured.

- **If the registry value exists with data**, this role will remove it to ensure compliance. The value should not exist, or if it exists, it should be empty (no named pipes listed).
