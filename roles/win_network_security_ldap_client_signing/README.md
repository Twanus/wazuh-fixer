# win_network_security_ldap_client_signing

This role ensures that 'Network security: LDAP client signing requirements' is set to 'Negotiate signing' (1) or higher, as required by CIS Benchmark 2.3.11.8 (Wazuh check 26057).

## Description

This policy setting determines the level of data signing that is requested on behalf of clients that issue LDAP BIND requests. Unsigned network traffic is susceptible to man-in-the-middle attacks in which an intruder captures the packets between the client and server, modifies them, and then forwards them to the server. For an LDAP server, this susceptibility means that an attacker could cause a server to make decisions that are based on false or altered data from the LDAP queries.

**Note**: This policy setting does not have any impact on LDAP simple bind (`ldap_simple_bind`) or LDAP simple bind through SSL (`ldap_simple_bind_s`). No Microsoft LDAP clients that are included with Windows XP Professional use `ldap_simple_bind` or `ldap_simple_bind_s` to communicate with a Domain Controller.

## Requirements

- Ansible 2.9 or higher
- `ansible.windows` collection (>=3.3.0)
- Windows target with WinRM configured
- Administrator privileges on the target Windows system

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_ldap_client_signing_value` | `1` | The LDAP client signing requirement level. Valid values: `0` (None - not compliant), `1` (Negotiate signing - minimum compliant), `2` (Require signing - more secure) |

## Dependencies

None.

## Example Playbook

Using the collection format:

```yaml
---
- name: Configure LDAP client signing requirements
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_ldap_client_signing
```

Or using the development path:

```yaml
---
- name: Configure LDAP client signing requirements
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_ldap_client_signing  # noqa role-name[path]
```

To require signing (more secure):

```yaml
---
- name: Configure LDAP client signing requirements (require signing)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_ldap_client_signing
  vars:
    win_network_security_ldap_client_signing_value: 2
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.8 (check 26057)
- **CIS CSC v7**: 12.5
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LDAP`
- **Value Name**: `LDAPClientIntegrity`
- **Value Type**: `REG_DWORD`
- **Required Value**: >= 1 (1 = Negotiate signing, 2 = Require signing)

### Value Meanings

- **0** (None): No signing required - **NOT COMPLIANT**
- **1** (Negotiate signing): Client will negotiate signing if server supports it - **COMPLIANT (minimum)**
- **2** (Require signing): Client requires signing - **COMPLIANT (more secure)**

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LDAP" -Name "LDAPClientIntegrity" -ErrorAction SilentlyContinue | Select-Object LDAPClientIntegrity
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LDAP`
3. Check that `LDAPClientIntegrity` is set to 1 or 2

## Idempotency

This role is idempotent. If the registry value is already set to 1 or higher, no changes will be made. The role will update the value if it is less than the configured value (default: 1).

## Notes

- **Security benefit**: Requiring LDAP client signing helps prevent man-in-the-middle attacks by ensuring that LDAP traffic is digitally signed. This authenticates both clients and servers, preventing attackers from intercepting and modifying LDAP queries and responses.

- **Remediation via Group Policy**: To establish the recommended configuration via GP, set the following UI path to "Negotiate signing" (configuring to "Require signing" also conforms to the benchmark): `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\Network security: LDAP client signing requirements`.

- **Physical security**: To lower the risk of man-in-the-middle attacks in your network, you can implement strong physical security measures to protect the network infrastructure. Also, you can make all types of man-in-the-middle attacks extremely difficult if you require digital signatures on all network packets by means of IPsec authentication headers.

- **Setting to 2 (Require signing)**: While setting the value to 1 (Negotiate signing) meets the CIS Benchmark requirement, setting it to 2 (Require signing) provides stronger security. However, ensure that your LDAP servers support signing before requiring it, as this may cause connectivity issues if servers don't support it.
