# win_network_access_disable_cred_storage

This role remediates CIS Benchmark 2.3.10.4 (check 26041): Ensure 'Network access: Do not allow storage of passwords and credentials for network authentication' is set to 'Enabled'.

## Description

Passwords that are cached can be accessed by the user when logged on to the computer. Although this information may sound obvious, a problem can arise if the user unknowingly executes hostile code that reads the passwords and forwards them to another, unauthorized user.

This policy setting determines whether Credential Manager (formerly called Stored User Names and Passwords) saves passwords or credentials for later use when it gains domain authentication.

**The recommended state for this setting is: Enabled.**

**Note**: Changes to this setting will not take effect until Windows is restarted.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_disable_cred_storage_enabled_value` | `1` | Registry value for DisableDomainCreds. Set to 1 to disable storage of passwords and credentials for network authentication (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable network access credential storage
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_disable_cred_storage
```

Or using the development path:

```yaml
---
- name: Disable network access credential storage
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_disable_cred_storage  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.4 (check 26041)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
- **Value Name**: `DisableDomainCreds`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "DisableDomainCreds" -ErrorAction SilentlyContinue | Select-Object DisableDomainCreds
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
3. Check that `DisableDomainCreds` is set to 1

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting prevents Credential Manager from saving passwords or credentials for later use when it gains domain authentication. This helps prevent hostile code from reading cached passwords and forwarding them to unauthorized users.

- **Credential Manager**: Credential Manager (formerly called Stored User Names and Passwords) is a Windows feature that stores user credentials for network authentication. When this setting is enabled, Credential Manager will not save passwords or credentials for domain authentication.

- **Restart required**: Changes to this setting will not take effect until Windows is restarted. Users should be notified that a restart is required for the change to take effect.

- **User experience**: When this setting is enabled, users will need to enter their credentials each time they access network resources that require authentication. This may impact usability but provides better security.

- **Cached credentials risk**: Passwords that are cached can be accessed by the user when logged on to the computer. If a user unknowingly executes hostile code, that code could read the cached passwords and forward them to an unauthorized user.

- **Domain authentication**: This setting specifically affects domain authentication credentials. Local credentials are not affected by this setting.

- **If the registry value does not exist**, it will be created and set to 1 (Enabled) to ensure compliance.
