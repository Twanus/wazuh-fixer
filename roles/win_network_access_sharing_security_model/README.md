# win_network_access_sharing_security_model

This role remediates CIS Benchmark 2.3.10.12 (check 26049): Ensure 'Network access: Sharing and security model for local accounts' is set to 'Classic - local users authenticate as themselves'.

## Description

With the Guest only model, any user who can authenticate to your computer over the network does so with guest privileges, which probably means that they will not have write access to shared resources on that computer. Although this restriction does increase security, it makes it more difficult for authorized users to access shared resources on those computers because ACLs on those resources must include access control entries (ACEs) for the Guest account. With the Classic model, local accounts should be password protected. Otherwise, if Guest access is enabled, anyone can use those user accounts to access shared system resources.

This policy setting determines how network logons that use local accounts are authenticated. The Classic option allows precise control over access to resources, including the ability to assign different types of access to different users for the same resource. The Guest only option allows you to treat all users equally. In this context, all users authenticate as Guest only to receive the same access level to a given resource.

**The recommended state for this setting is: Classic - local users authenticate as themselves.**

**Note**: This setting does not affect interactive logons that are performed remotely by using such services as Telnet or Remote Desktop Services (formerly called Terminal Services).

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_sharing_security_model_classic_value` | `0` | Registry value for ForceGuest. Set to 0 to use Classic model - local users authenticate as themselves (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network access sharing and security model for local accounts
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_sharing_security_model
```

Or using the development path:

```yaml
---
- name: Configure network access sharing and security model for local accounts
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_sharing_security_model  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.12 (check 26049)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
- **Value Name**: `ForceGuest`
- **Value Type**: `REG_DWORD`
- **Required Value**: 0 (Classic - local users authenticate as themselves)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa" -Name "ForceGuest" -ErrorAction SilentlyContinue | Select-Object ForceGuest
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
3. Check that `ForceGuest` is set to 0 (Classic - local users authenticate as themselves)

## Idempotency

This role is idempotent. If the registry value is already set to 0 (Classic), no changes will be made. The role will update the value if it is different from 0.

## Notes

- **Security benefit**: Using the Classic model allows precise control over access to resources, including the ability to assign different types of access to different users for the same resource. This provides better security control compared to the Guest only model.

- **Access control**: With the Classic model, local users authenticate as themselves, allowing for fine-grained access control through ACLs (Access Control Lists). This is more secure and flexible than the Guest only model, where all network users authenticate as Guest with the same access level.

- **Password protection**: When using the Classic model, local accounts should be password protected. If Guest access is enabled and accounts are not password protected, anyone could use those user accounts to access shared system resources.

- **Guest only model limitations**: The Guest only model restricts all network users to guest privileges, which typically means no write access to shared resources. While this increases security, it makes it more difficult for authorized users to access shared resources because ACLs must include ACEs for the Guest account.

- **Interactive logons**: This setting does not affect interactive logons that are performed remotely by using such services as Telnet or Remote Desktop Services.

- **If the registry value does not exist**, it will be created and set to 0 (Classic) to ensure compliance.
