# win_network_access_restrict_anonymous_access_named_pipes_shares

This role remediates CIS Benchmark 2.3.10.9 (check 26046): Ensure 'Network access: Restrict anonymous access to Named Pipes and Shares' is set to 'Enabled'.

## Description

Null sessions are a weakness that can be exploited through shares (including the default shares) on computers in your environment.

When enabled, this policy setting restricts anonymous access to only those shares and pipes that are named in the Network access: Named pipes that can be accessed anonymously and Network access: Shares that can be accessed anonymously settings. This policy setting controls null session access to shares on your computers by adding RestrictNullSessAccess with the value 1 in the HKLM\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters registry key. This registry value toggles null session shares on or off to control whether the server service restricts unauthenticated clients' access to named resources.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_restrict_anonymous_access_named_pipes_shares_enabled_value` | `1` | Registry value for RestrictNullSessAccess (1 = Enabled, 0 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network access restrict anonymous access to Named Pipes and Shares
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_restrict_anonymous_access_named_pipes_shares
```

Or using the development path:

```yaml
---
- name: Configure network access restrict anonymous access to Named Pipes and Shares
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_restrict_anonymous_access_named_pipes_shares  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.9 (check 26046)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `RestrictNullSessAccess`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanManServer\Parameters" -Name "RestrictNullSessAccess" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty RestrictNullSessAccess
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `RestrictNullSessAccess` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made. The role will update the value if it is different from the required value.

## Notes

- **Security benefit**: When enabled, this policy setting restricts anonymous access to only those shares and pipes that are named in the Network access: Named pipes that can be accessed anonymously and Network access: Shares that can be accessed anonymously settings. This helps protect against null session attacks.

- **Null sessions**: Null sessions are a weakness that can be exploited through shares (including the default shares) on computers in your environment. Enabling this setting helps mitigate this risk.

- **Registry behavior**: This registry value toggles null session shares on or off to control whether the server service restricts unauthenticated clients' access to named resources.

- **If the registry value does not exist**, it will be created and set to `1` (Enabled) to ensure compliance. According to the CIS check, the absence of this value is also considered compliant (Condition: any), but setting it explicitly with the recommended value is preferred.
