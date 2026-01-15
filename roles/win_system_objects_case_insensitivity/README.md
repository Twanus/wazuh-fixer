# win_system_objects_case_insensitivity

This role remediates CIS Benchmark 2.3.15.1 (check 26062): Ensure 'System objects: Require case insensitivity for non-Windows subsystems' is set to 'Enabled'.

## Description

This policy setting determines whether case insensitivity is enforced for all subsystems. The Microsoft Win32 subsystem is case insensitive. However, the kernel supports case sensitivity for other subsystems, such as the Portable Operating System Interface for UNIX (POSIX).

Because Windows is case insensitive (but the POSIX subsystem will support case sensitivity), failure to enforce this policy setting makes it possible for a user of the POSIX subsystem to create a file with the same name as another file by using mixed case to label it. Such a situation can block access to these files by another user who uses typical Win32 tools, because only one of the files will be available.

**The recommended state for this setting is: Enabled.**

## Rationale

Because Windows is case-insensitive but the POSIX subsystem will support case sensitivity, failure to enable this policy setting would make it possible for a user of that subsystem to create a file with the same name as another file but with a different mix of upper and lower case letters. Such a situation could potentially confuse users when they try to access such files from normal Win32 tools because only one of the files will be available.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_system_objects_case_insensitivity_enabled_value` | `1` | Registry value for ObCaseInsensitive (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Require case insensitivity for non-Windows subsystems
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_system_objects_case_insensitivity
```

Or using the development path:

```yaml
---
- name: Require case insensitivity for non-Windows subsystems
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_system_objects_case_insensitivity  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.15.1 (check 26062)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Kernel`
- **Value Name**: `ObCaseInsensitive`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Session Manager\Kernel" -Name "ObCaseInsensitive" -ErrorAction SilentlyContinue | Select-Object ObCaseInsensitive
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Kernel`
3. Check that `ObCaseInsensitive` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Case insensitivity enforcement**: When enabled, this setting ensures that all subsystems (including POSIX) enforce case insensitivity, preventing conflicts between files with the same name but different case.

- **POSIX subsystem**: The POSIX subsystem can support case sensitivity, which could create files that conflict with Windows' case-insensitive file system. Enabling this setting prevents such conflicts.

- **File access conflicts**: Without this setting, users of the POSIX subsystem could create files with names that differ only in case, which could block access to these files from Win32 tools since only one file would be available.

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure explicit compliance. According to the CIS check, the absence of this value is also considered compliant (as the default behavior may be acceptable), but setting it explicitly is recommended.
