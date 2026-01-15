# win_network_access_remotely_accessible_registry_paths_and_subpaths

This role remediates CIS Benchmark 2.3.10.8 (check 26045): Ensure 'Network access: Remotely accessible registry paths and sub-paths' is configured.

## Description

The registry contains sensitive computer configuration information that could be used by an attacker to facilitate unauthorized activities. The fact that the default ACLs assigned throughout the registry are fairly restrictive and help to protect the registry from access by unauthorized users reduces the risk of such an attack.

This policy setting determines which registry paths and sub-paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the winreg registry key.

**The recommended state for this setting is:** System\CurrentControlSet\Control\Print\Printers, System\CurrentControlSet\Services\Eventlog, Software\Microsoft\OLAP Server, Software\Microsoft\Windows NT\CurrentVersion\Print, Software\Microsoft\Windows NT\CurrentVersion\Windows, System\CurrentControlSet\Control\ContentIndex, System\CurrentControlSet\Control\Terminal Server, System\CurrentControlSet\Control\Terminal Server\UserConfig, System\CurrentControlSet\Control\Terminal Server\DefaultUserConfiguration, Software\Microsoft\Windows NT\CurrentVersion\Perflib, System\CurrentControlSet\Services\SysmonLog

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_remotely_accessible_registry_paths_and_subpaths_allowed_paths` | See below | List of registry paths and sub-paths that can be accessed remotely. Default is the recommended paths from CIS Benchmark. |

### Default Paths

The default paths are:
- `System\CurrentControlSet\Control\Print\Printers`
- `System\CurrentControlSet\Services\Eventlog`
- `Software\Microsoft\OLAP Server`
- `Software\Microsoft\Windows NT\CurrentVersion\Print`
- `Software\Microsoft\Windows NT\CurrentVersion\Windows`
- `System\CurrentControlSet\Control\ContentIndex`
- `System\CurrentControlSet\Control\Terminal Server`
- `System\CurrentControlSet\Control\Terminal Server\UserConfig`
- `System\CurrentControlSet\Control\Terminal Server\DefaultUserConfiguration`
- `Software\Microsoft\Windows NT\CurrentVersion\Perflib`
- `System\CurrentControlSet\Services\SysmonLog`

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network access remotely accessible registry paths and sub-paths
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_remotely_accessible_registry_paths_and_subpaths
```

Or using the development path:

```yaml
---
- name: Configure network access remotely accessible registry paths and sub-paths
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_remotely_accessible_registry_paths_and_subpaths  # noqa role-name[path]
```

### Override to use custom paths

```yaml
---
- name: Configure network access remotely accessible registry paths and sub-paths with custom paths
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_network_access_remotely_accessible_registry_paths_and_subpaths_allowed_paths:
      - 'System\CurrentControlSet\Control\Print\Printers'
      - 'System\CurrentControlSet\Services\Eventlog'
      - 'Software\Microsoft\OLAP Server'
      # ... add more paths as needed
  roles:
    - role: twanus.wazuh_fixer.win_network_access_remotely_accessible_registry_paths_and_subpaths
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.8 (check 26045)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\SecurePipeServers\Winreg\AllowedPaths`
- **Value Name**: `Machine`
- **Value Type**: `REG_MULTI_SZ` (multistring)
- **Required Value**: List of registry paths and sub-paths (default: see Default Paths section above)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\SecurePipeServers\Winreg\AllowedPaths" -Name "Machine" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Machine
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\SecurePipeServers\Winreg\AllowedPaths`
3. Check that `Machine` contains the recommended paths

## Idempotency

This role is idempotent. If the registry value is already set to the configured paths, no changes will be made. The role will update the value if it is different from the configured paths.

## Notes

- **Security benefit**: Configuring this setting determines which registry paths and sub-paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the winreg registry key. This helps protect sensitive registry information from unauthorized access.

- **Registry security**: The registry contains sensitive computer configuration information that could be used by an attacker to facilitate unauthorized activities. The fact that the default ACLs assigned throughout the registry are fairly restrictive and help to protect the registry from access by unauthorized users reduces the risk of such an attack.

- **Recommended paths**: The default paths are the recommended paths from the CIS Benchmark. All paths must be present for compliance (the check uses "Condition: all").

- **Path format**: Paths should be specified without the `HKEY_LOCAL_MACHINE\` prefix. Use backslashes (\) as path separators.

- **REG_MULTI_SZ format**: This setting uses a REG_MULTI_SZ (multistring) value type, which stores multiple strings in a single registry value.

- **Windows version notes**: In Windows XP this setting is called "Network access: Remotely accessible registry paths," the setting with that same name in Windows Vista, Windows Server 2008 (non-R2), and Windows Server 2003 does not exist in Windows XP.

- **Difference from AllowedExactPaths**: This setting (`AllowedPaths`) is different from the "Network access: Remotely accessible registry paths" setting (`AllowedExactPaths`). This setting allows access to paths and sub-paths, while `AllowedExactPaths` only allows access to the exact paths specified.
