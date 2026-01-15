# win_network_security_lan_manager_auth_level

This role remediates CIS Benchmark 2.3.11.7 (check 26056): Ensure 'Network security: LAN Manager authentication level' is set to 'Send NTLMv2 response only. Refuse LM & NTLM'.

## Description

LAN Manager (LM) was a family of early Microsoft client/server software (predating Windows NT) that allowed users to link personal computers together on a single network. LM network capabilities included transparent file and print sharing, user security features, and network administration tools. In Active Directory domains, the Kerberos protocol is the default authentication protocol. However, if the Kerberos protocol is not negotiated for some reason, Active Directory will use LM, NTLM, or NTLMv2.

LAN Manager authentication includes the LM, NTLM, and NTLM version 2 (NTLMv2) variants, and is the protocol that is used to authenticate all Windows clients when they perform the following operations:
- Join a domain
- Authenticate between Active Directory forests
- Authenticate to down-level domains
- Authenticate to computers that do not run Windows 2000, Windows Server 2003, or Windows XP
- Authenticate to computers that are not in the domain

The Network security: LAN Manager authentication level setting determines which challenge/response authentication protocol is used for network logons. This choice affects the level of authentication protocol used by clients, the level of session security negotiated, and the level of authentication accepted by servers.

Windows 2000 and Windows XP clients were configured by default to send LM and NTLM authentication responses (Windows 95-based and Windows 98-based clients only send LM). The default settings in OSes predating Windows Vista / Windows Server 2008 (non-R2) allowed all clients to authenticate with servers and use their resources. However, this meant that LM responses - the weakest form of authentication response - were sent over the network, and it was potentially possible for attackers to sniff that traffic to more easily reproduce the user's password.

The Windows 95, Windows 98, and Windows NT operating systems cannot use the Kerberos version 5 protocol for authentication. For this reason, in a Windows Server 2003 domain, these computers authenticate by default with both the LM and NTLM protocols for network authentication. You can enforce a more secure authentication protocol for Windows 95, Windows 98, and Windows NT by using NTLMv2. For the logon process, NTLMv2 uses a secure channel to protect the authentication process.

Even if you use NTLMv2 for older clients and servers, Windows-based clients and servers that are members of the domain will use the Kerberos authentication protocol to authenticate with Windows Server 2003 or newer Domain Controllers. For these reasons, it is strongly preferred to restrict the use of LM & NTLM (non-v2) as much as possible.

**The recommended state for this setting is: Send NTLMv2 response only. Refuse LM & NTLM (value 5).**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_lan_manager_auth_level_compatibility_level` | `5` | Registry value for LmCompatibilityLevel. Set to 5 to enforce "Send NTLMv2 response only. Refuse LM & NTLM". Valid values: 0-5 (see Registry Details section). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network security - LAN Manager authentication level
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_lan_manager_auth_level
```

Or using the development path:

```yaml
---
- name: Configure network security - LAN Manager authentication level
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_lan_manager_auth_level  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.7 (check 26056)
- **CIS CSC v7**: 9.2
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **ISO 27001:2013**: A.13.1.3
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
- **Value Name**: `LmCompatibilityLevel`
- **Value Type**: `REG_DWORD`
- **Required Value**: 5 (Send NTLMv2 response only. Refuse LM & NTLM)

### LmCompatibilityLevel Values

- **0**: Send LM & NTLM responses
- **1**: Send LM & NTLM - use NTLMv2 session security if negotiated
- **2**: Send NTLM response only
- **3**: Send NTLMv2 response only
- **4**: Send NTLMv2 response only. Refuse LM
- **5**: Send NTLMv2 response only. Refuse LM & NTLM (Recommended)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa" -Name "LmCompatibilityLevel" -ErrorAction SilentlyContinue | Select-Object LmCompatibilityLevel
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
3. Check that `LmCompatibilityLevel` is set to 5

Or using Group Policy:

1. Open `gpedit.msc`
2. Navigate to: Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options
3. Check that "Network security: LAN Manager authentication level" is set to "Send NTLMv2 response only. Refuse LM & NTLM"

## Idempotency

This role is idempotent. If the registry value is already set to 5 (Send NTLMv2 response only. Refuse LM & NTLM), no changes will be made. The role will create the value if it does not exist, or update it if it is different from 5.

## Notes

- **Security benefit**: Setting LmCompatibilityLevel to 5 ensures that only NTLMv2 authentication responses are sent, and both LM and NTLM (non-v2) protocols are refused. This prevents the use of weak authentication protocols that are vulnerable to attack.

- **Password protection**: By refusing LM and NTLM authentication, this setting prevents attackers from using captured LM/NTLM responses to more easily crack passwords through offline attacks.

- **Compatibility considerations**: Setting this value to 5 (most secure) may cause compatibility issues with very old systems (Windows 95, Windows 98, Windows NT) that cannot use NTLMv2. However, these systems are no longer supported and should be upgraded or replaced. Most modern systems support NTLMv2.

- **Kerberos preferred**: Even with this setting, Windows clients and servers in Active Directory domains will prefer to use the Kerberos authentication protocol when available. This setting only applies when Kerberos cannot be used.

- **If the registry value does not exist**, it will be created and set to 5 (Send NTLMv2 response only. Refuse LM & NTLM) to ensure compliance.
