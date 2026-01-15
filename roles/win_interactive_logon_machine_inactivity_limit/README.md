# win_interactive_logon_machine_inactivity_limit

This role remediates CIS Benchmark 2.3.7.4 (check 26025): Ensure 'Interactive logon: Machine inactivity limit' is set to '900 or fewer second(s), but not 0'.

## Description

If a user forgets to lock their computer when they walk away it's possible that a passerby will hijack it.

Windows notices inactivity of a logon session, and if the amount of inactive time exceeds the inactivity limit, then the screen saver will run, locking the session.

**The recommended state for this setting is: 900 or fewer second(s), but not 0.**

**Important Notes:**
- A value of 0 does not conform to the benchmark as it disables the machine inactivity limit.
- 900 seconds equals 15 minutes.
- When the inactivity limit is reached, the screen saver runs, locking the session.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_machine_inactivity_limit_inactivity_timeout` | `900` | Inactivity timeout in seconds. Must be between 1 and 900 seconds (not 0). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set machine inactivity limit
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_machine_inactivity_limit
```

Or using the development path:

```yaml
---
- name: Set machine inactivity limit
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_machine_inactivity_limit_inactivity_timeout: 900
  roles:
    - role: ../roles/win_interactive_logon_machine_inactivity_limit  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.4 (check 26025)
- **CIS CSC v7**: 16.11
- **CIS CSC v8**: 4.3
- **CMMC v2.0**: AC.L2-3.1.10, AC.L2-3.1.11
- **HIPAA**: 164.312(a)(2)(iii)
- **ISO 27001:2013**: A.8.1.3
- **NIST SP 800-53**: AC-11, AC-11(1), AC-12, AC-2(5)
- **PCI DSS v3.2.1**: 8.1.8
- **PCI DSS v4.0**: 8.2.8

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `InactivityTimeoutSecs`
- **Value Type**: `REG_DWORD`
- **Required Value**: Between 1 and 900 seconds (not 0)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "InactivityTimeoutSecs" -ErrorAction SilentlyContinue | Select-Object InactivityTimeoutSecs
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `InactivityTimeoutSecs` is set to a value between 1 and 900 seconds (not 0)

## Idempotency

This role is idempotent. If the registry value is already set to a value between 1 and 900 seconds (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to 0 (disabled)
- It is currently set to a value greater than 900 seconds
- It is currently set to a different value than the configured value

## Notes

- **Security benefit**: Setting a machine inactivity limit helps protect against unauthorized access when users forget to lock their computers. If a user walks away without locking the computer, the screen saver will run after the inactivity limit is reached, locking the session.

- **Screen saver lock**: When the inactivity limit is reached, the screen saver runs, which locks the session. This prevents passersby from hijacking the computer.

- **Default value**: The default value is 900 seconds (15 minutes), which balances security with usability. Organizations may choose a shorter timeout for higher security environments.

- **Value range**: The value must be between 1 and 900 seconds (not 0). A value of 0 disables the inactivity limit entirely, which is not recommended.

- **User experience**: Users will need to unlock their sessions if they are inactive for the specified duration. Ensure users are aware of this policy.

- **If the registry value does not exist**, it will be created and set to 900 seconds (or the configured value) to ensure compliance.
