# win_firewall_public_state

This role remediates CIS Benchmark 9.3.1 (check 26130): Ensure 'Windows Firewall: Public: Firewall state' is set to 'On (recommended)'.

## Description

Windows Firewall with Advanced Security provides host-based, two-way network traffic filtering for a device and blocks unauthorized network traffic flowing into or out of the local device. The Public Profile applies to networks where the device is connected to a public network, such as those found in airports, coffee shops, and other public locations.

Selecting "On (recommended)" enables Windows Firewall with Advanced Security to use the settings for this profile to filter network traffic. If you select "Off", Windows Firewall with Advanced Security will not use any of the firewall rules or connection security rules for this profile.

**The recommended state for this setting is: On (recommended).**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_firewall_public_state_enable_firewall` | `1` | Registry value for EnableFirewall in Public Profile. 0 = Off, 1 = On (recommended) (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows Firewall Public Profile State
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_firewall_public_state
```

### Using Development Path

```yaml
---
- name: Test Windows Firewall Public Profile State Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_firewall_public_state  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile`
- **Registry Value**: `EnableFirewall` (DWORD)
- **Value 0**: Off - Windows Firewall will not use any firewall rules for this profile
- **Value 1**: On (recommended) - Windows Firewall uses the settings for this profile to filter network traffic (CIS requirement)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Public Profile`
3. Verify that "Firewall state" is set to "On (recommended)"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile" -Name "EnableFirewall" | Select-Object -ExpandProperty EnableFirewall
```

Expected output: `1`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 9.3.1 (check 26130)
- **CIS CSC v7**: 9.4
- **CIS CSC v8**: 4.5
- **CMMC v2.0**: AC.L1-3.1.20, CM.L2-3.4.7, SC.L1-3.13.1, SC.L2-3.13.6
- **ISO 27001:2013**: A.13.1.1
- **NIST SP 800-53**: SC-7(5)
- **PCI DSS v3.2.1**: 1.1.4, 1.4
- **PCI DSS v4.0**: 1.2.1
- **SOC 2**: CC6.6

## Rationale

If the firewall is turned off, all traffic will be able to access the system and an attacker may be more easily able to remotely exploit a weakness in a network service. The Public Profile firewall should be enabled to protect systems when connected to public networks, which are inherently less secure than private or domain networks.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "On (recommended)":

`Computer Configuration\Policies\Windows Settings\Security Settings\Windows Defender Firewall with Advanced Security\Windows Defender Firewall with Advanced Security\Windows Firewall Properties\Public Profile\Firewall state`

## Checks

The Wazuh check (26130) passes if any of the following conditions are met:

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile` does not exist, OR
- The registry value `EnableFirewall` does not exist, OR
- The registry value `EnableFirewall` equals `1`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Network Protection**: Enables firewall filtering for public network connections
- **Attack Surface Reduction**: Blocks unauthorized network traffic flowing into or out of the device
- **Compliance**: Meets requirements for multiple security frameworks and standards
- **Defense in Depth**: Provides host-based network security in addition to perimeter defenses
- **Public Network Security**: Critical protection when connected to untrusted public networks

## Notes

- This setting applies specifically to the Public Profile, which is used when the device is connected to a public network (e.g., airports, coffee shops, hotels)
- The firewall must be enabled for the profile to be effective
- If the registry key or value does not exist, the role will create them
- This role only configures the Public Profile; other profiles (Domain, Private) may need separate configuration
- Public networks are considered less secure, making firewall protection especially important for this profile

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
