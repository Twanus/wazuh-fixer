# win_network_security_minimum_session_security_ntlm_ssp_clients

This role remediates CIS Benchmark 2.3.11.9 (check 26058): Ensure 'Network security: Minimum session security for NTLM SSP based (including secure RPC) clients' is set to 'Require NTLMv2 session security, Require 128-bit encryption'.

## Description

This policy setting determines which behaviors are allowed by clients for applications using the NTLM Security Support Provider (SSP). The SSP Interface (SSPI) is used by applications that need authentication services. The setting does not modify how the authentication sequence works but instead require certain behaviors in applications that use the SSPI.

You can enable both options for this policy setting to help protect network traffic that uses the NTLM Security Support Provider (NTLM SSP) from being exposed or tampered with by an attacker who has gained access to the same network. In other words, these options help protect against man-in-the-middle attacks.

**The recommended state for this setting is: Require NTLMv2 session security, Require 128-bit encryption.**

**Note**: These values are dependent on the Network security: LAN Manager Authentication Level (Rule 2.3.11.7) security setting value.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_minimum_session_security_ntlm_ssp_clients_required_value` | `537395200` | Registry value for NTLMMinClientSec. Set to 537395200 to require NTLMv2 session security and 128-bit encryption (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network security minimum session security for NTLM SSP clients
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_minimum_session_security_ntlm_ssp_clients
```

Or using the development path:

```yaml
---
- name: Configure network security minimum session security for NTLM SSP clients
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_minimum_session_security_ntlm_ssp_clients  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.9 (check 26058)
- **CIS CSC v7**: 12.5
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\MSV1_0`
- **Value Name**: `NTLMMinClientSec`
- **Value Type**: `REG_DWORD`
- **Required Value**: `537395200` (Require NTLMv2 session security, Require 128-bit encryption)

The value `537395200` is a bitmask that combines:
- `0x20000000` (536870912) = Require NTLMv2 session security
- `0x00020000` (131072) = Require 128-bit encryption
- Plus additional flags that result in the total value of 537395200

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa\MSV1_0" -Name "NTLMMinClientSec" -ErrorAction SilentlyContinue | Select-Object NTLMMinClientSec
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\MSV1_0`
3. Check that `NTLMMinClientSec` is set to `537395200`

Or using Group Policy:

1. Open `gpedit.msc`
2. Navigate to: Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options
3. Check that "Network security: Minimum session security for NTLM SSP based (including secure RPC) clients" is set to "Require NTLMv2 session security, Require 128-bit encryption"

## Idempotency

This role is idempotent. If the registry value is already set to `537395200` (Require NTLMv2 session security, Require 128-bit encryption), no changes will be made. The role will create the value if it does not exist, or update it if it is different from `537395200`.

## Notes

- **Security benefit**: Requiring NTLMv2 session security and 128-bit encryption helps protect network traffic that uses the NTLM Security Support Provider from being exposed or tampered with by attackers who have gained access to the same network. This helps protect against man-in-the-middle attacks.

- **Man-in-the-middle protection**: By requiring NTLMv2 session security and 128-bit encryption, this setting ensures that network traffic using NTLM SSP is encrypted and authenticated, making it significantly more difficult for attackers to intercept or modify communications.

- **Dependency on LAN Manager Authentication Level**: This setting's effectiveness is dependent on the Network security: LAN Manager Authentication Level (Rule 2.3.11.7) security setting. Ensure that setting is also configured appropriately (recommended: Send NTLMv2 response only. Refuse LM & NTLM).

- **SSPI context**: This setting applies to applications that use the Security Support Provider Interface (SSPI) for authentication services. It does not modify how the authentication sequence works but requires certain behaviors in applications that use the SSPI.

- **If the registry value does not exist**, it will be created and set to `537395200` (Require NTLMv2 session security, Require 128-bit encryption) to ensure compliance.

- **Group Policy path**: This setting can also be configured via Group Policy at: Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\Network security: Minimum session security for NTLM SSP based (including secure RPC) clients
