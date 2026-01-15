# win_system_objects_strengthen_default_permissions

This role remediates CIS Benchmark 2.3.15.2 (check 26063): Ensure 'System objects: Strengthen default permissions of internal system objects (e.g. Symbolic Links)' is set to 'Enabled'.

## Description

This policy setting determines the strength of the default discretionary access control list (DACL) for objects. Windows maintains a global list of shared computer resources so that objects can be located and shared among processes. Each type of object is created with a default DACL that specifies who can access the objects and with what permissions.

When this setting is enabled, Windows strengthens the default DACL for objects such as symbolic links, mutexes, and semaphores. This helps prevent unauthorized access to these critical system objects.

**The recommended state for this setting is: Enabled.**

## Rationale

This setting determines the strength of the default DACL for objects. Windows maintains a global list of shared computer resources so that objects can be located and shared among processes. Each type of object is created with a default DACL that specifies who can access the objects and with what permissions.

By strengthening the default permissions, the system reduces the risk of unauthorized access to critical system objects like symbolic links, mutexes, and semaphores. This is particularly important for preventing privilege escalation attacks and maintaining system security.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_system_objects_strengthen_default_permissions_protection_mode_value` | `1` | Registry value for ProtectionMode (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Strengthen default permissions of internal system objects
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_system_objects_strengthen_default_permissions
```

Or using the development path:

```yaml
---
- name: Strengthen default permissions of internal system objects
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_system_objects_strengthen_default_permissions  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.15.2 (check 26063)
- **CIS CSC v7**: 5.1
- **CIS CSC v8**: 4.1
- **CMMC v2.0**: AC.L1-3.1.1, AC.L1-3.1.2, CM.L2-3.4.1, CM.L2-3.4.2, CM.L2-3.4.6, CM.L2-3.4.7
- **ISO 27001:2013**: A.14.2.5, A.8.1.3
- **NIST SP 800-53**: CM-7(1), CM-9, SA-10
- **PCI DSS v3.2.1**: 11.5, 2.2
- **PCI DSS v4.0**: 1.1.1, 1.2.1, 1.2.6, 1.2.7, 1.5.1, 2.1.1, 2.2.1
- **SOC 2**: CC7.1, CC8.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager`
- **Value Name**: `ProtectionMode`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Session Manager" -Name "ProtectionMode" -ErrorAction SilentlyContinue | Select-Object ProtectionMode
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager`
3. Check that `ProtectionMode` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Default DACL strengthening**: When enabled, this setting strengthens the default discretionary access control list (DACL) for internal system objects, making them more secure by default.

- **System objects protected**: This setting affects objects such as symbolic links, mutexes, semaphores, and other shared system resources that are maintained in a global list.

- **Security benefits**: Strengthening default permissions helps prevent unauthorized access to critical system objects, reducing the risk of privilege escalation attacks and maintaining system integrity.

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure explicit compliance. According to the CIS check, the absence of this value is also considered compliant (as the default behavior may be acceptable), but setting it explicitly is recommended.
