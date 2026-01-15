# win_domain_encrypt_secure_channel_when_possible

This role remediates CIS Benchmark 2.3.6.2 (check 26017): Ensure 'Domain member: Digitally encrypt secure channel data (when possible)' is set to 'Enabled'.

## Description

When a computer joins a domain, a computer account is created. After it joins the domain, the computer uses the password for that account to create a secure channel with the Domain Controller for its domain every time that it restarts. Requests that are sent on the secure channel are authenticated-and sensitive information such as passwords are encrypted-but the channel is not integrity-checked, and not all information is encrypted. Digital encryption and signing of the secure channel is a good idea where it is supported. The secure channel protects domain credentials as they are sent to the Domain Controller.

This policy setting determines whether a domain member should attempt to negotiate encryption for all secure channel traffic that it initiates.

**The recommended state for this setting is: Enabled.**

**Note**: This setting is related to but different from the "Domain member: Digitally encrypt or sign secure channel data (always)" setting (check 26016). This setting attempts encryption "when possible" rather than requiring it "always".

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- Domain-joined computer (this setting only applies to domain members)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_domain_encrypt_secure_channel_when_possible_enabled_value` | `1` | Registry value for SealSecureChannel (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable domain secure channel encryption when possible
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_domain_encrypt_secure_channel_when_possible
```

Or using the development path:

```yaml
---
- name: Enable domain secure channel encryption when possible
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_domain_encrypt_secure_channel_when_possible  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.6.2 (check 26017)
- **CIS CSC v7**: 14.4
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **ISO 27001:2013**: A.10.1.1, A.13.1.1
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Netlogon\Parameters`
- **Value Name**: `SealSecureChannel`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\Netlogon\Parameters" -Name "SealSecureChannel" -ErrorAction SilentlyContinue | Select-Object SealSecureChannel
```

Note: According to the CIS check, if the value doesn't exist, it's also considered compliant (as the default behavior may be acceptable), but this role explicitly sets it to `1` to ensure compliance.

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Netlogon\Parameters`
3. Check that `SealSecureChannel` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Domain requirement**: This setting only applies to domain-joined computers. It has no effect on standalone or workgroup computers.

- **Secure channel**: The secure channel is established between domain members and Domain Controllers to protect domain credentials and other sensitive information during transmission.

- **"When possible" vs "Always"**: This setting attempts to encrypt secure channel traffic when possible, but does not require it. For stricter enforcement, also configure "Domain member: Digitally encrypt or sign secure channel data (always)" (check 26016) using the `win_domain_encrypt_secure_channel` role.

- **Performance impact**: Enabling this setting may have a minimal performance impact due to the additional encryption overhead, but the security benefits generally outweigh this minor cost.

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure explicit compliance. Note that according to the CIS check, the absence of this value is also considered compliant, but setting it explicitly is recommended.
