# win_network_security_local_system_computer_identity

This role remediates CIS Benchmark 2.3.11.1 (check 26050): Ensure 'Network security: Allow Local System to use computer identity for NTLM' is set to 'Enabled'.

## Description

When connecting to computers running versions of Windows earlier than Windows Vista or Windows Server 2008 (non-R2), services running as Local System and using SPNEGO (Negotiate) that revert to NTLM use the computer identity. In Windows 7, if you are connecting to a computer running Windows Server 2008 or Windows Vista, then a system service uses either the computer identity or a NULL session.

When connecting with a NULL session, a system-generated session key is created, which provides no protection but allows applications to sign and encrypt data without errors. When connecting with the computer identity, both signing and encryption is supported in order to provide data protection.

This policy setting determines whether Local System services that use Negotiate when reverting to NTLM authentication can use the computer identity.

**The recommended state for this setting is: Enabled.**

**Note**: This policy is supported on at least Windows 7 or Windows Server 2008 R2.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_local_system_computer_identity_enabled_value` | `1` | Registry value for UseMachineId. Set to 1 to enable Local System services to use computer identity for NTLM (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable network security to allow Local System to use computer identity for NTLM
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_local_system_computer_identity
```

Or using the development path:

```yaml
---
- name: Enable network security to allow Local System to use computer identity for NTLM
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_local_system_computer_identity  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.1 (check 26050)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
- **Value Name**: `UseMachineId`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "UseMachineId" -ErrorAction SilentlyContinue | Select-Object UseMachineId
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
3. Check that `UseMachineId` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Security benefit**: Enabling this setting ensures that Local System services use the computer identity when reverting to NTLM authentication, which provides proper signing and encryption support for data protection. When disabled (NULL session), only a system-generated session key is created, which provides no protection.

- **Windows version support**: This policy setting is supported on Windows 7 or Windows Server 2008 R2 and later.

- **NTLM authentication**: This setting applies when services using SPNEGO (Negotiate) authentication revert to NTLM, typically when connecting to older Windows systems (earlier than Windows Vista or Windows Server 2008 non-R2).

- **Companion settings**: This setting works in conjunction with other network security settings that control authentication and encryption behavior.

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure compliance.
