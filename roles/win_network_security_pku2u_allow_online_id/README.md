# win_network_security_pku2u_allow_online_id

This role remediates CIS Benchmark 2.3.11.3 (check 26052): Ensure 'Network Security: Allow PKU2U authentication requests to this computer to use online identities' is set to 'Disabled'.

## Description

This setting determines if online identities are able to authenticate to this computer. The Public Key Cryptography Based User-to-User (PKU2U) protocol introduced in Windows 7 and Windows Server 2008 R2 is implemented as a security support provider (SSP). The SSP enables peer-to-peer authentication, particularly through the Windows 7 media and file sharing feature called HomeGroup, which permits sharing between computers that are not members of a domain.

With PKU2U, a new extension was introduced to the Negotiate authentication package, Spnego.dll. In previous versions of Windows, Negotiate decided whether to use Kerberos or NTLM for authentication. The extension SSP for Negotiate, Negoexts.dll, which is treated as an authentication protocol by Windows, supports Microsoft SSPs including PKU2U. When computers are configured to accept authentication requests by using online IDs, Negoexts.dll calls the PKU2U SSP on the computer that is used to log on. The PKU2U SSP obtains a local certificate and exchanges the policy between the peer computers. When validated on the peer computer, the certificate within the metadata is sent to the logon peer for validation and associates the user's certificate to a security token and the logon process completes.

The PKU2U protocol is a peer-to-peer authentication protocol - authentication should be managed centrally in most managed networks. Enabling this setting allows peer-to-peer authentication, which can create security vulnerabilities in managed environments where centralized authentication is preferred.

**The recommended state for this setting is: Disabled.**

**Note**: If a hybrid environment is used, and PKU2U is Disabled, Remote Desktop connections from a hybrid joined system to a hybrid joined system will fail.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_pku2u_allow_online_id_disabled_value` | `0` | Registry value for AllowOnlineID. Set to 0 to disable PKU2U authentication using online identities (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable network security PKU2U authentication using online identities
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_pku2u_allow_online_id
```

Or using the development path:

```yaml
---
- name: Disable network security PKU2U authentication using online identities
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_pku2u_allow_online_id  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.3 (check 26052)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 4.1
- **CMMC v2.0**: AC.L1-3.1.1, AC.L1-3.1.2, CM.L2-3.4.1, CM.L2-3.4.2, CM.L2-3.4.6, CM.L2-3.4.7
- **ISO 27001:2013**: A.13.1.3
- **NIST SP 800-53**: CM-7(1), CM-9, SA-10
- **PCI DSS v3.2.1**: 11.5, 2.2
- **PCI DSS v4.0**: 1.1.1, 1.2.1, 1.2.6, 1.2.7, 1.5.1, 2.1.1, 2.2.1
- **SOC 2**: CC7.1, CC8.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\pku2u`
- **Value Name**: `AllowOnlineID`
- **Value Type**: `REG_DWORD`
- **Required Value**: `0` (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa\pku2u" -Name "AllowOnlineID" -ErrorAction SilentlyContinue | Select-Object AllowOnlineID
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\pku2u`
3. Check that `AllowOnlineID` is set to `0`

## Idempotency

This role is idempotent. If the registry value is already set to `0` (Disabled), no changes will be made. The role also handles cases where the registry key or value does not exist (which are considered compliant per the CIS check condition "any"), but sets the value explicitly to `0` for clarity and auditability.

## Notes

- **Security benefit**: Disabling this setting ensures that PKU2U authentication using online identities is not allowed, preventing peer-to-peer authentication in managed networks where centralized authentication is preferred. This improves security posture by ensuring authentication is managed centrally.

- **PKU2U protocol**: PKU2U is a peer-to-peer authentication protocol that was introduced to support features like HomeGroup. In managed networks, centralized authentication through domain controllers is preferred over peer-to-peer authentication.

- **Compliance condition**: According to the CIS check, the setting is compliant if any of the following conditions are met (Condition: any):
  - The registry key `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\pku2u` does not exist
  - The value `AllowOnlineID` does not exist
  - The value `AllowOnlineID` is set to `0` (Disabled)

  This role sets the value explicitly to `0` to ensure compliance, even if the absence of the value would also be compliant.

- **Hybrid environment note**: If a hybrid environment is used, and PKU2U is Disabled, Remote Desktop connections from a hybrid joined system to a hybrid joined system will fail. This should be considered when deploying this setting in hybrid environments.

- **Group Policy path**: This setting can also be configured via Group Policy at: Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\Network Security: Allow PKU2U authentication requests to this computer to use online identities
