# win_network_security_no_lm_hash

This role remediates CIS Benchmark 2.3.11.5 (check 26054): Ensure 'Network security: Do not store LAN Manager hash value on next password change' is set to 'Enabled'.

## Description

The SAM file can be targeted by attackers who seek access to username and password hashes. Such attacks use special tools to crack passwords, which can then be used to impersonate users and gain access to resources on your network. These types of attacks will not be prevented if you enable this policy setting, but it will be much more difficult for these types of attacks to succeed.

This policy setting determines whether the LAN Manager (LM) hash value for the new password is stored when the password is changed. The LM hash is relatively weak and prone to attack compared to the cryptographically stronger Microsoft Windows NT hash. Since LM hashes are stored on the local computer in the security database, passwords can then be easily compromised if the database is attacked.

**The recommended state for this setting is: Enabled.**

**Note**: Older operating systems and some third-party applications may fail when this policy setting is enabled. Also, note that the password will need to be changed on all accounts after you enable this setting to gain the proper benefit.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_no_lm_hash_enabled_value` | `1` | Registry value for NoLMHash. Set to 1 to enable the policy (LM hash will not be stored on next password change). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable network security - do not store LM hash
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_no_lm_hash
```

Or using the development path:

```yaml
---
- name: Enable network security - do not store LM hash
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_no_lm_hash  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.5 (check 26054)
- **CIS CSC v7**: 16.4
- **CIS CSC v8**: 3.11
- **CMMC v2.0**: AC.L2-3.1.19, IA.L2-3.5.10, MP.L2-3.8.1, SC.L2-3.13.11, SC.L2-3.13.16
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(2)(ii)
- **ISO 27001:2013**: A.10.1.1
- **NIST SP 800-53**: SC-28, SC-28(1)
- **PCI DSS v3.2.1**: 3.4, 3.4.1, 8.2.1
- **PCI DSS v4.0**: 3.1.1, 3.3.2, 3.3.3, 3.5.1, 3.5.1.2, 3.5.1.3, 8.3.2
- **SOC 2**: CC6.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
- **Value Name**: `NoLMHash`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "NoLMHash" -ErrorAction SilentlyContinue | Select-Object NoLMHash
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
3. Check that `NoLMHash` is set to 1

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will create the value if it does not exist, or update it if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting prevents the storage of LM hashes when passwords are changed. LM hashes are cryptographically weak compared to NT hashes, and preventing their storage makes it more difficult for attackers to crack passwords if they gain access to the security database.

- **Password cracking protection**: By not storing LM hashes, this setting makes password cracking attacks significantly more difficult. Attackers would need to crack the stronger NT hashes instead of the weaker LM hashes.

- **Password change requirement**: Note that the password will need to be changed on all accounts after you enable this setting to gain the proper benefit. Existing passwords may still have LM hashes stored until they are changed.

- **Compatibility considerations**: Older operating systems and some third-party applications may fail when this policy setting is enabled. Test this setting in your environment before deploying it broadly.

- **If the registry value does not exist**, it will be created and set to 1 (Enabled) to ensure compliance.
