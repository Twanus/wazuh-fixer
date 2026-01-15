# win_enable_certificate_padding

This role remediates CIS Benchmark 18.4.5 (check 26174): Ensure 'Enable Certificate Padding' is set to 'Enabled'.

## Description

A remote code execution vulnerability exists in the way that the WinVerifyTrust function handles Windows Authenticode signature verification for portable executable (PE) files. This vulnerability is documented in CVE-2013-3900 - Security Update Guide - Microsoft - WinVerifyTrust Signature Validation Vulnerability.

This policy setting configures whether the WinVerifyTrust function performs strict Windows Authenticode signature verification for Portable Executable files (PE files). When enabled, PE files will be considered "unsigned" if Windows identifies content in them that does not conform to the Authenticode specification. This helps protect against malicious code that exploits vulnerabilities in signature verification.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_enable_certificate_padding_enabled_value` | `1` | Registry value for EnableCertPaddingCheck (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable Certificate Padding
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_enable_certificate_padding
```

Or using the development path:

```yaml
---
- name: Enable Certificate Padding
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_enable_certificate_padding  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 18.4.5 (check 26174)
- **CVE**: CVE-2013-3900

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography\Wintrust\Config`
- **Value Name**: `EnableCertPaddingCheck`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Group Policy

This setting can also be configured via Group Policy:
- **UI Path**: `Computer Configuration\Policies\Administrative Templates\MS Security Guide\Enable Certificate Padding`
- **Note**: This Group Policy path does not exist by default. An additional Group Policy template (SecGuide.admx/adml) is required - it is available from Microsoft at this link.

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Cryptography\Wintrust\Config" -Name "EnableCertPaddingCheck" -ErrorAction SilentlyContinue | Select-Object EnableCertPaddingCheck
```

Expected output should show `EnableCertPaddingCheck : 1`

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography\Wintrust\Config`
3. Check that `EnableCertPaddingCheck` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- **CVE-2013-3900**: This setting addresses a remote code execution vulnerability in the WinVerifyTrust function's handling of Windows Authenticode signature verification for PE files.

- **Strict validation**: When enabled, PE files will be considered "unsigned" if Windows identifies content in them that does not conform to the Authenticode specification, providing enhanced protection against malicious code.

- **Registry key creation**: If the registry key `HKLM:\SOFTWARE\Microsoft\Cryptography\Wintrust\Config` does not exist, this role will create it and set the value to `1` (Enabled).

- **Impact**: Enabling this setting may cause some legitimate applications with non-conforming signatures to be treated as unsigned. Test thoroughly in your environment before deploying widely.

- **Group Policy alternative**: While this role sets the registry value directly, the same setting can be configured via Group Policy using the SecGuide.admx template from Microsoft.
