# win_network_access_remotely_accessible_registry_paths

This role remediates CIS Benchmark 2.3.10.7 (check 26044): Ensure 'Network access: Remotely accessible registry paths' is configured.

## Description

The registry is a database that contains computer configuration information, and much of the information is sensitive. An attacker could use this information to facilitate unauthorized activities. To reduce the risk of such an attack, suitable ACLs are assigned throughout the registry to help protect it from access by unauthorized users.

This policy setting determines which registry paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the winreg registry key.

**The recommended state for this setting is:** System\CurrentControlSet\Control\ProductOptions, System\CurrentControlSet\Control\Server Applications, Software\Microsoft\Windows NT\CurrentVersion

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_remotely_accessible_registry_paths_allowed_paths` | See below | List of registry paths that can be accessed remotely. Default is the recommended paths from CIS Benchmark. |

### Default Paths

The default paths are:
- `System\CurrentControlSet\Control\ProductOptions`
- `System\CurrentControlSet\Control\Server Applications`
- `Software\Microsoft\Windows NT\CurrentVersion`

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network access remotely accessible registry paths
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_remotely_accessible_registry_paths
```

Or using the development path:

```yaml
---
- name: Configure network access remotely accessible registry paths
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_remotely_accessible_registry_paths  # noqa role-name[path]
```

### Override to use custom paths

```yaml
---
- name: Configure network access remotely accessible registry paths with custom paths
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_network_access_remotely_accessible_registry_paths_allowed_paths:
      - "System\CurrentControlSet\Control\ProductOptions"
      - "System\CurrentControlSet\Control\Server Applications"
      - "Software\Microsoft\Windows NT\CurrentVersion"
      - "Custom\Path\Here"
  roles:
    - role: twanus.wazuh_fixer.win_network_access_remotely_accessible_registry_paths
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.7 (check 26044)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\SecurePipeServers\Winreg\AllowedExactPaths`
- **Value Name**: `Machine`
- **Value Type**: `REG_MULTI_SZ` (multistring)
- **Required Value**: List of registry paths (default: System\CurrentControlSet\Control\ProductOptions, System\CurrentControlSet\Control\Server Applications, Software\Microsoft\Windows NT\CurrentVersion)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\SecurePipeServers\Winreg\AllowedExactPaths" -Name "Machine" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Machine
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\SecurePipeServers\Winreg\AllowedExactPaths`
3. Check that `Machine` contains the recommended paths

## Idempotency

This role is idempotent. If the registry value is already set to the configured paths, no changes will be made. The role will update the value if it is different from the configured paths.

## Notes

- **Security benefit**: Configuring this setting determines which registry paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the winreg registry key. This helps protect sensitive registry information from unauthorized access.

- **Registry security**: The registry contains computer configuration information, and much of the information is sensitive. An attacker could use this information to facilitate unauthorized activities. To reduce the risk of such an attack, suitable ACLs are assigned throughout the registry to help protect it from access by unauthorized users.

- **Recommended paths**: The default paths are the recommended paths from the CIS Benchmark:
  - `System\CurrentControlSet\Control\ProductOptions`
  - `System\CurrentControlSet\Control\Server Applications`
  - `Software\Microsoft\Windows NT\CurrentVersion`

- **Path format**: Paths should be specified without the `HKEY_LOCAL_MACHINE\` prefix. Use backslashes (\) as path separators.

- **REG_MULTI_SZ format**: This setting uses a REG_MULTI_SZ (multistring) value type, which stores multiple strings in a single registry value.

- **If the registry value does not exist**, it will be created and set to the recommended paths to ensure compliance. According to the CIS check, the absence of this value is also considered compliant, but setting it explicitly with the recommended paths is preferred.
