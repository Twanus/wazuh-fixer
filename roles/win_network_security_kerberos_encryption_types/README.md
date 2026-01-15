# win_network_security_kerberos_encryption_types

This role remediates CIS Benchmark 2.3.11.4 (check 26053): Ensure 'Network security: Configure encryption types allowed for Kerberos' is set to 'AES128_HMAC_SHA1, AES256_HMAC_SHA1, Future encryption types'.

## Description

This policy setting allows you to set the encryption types that Kerberos is allowed to use. The strength of each encryption algorithm varies from one to the next, choosing stronger algorithms will reduce the risk of compromise however doing so may cause issues when the computer attempts to authenticate with systems that do not support them.

**The recommended state for this setting is: AES128_HMAC_SHA1, AES256_HMAC_SHA1, Future encryption types.**

Note: Some legacy applications and OSes may still require RC4_HMAC_MD5 - we recommend you test in your environment and verify whether you can safely remove it.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_kerberos_encryption_types_value` | `2147483644` | Registry DWORD value for SupportedEncryptionTypes (2147483644 or 2147483640 = AES128_HMAC_SHA1, AES256_HMAC_SHA1, Future encryption types) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Kerberos encryption types
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_kerberos_encryption_types
```

Or using the development path:

```yaml
---
- name: Configure Kerberos encryption types
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_kerberos_encryption_types  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.4 (check 26053)
- **CIS CSC v7**: 14.4, 18.5
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.17, AC.L2-3.1.13, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.8, SC.L2-3.13.15
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **ISO 27001:2013**: A.13.1.1, A.10.1.1
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System\Kerberos\Parameters`
- **Value Name**: `SupportedEncryptionTypes`
- **Value Type**: `REG_DWORD`
- **Required Value**: `2147483644` or `2147483640` (AES128_HMAC_SHA1, AES256_HMAC_SHA1, Future encryption types)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System\Kerberos\Parameters" -Name "SupportedEncryptionTypes" -ErrorAction SilentlyContinue | Select-Object SupportedEncryptionTypes
```

The value should be `2147483644` or `2147483640`.

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System\Kerberos\Parameters`
3. Check that `SupportedEncryptionTypes` is set to `2147483644` or `2147483640`

## Idempotency

This role is idempotent. If the registry value is already set to the configured value (2147483644 or 2147483640), no changes will be made.

## Notes

- **Encryption algorithm strength**: The strength of each encryption algorithm varies from one to the next, choosing stronger algorithms will reduce the risk of compromise however doing so may cause issues when the computer attempts to authenticate with systems that do not support them.

- **Legacy compatibility**: Some legacy applications and OSes may still require RC4_HMAC_MD5 - we recommend you test in your environment and verify whether you can safely remove it.

- **Future encryption types**: Enabling "Future encryption types" ensures that the system can use new encryption algorithms as they become available, providing forward compatibility.

- **AES encryption**: AES128_HMAC_SHA1 and AES256_HMAC_SHA1 are modern, strong encryption algorithms that provide good security for Kerberos authentication.

- **Default value**: The role uses `2147483644` as the default value, but both `2147483644` and `2147483640` are acceptable values per the CIS Benchmark check.

- **If the registry value does not exist**, it will be created and set to the configured value to ensure explicit compliance.
