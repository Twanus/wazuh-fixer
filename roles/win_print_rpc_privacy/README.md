# win_print_rpc_privacy

This role remediates CIS Benchmark 18.4.2 (check 26171): Ensure 'Configure RPC packet level privacy setting for incoming connections' is set to 'Enabled'.

## Description

A security bypass vulnerability (CVE-2021-1678 | Windows Print Spooler Spoofing Vulnerability) exists in the way the Printer RPC binding handles authentication for the remote Winspool interface. Enabling the RPC packet level privacy setting for incoming connections enforces the server-side to increase the authentication level to minimize this vulnerability.

This policy setting controls packet level privacy for Remote Procedure Call (RPC) incoming connections. When enabled, it requires RPC clients to use packet-level privacy (encryption) for incoming RPC connections, which helps protect against man-in-the-middle attacks and ensures that RPC communications are encrypted.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- Administrative privileges

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_print_rpc_privacy_enabled_value` | `1` | Registry value for RpcAuthnLevelPrivacyEnabled (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure RPC packet level privacy for Print Spooler
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_print_rpc_privacy
```

Or using the development path:

```yaml
---
- name: Configure RPC packet level privacy for Print Spooler
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_print_rpc_privacy  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 18.4.2 (check 26171)
- **CVE**: CVE-2021-1678 (Windows Print Spooler Spoofing Vulnerability)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Print`
- **Value Name**: `RpcAuthnLevelPrivacyEnabled`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Print" -Name "RpcAuthnLevelPrivacyEnabled" -ErrorAction SilentlyContinue | Select-Object RpcAuthnLevelPrivacyEnabled
```

Expected output: `1`

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Print`
3. Check that `RpcAuthnLevelPrivacyEnabled` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **Group Policy**: This setting can also be configured via Group Policy at: `Computer Configuration\Policies\Administrative Templates\MS Security Guide\Configure RPC packet level privacy setting for incoming connections`
  - Note: This Group Policy path does not exist by default. An additional Group Policy template (SecGuide.admx/adml) is required - it is available from Microsoft.

- **Security Impact**: Enabling this setting helps mitigate CVE-2021-1678 (Windows Print Spooler Spoofing Vulnerability) by requiring RPC clients to use packet-level privacy (encryption) for incoming RPC connections to the Print Spooler service.

- **Compatibility**: This setting applies to all Windows versions that support the Print Spooler service.

- **Check Condition**: According to the Wazuh check, the setting is considered compliant if:
  - The registry key doesn't exist, OR
  - The value doesn't exist, OR
  - The value equals 1
  
  However, this role explicitly sets the value to `1` to ensure compliance and mitigate the security vulnerability.

## Security Benefits

- **Mitigates CVE-2021-1678**: Helps protect against Windows Print Spooler Spoofing Vulnerability
- **Encrypted RPC Communications**: Ensures RPC communications to the Print Spooler are encrypted
- **Authentication Level**: Increases the authentication level required for RPC connections
- **Man-in-the-Middle Protection**: Helps protect against man-in-the-middle attacks on RPC connections
