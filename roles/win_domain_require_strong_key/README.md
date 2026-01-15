# win_domain_require_strong_key

This role remediates CIS Benchmark 2.3.6.6 (check 26021): Ensure 'Domain member: Require strong (Windows 2000 or later) session key' is set to 'Enabled'.

## Description

Session keys that are used to establish secure channel communications between Domain Controllers and member computers are much stronger in Windows 2000 than they were in previous Microsoft operating systems. Whenever possible, you should take advantage of these stronger session keys to help protect secure channel communications from attacks that attempt to hijack network sessions and eavesdropping. (Eavesdropping is a form of hacking in which network data is read or altered in transit. The data can be modified to hide or change the sender, or be redirected.)

When this policy setting is enabled, a secure channel can only be established with Domain Controllers that are capable of encrypting secure channel data with a strong (128-bit) session key. To enable this policy setting, all Domain Controllers in the domain must be able to encrypt secure channel data with a strong key, which means all Domain Controllers must be running Microsoft Windows 2000 or newer.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- Domain-joined computer (this setting only applies to domain members)
- All Domain Controllers in the domain must be running Windows 2000 or newer

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_domain_require_strong_key_enabled_value` | `1` | Registry value for RequireStrongKey (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Require strong session key for domain members
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_domain_require_strong_key
```

Or using the development path:

```yaml
---
- name: Require strong session key for domain members
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_domain_require_strong_key  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.6.6 (check 26021)
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Netlogon\Parameters`
- **Value Name**: `RequireStrongKey`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\Netlogon\Parameters" -Name "RequireStrongKey" -ErrorAction SilentlyContinue | Select-Object RequireStrongKey
```

Note: According to the CIS check, if the value doesn't exist, it's also considered compliant (as the default behavior may be acceptable), but this role explicitly sets it to `1` to ensure compliance.

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Netlogon\Parameters`
3. Check that `RequireStrongKey` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Domain requirement**: This setting only applies to domain-joined computers. It has no effect on standalone or workgroup computers.

- **Domain Controller requirement**: To enable this policy setting, **all Domain Controllers in the domain must be running Windows 2000 or newer**. If any Domain Controllers are running older operating systems, enabling this setting may prevent domain members from establishing secure channels with those Domain Controllers.

- **Strong session keys**: When enabled, secure channels can only be established with Domain Controllers that support strong (128-bit) session key encryption, providing enhanced protection against session hijacking and eavesdropping attacks.

- **Eavesdropping protection**: Strong session keys help protect secure channel communications from attacks that attempt to hijack network sessions and eavesdropping (a form of hacking in which network data is read or altered in transit).

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure explicit compliance. Note that according to the CIS check, the absence of this value is also considered compliant, but setting it explicitly is recommended.
