# win_firewall_domain_inbound_connections

This role remediates CIS Benchmark 9.1.2 (check 26117): Ensure 'Windows Firewall: Domain: Inbound connections' is set to 'Block (default)'.

## Description

Windows Firewall with Advanced Security provides host-based, two-way network traffic filtering for a device and blocks unauthorized network traffic flowing into or out of the local device. The Domain Profile applies to networks where the host can authenticate to a domain controller.

The DefaultInboundAction setting determines the behavior for inbound connections that do not match an inbound firewall rule. When set to "Block (default)", all inbound connections that do not match an allow rule are blocked. This provides a secure default configuration where only explicitly allowed traffic is permitted.

**The recommended state for this setting is: Block (default).**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_domain_inbound_connections_default_inbound_action` | `1` | Registry value for DefaultInboundAction in Domain Profile. 0 = Allow, 1 = Block (default) (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Domain Profile Inbound Connections
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_domain_inbound_connections
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Domain Profile Inbound Connections Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_domain_inbound_connections  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile`
- **Registry Value**: `DefaultInboundAction` (DWORD)
- **Value 0**: Allow - All inbound connections that do not match an allow rule are allowed
- **Value 1**: Block (default) - All inbound connections that do not match an allow rule are blocked (CIS requirement)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Domain Profile\Inbound connections`
3. Verify that "Inbound connections" is set to "Block (default)"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile" -Name "DefaultInboundAction" | Select-Object -ExpandProperty DefaultInboundAction
```

Expected output: `1`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.1.2 (check 26117)
- **CIS CSC v7**: 9.4, 11.2
- **CIS CSC v8**: 4.5
- **CMMC v2.0**: AC.L1-3.1.20, CM.L2-3.4.7, SC.L1-3.13.1, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.1
- **NIST SP 800-53**: SC-7(5)
- **PCI DSS v3.2.1**: 1.1.4, 1.4
- **PCI DSS v4.0**: 1.2.1
- **SOC 2**: CC6.6

## Rationale

If the firewall allows all traffic to access the system then an attacker may be more easily able to remotely exploit a weakness in a network service. By setting the default inbound action to "Block", only explicitly allowed traffic is permitted, significantly reducing the attack surface and preventing unauthorized access attempts.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "Block (default)":

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Domain Profile\Inbound connections`

## Checks

The Wazuh check (26117) passes if any of the following conditions are met:

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile` does not exist, OR
- The registry value `DefaultInboundAction` does not exist, OR
- The registry value `DefaultInboundAction` equals `1`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Network Protection**: Blocks all inbound connections by default unless explicitly allowed
- **Attack Surface Reduction**: Prevents unauthorized network traffic from accessing the system
- **Compliance**: Meets requirements for multiple security frameworks and standards
- **Defense in Depth**: Provides host-based network security in addition to perimeter defenses
- **Default Deny**: Implements a secure default deny policy for inbound traffic

## Notes

- This setting applies specifically to the Domain Profile, which is used when the device is connected to a network where it can authenticate to a domain controller
- The default action only applies to connections that do not match any inbound firewall rules
- Explicit allow rules will still permit traffic even when the default action is set to Block
- If the registry key or value does not exist, the role will create them
- This role only configures the Domain Profile; other profiles (Private, Public) may need separate configuration

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
