# win_network_security_allow_localsystem_null_session_fallback

This role remediates CIS Benchmark 2.3.11.2 (check 26051): Ensure 'Network security: Allow LocalSystem NULL session fallback' is set to 'Disabled'.

## Description

This policy setting determines whether NTLM is allowed to fall back to a NULL session when used with LocalSystem. NULL sessions are less secure because by definition they are unauthenticated.

When this setting is enabled, NTLM authentication can fall back to a NULL session when used with LocalSystem, which provides no authentication and creates security vulnerabilities. When disabled, NTLM is not allowed to fall back to a NULL session, ensuring that LocalSystem services use authenticated sessions.

**The recommended state for this setting is: Disabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_allow_localsystem_null_session_fallback_disabled_value` | `0` | Registry value for AllowNullSessionFallback. Set to 0 to disable NULL session fallback (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable network security LocalSystem NULL session fallback
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_allow_localsystem_null_session_fallback
```

Or using the development path:

```yaml
---
- name: Disable network security LocalSystem NULL session fallback
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_allow_localsystem_null_session_fallback  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.2 (check 26051)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\MSV1_0`
- **Value Name**: `AllowNullSessionFallback`
- **Value Type**: `REG_DWORD`
- **Required Value**: `0` (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa\MSV1_0" -Name "AllowNullSessionFallback" -ErrorAction SilentlyContinue | Select-Object AllowNullSessionFallback
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa\MSV1_0`
3. Check that `AllowNullSessionFallback` is set to `0`

## Idempotency

This role is idempotent. If the registry value is already set to `0` (Disabled), no changes will be made.

## Notes

- **Security benefit**: Disabling this setting ensures that NTLM authentication does not fall back to NULL sessions when used with LocalSystem, preventing unauthenticated access and improving security posture. NULL sessions are inherently insecure as they provide no authentication mechanism.

- **NULL sessions**: NULL sessions are unauthenticated connections that do not provide user credentials. Allowing NULL session fallback creates security vulnerabilities by bypassing authentication requirements.

- **LocalSystem context**: This setting specifically applies to services running as LocalSystem that use NTLM authentication.

- **If the registry value does not exist**, it will be created and set to `0` (Disabled) to ensure compliance. According to the CIS check, the absence of this value is also considered compliant (Condition: any), but setting it explicitly with the recommended value is preferred for clarity and auditability.

- **Group Policy path**: This setting can also be configured via Group Policy at: Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\Network security: Allow LocalSystem NULL session fallback
