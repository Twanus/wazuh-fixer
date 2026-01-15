# win_interactive_logon_machine_lockout_threshold

This role remediates CIS Benchmark 2.3.7.3 (check 26024): Ensure 'Interactive logon: Machine account lockout threshold' is set to '10 or fewer invalid logon attempts, but not 0'.

## Description

If a machine is lost or stolen, or if an insider threat attempts a brute force password attack against the computer, it is important to ensure that BitLocker will lock the computer and therefore prevent a successful attack.

This security setting determines the number of failed logon attempts that causes the machine to be locked out. Failed password attempts against workstations or member servers that have been locked using either CTRL+ALT+DELETE or password protected screen savers counts as failed logon attempts. The machine lockout policy is enforced only on those machines that have BitLocker enabled for protecting OS volumes.

**The recommended state for this setting is: 10 or fewer invalid logon attempts, but not 0.**

**Important Notes:**
- A value of 0 does not conform to the benchmark as it disables the machine account lockout threshold.
- Values from 1 to 3 will be interpreted as 4 by Windows.
- The machine lockout policy is enforced only on machines that have BitLocker enabled for protecting OS volumes.
- Please ensure that appropriate recovery password backup policies are enabled.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- BitLocker enabled on OS volumes (for the policy to be enforced)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_machine_lockout_threshold_lockout_threshold` | `10` | Number of failed logon attempts before machine lockout. Must be between 1 and 10 (not 0). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set machine account lockout threshold
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_machine_lockout_threshold
```

Or using the development path:

```yaml
---
- name: Set machine account lockout threshold
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_machine_lockout_threshold_lockout_threshold: 10
  roles:
    - role: ../roles/win_interactive_logon_machine_lockout_threshold  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.3 (check 26024)
- **CIS CSC v8**: 4.10
- **CMMC v2.0**: AC.L2-3.1.8, SC.L2-3.13.9
- **PCI DSS v4.0**: 8.3.4

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `MaxDevicePasswordFailedAttempts`
- **Value Type**: `REG_DWORD`
- **Required Value**: Between 1 and 10 (not 0)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "MaxDevicePasswordFailedAttempts" -ErrorAction SilentlyContinue | Select-Object MaxDevicePasswordFailedAttempts
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `MaxDevicePasswordFailedAttempts` is set to a value between 1 and 10 (not 0)

## Idempotency

This role is idempotent. If the registry value is already set to a value between 1 and 10 (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to 0 (disabled)
- It is currently set to a value greater than 10
- It is currently set to a different value than the configured value

## Notes

- **BitLocker requirement**: The machine lockout policy is enforced only on machines that have BitLocker enabled for protecting OS volumes. If BitLocker is not enabled, this setting will not have any effect.

- **Value interpretation**: Values from 1 to 3 will be interpreted as 4 by Windows. For example, if you set the value to 2, Windows will actually use 4 as the threshold.

- **Recovery password backup**: Ensure that appropriate recovery password backup policies are enabled, as machine lockout can prevent access to the system if the password is forgotten.

- **Failed logon attempts**: Failed password attempts against workstations or member servers that have been locked using either CTRL+ALT+DELETE or password protected screen savers count as failed logon attempts.

- **Security benefit**: This setting helps protect against brute force attacks on lost or stolen machines, or insider threats attempting password attacks against the computer.

- **If the registry value does not exist**, it will be created and set to 10 (or the configured value) to ensure compliance.
