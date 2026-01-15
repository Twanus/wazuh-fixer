# win_firewall_public_apply_local_connection_security_rules

This role remediates CIS Benchmark 9.3.5 (check 26134): Ensure 'Windows Firewall: Public: Settings: Apply local connection security rules' is set to 'No'.

## Description

This setting controls whether local administrators are allowed to create connection security rules that apply together with connection security rules configured by Group Policy. When in the Public profile, there should be no special local connection security exceptions per computer. These settings should be managed by a centralized policy.

**The recommended state for this setting is: No.**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_public_apply_local_connection_security_rules_allow_local_ipsec_policy_merge` | `0` | Registry value for AllowLocalIPsecPolicyMerge in Public Profile. 0 = No (CIS requirement), 1 = Yes (allow local connection security rules). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Public Profile Apply Local Connection Security Rules
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_public_apply_local_connection_security_rules
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Public Profile Apply Local Connection Security Rules Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_public_apply_local_connection_security_rules  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile`
- **Registry Value**: `AllowLocalIPsecPolicyMerge` (DWORD)
- **Value 0**: No - Do not apply local connection security rules (CIS requirement)
- **Value 1**: Yes - Allow local administrators to create local connection security rules that apply together with Group Policy rules

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Public Profile\Settings Customize\Apply local connection security rules`
3. Verify that "Apply local connection security rules" is set to "No"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile" -Name "AllowLocalIPsecPolicyMerge" | Select-Object -ExpandProperty AllowLocalIPsecPolicyMerge
```

Expected output: `0`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.3.5 (check 26134)
- **CIS CSC v7**: 9.4, 11.2
- **CIS CSC v8**: 4.5
- **CMMC v2.0**: AC.L1-3.1.20, CM.L2-3.4.7, SC.L1-3.13.1, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.1
- **NIST SP 800-53**: SC-7(5)
- **PCI DSS v3.2.1**: 1.1.4, 1.4
- **PCI DSS v4.0**: 1.2.1
- **SOC 2**: CC6.6

## Rationale

Users with administrative privileges might create firewall rules that expose the system to remote attack. When in the Public profile, there should be no special local connection security exceptions per computer. These settings should be managed by a centralized policy. Allowing local administrators to create local connection security rules can lead to inconsistent security configurations across the organization and may create security gaps that could be exploited.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "No":

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Public Profile\Settings Customize\Apply local connection security rules`

## Checks

The Wazuh check (26134) passes if all of the following conditions are met:

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile` exists, AND
- The registry value `AllowLocalIPsecPolicyMerge` exists, AND
- The registry value `AllowLocalIPsecPolicyMerge` equals `0`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Centralized Management**: Ensures connection security rules are managed through Group Policy rather than local exceptions
- **Consistency**: Prevents inconsistent security configurations across systems
- **Attack Surface Reduction**: Eliminates potential security gaps from unauthorized local connection security rule modifications
- **Compliance**: Meets requirements for multiple security frameworks and standards
- **Public Network Security**: Critical protection when connected to untrusted public networks where local rule exceptions could be exploited
- **IPsec Policy Control**: Prevents local administrators from creating connection security rules that could weaken IPsec policies

## Notes

- This setting applies specifically to the Public Profile, which is used when the device is connected to a public network (e.g., airports, coffee shops, hotels)
- Connection security rules (IPsec rules) are different from firewall rules - this setting specifically controls IPsec connection security policies
- If the registry key or value does not exist, the role will create them
- This role only configures the Public Profile; other profiles (Domain, Private) may need separate configuration
- Public networks are considered less secure, making centralized policy management especially important for this profile
- Connection security rules define how and when authentication occurs for network connections, making centralized control critical for security

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
