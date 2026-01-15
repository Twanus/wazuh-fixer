# win_ms_network_client_plaintext_password

This role remediates CIS Benchmark 2.3.8.3 (check 26033): Ensure 'Microsoft network client: Send unencrypted password to third-party SMB servers' is set to 'Disabled'.

## Description

If you enable this policy setting, the server can transmit passwords in plaintext across the network to other computers that offer SMB services, which is a significant security risk. These other computers may not use any of the SMB security mechanisms that are included with Windows Server 2003.

This policy setting determines whether the SMB redirector will send plaintext passwords during authentication to third-party SMB servers that do not support password encryption. It is recommended that you disable this policy setting unless there is a strong business case to enable it. If this policy setting is enabled, unencrypted passwords will be allowed across the network.

**The recommended state for this setting is: Disabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_ms_network_client_plaintext_password_disabled_value` | `0` | Registry value for EnablePlainTextPassword. Set to 0 to disable sending plaintext passwords (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable Microsoft network client plaintext password
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_client_plaintext_password
```

Or using the development path:

```yaml
---
- name: Disable Microsoft network client plaintext password
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_ms_network_client_plaintext_password  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.8.3 (check 26033)
- **CIS CSC v7**: 16.4
- **CIS CSC v8**: 3.10
- **CMMC v2.0**: AC.L2-3.1.13, AC.L2-3.1.17, IA.L2-3.5.10, SC.L2-3.13.11, SC.L2-3.13.15, SC.L2-3.13.8
- **HIPAA**: 164.312(a)(2)(iv), 164.312(e)(1), 164.312(e)(2)(i), 164.312(e)(2)(ii)
- **ISO 27001:2013**: A.10.1.1
- **NIST SP 800-53**: AC-17(2), SC-8, SC-8(1)
- **PCI DSS v3.2.1**: 2.1.1, 4.1, 4.1.1, 8.2.1
- **PCI DSS v4.0**: 2.2.7, 4.1.1, 4.2.1, 4.2.1.2, 4.2.2, 8.3.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanmanWorkstation\Parameters`
- **Value Name**: `EnablePlainTextPassword`
- **Value Type**: `REG_DWORD`
- **Required Value**: 0 (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanmanWorkstation\Parameters" -Name "EnablePlainTextPassword" -ErrorAction SilentlyContinue | Select-Object EnablePlainTextPassword
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanmanWorkstation\Parameters`
3. Check that `EnablePlainTextPassword` is set to 0 (or does not exist, which is also compliant)

## Idempotency

This role is idempotent. If the registry value is already set to 0 (Disabled) or does not exist, no changes will be made. The role will update the value if it is different from 0.

## Notes

- **Security benefit**: Disabling this setting prevents the SMB client from sending plaintext passwords to third-party SMB servers that do not support password encryption. This is a significant security risk because passwords transmitted in plaintext can be intercepted and read by attackers.

- **Security risk**: If this setting is enabled, passwords can be transmitted in plaintext across the network to computers that offer SMB services but do not support password encryption. These computers may not use any of the SMB security mechanisms included with Windows.

- **Third-party SMB servers**: This setting specifically affects connections to third-party SMB servers that do not support password encryption. Windows SMB servers support encryption, so this setting does not affect connections to Windows servers.

- **Compatibility**: If you have legacy third-party SMB servers that do not support password encryption, you may need to enable this setting for compatibility. However, this is a significant security risk and should only be done if absolutely necessary and after careful consideration.

- **Best practice**: The recommended state is Disabled. Only enable this setting if you have a strong business case and understand the security implications.

- **If the registry value does not exist**, it is considered compliant (the check condition allows for the value not existing). However, this role will create the value and set it to 0 (Disabled) to ensure explicit compliance.
