# win_ms_network_client_sign_always

This role remediates CIS Benchmark 2.3.8.1 (check 26031): Ensure 'Microsoft network client: Digitally sign communications (always)' is set to 'Enabled'.

## Description

Session hijacking uses tools that allow attackers who have access to the same network as the client or server to interrupt, end, or steal a session in progress. Attackers can potentially intercept and modify unsigned SMB packets and then modify the traffic and forward it so that the server might perform undesirable actions. Alternatively, the attacker could pose as the server or client after legitimate authentication and gain unauthorized access to data.

SMB is the resource sharing protocol that is supported by many Windows operating systems. It is the basis of NetBIOS and many other protocols. SMB signatures authenticate both users and the servers that host the data. If either side fails the authentication process, data transmission will not take place.

This policy setting determines whether packet signing is required by the SMB client component. Note: When Windows Vista-based computers have this policy setting enabled and they connect to file or print shares on remote servers, it is important that the setting is synchronized with its companion setting, Microsoft network server: Digitally sign communications (always), on those servers.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_ms_network_client_sign_always_enabled_value` | `1` | Registry value for RequireSecuritySignature. Set to 1 to enable SMB client packet signing (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable Microsoft network client digital signing
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_client_sign_always
```

Or using the development path:

```yaml
---
- name: Enable Microsoft network client digital signing
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_ms_network_client_sign_always  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.8.1 (check 26031)
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanmanWorkstation\Parameters`
- **Value Name**: `RequireSecuritySignature`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanmanWorkstation\Parameters" -Name "RequireSecuritySignature" -ErrorAction SilentlyContinue | Select-Object RequireSecuritySignature
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanmanWorkstation\Parameters`
3. Check that `RequireSecuritySignature` is set to 1

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Requiring SMB packet signing helps prevent session hijacking attacks. It ensures that all SMB communications are digitally signed, which authenticates both users and servers. If either side fails the authentication process, data transmission will not take place.

- **Performance impact**: Enabling SMB packet signing may have a slight performance impact, but this is generally negligible on modern systems. The security benefits far outweigh any minor performance impact.

- **Companion setting**: This setting should be synchronized with the "Microsoft network server: Digitally sign communications (always)" setting on file and print servers. Both the client and server must support packet signing for it to work effectively.

- **Compatibility**: SMB packet signing is supported by Windows 2000 and later. Older systems that do not support SMB signing may not be able to connect if this setting is enabled.

- **Network connectivity**: If this setting is enabled and servers do not support packet signing, clients may not be able to connect to those servers. Ensure that all servers in the environment support SMB packet signing before enabling this setting.

- **If the registry value does not exist**, it will be created and set to 1 (Enabled) to ensure compliance.
