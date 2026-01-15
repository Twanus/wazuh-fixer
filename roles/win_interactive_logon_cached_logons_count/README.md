# win_interactive_logon_cached_logons_count

This role remediates CIS Benchmark 2.3.7.7 (check 26028): Ensure 'Interactive logon: Number of previous logons to cache (in case domain controller is not available)' is set to '4 or fewer logon(s)'.

## Description

The number that is assigned to this policy setting indicates the number of users whose logon information the computer will cache locally. If the number is set to 4, then the computer caches logon information for 4 users. When a 5th user logs on to the computer, the server overwrites the oldest cached logon session. Users who access the computer console will have their logon credentials cached on that computer. An attacker who is able to access the file system of the computer could locate this cached information and use a brute force attack to attempt to determine user passwords. To mitigate this type of attack, Windows encrypts the information and obscures its physical location.

This policy setting determines whether a user can log on to a Windows domain using cached account information. Logon information for domain accounts can be cached locally to allow users to log on even if a Domain Controller cannot be contacted. This policy setting determines the number of unique users for whom logon information is cached locally. If this value is set to 0, the logon cache feature is disabled.

**The recommended state for this setting is: 4 or fewer logon(s).**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- Domain-joined computer (this setting primarily affects domain accounts)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_cached_logons_count_cached_logons_count` | `4` | Number of previous logons to cache. Must be between 0 and 4 (0 = disabled, 1-4 = enabled with specified count). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set cached logons count
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_cached_logons_count
```

Or using the development path:

```yaml
---
- name: Set cached logons count
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_cached_logons_count_cached_logons_count: 4
  roles:
    - role: ../roles/win_interactive_logon_cached_logons_count  # noqa role-name[path]
```

### Override to disable caching

```yaml
---
- name: Disable cached logons
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_cached_logons_count_cached_logons_count: 0
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_cached_logons_count
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.7 (check 26028)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon`
- **Value Name**: `CachedLogonsCount`
- **Value Type**: `REG_DWORD`
- **Required Value**: Between 0 and 4 (0 = disabled, 1-4 = enabled with specified count)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" -Name "CachedLogonsCount" -ErrorAction SilentlyContinue | Select-Object CachedLogonsCount
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon`
3. Check that `CachedLogonsCount` is set to a value between 0 and 4

## Idempotency

This role is idempotent. If the registry value is already set to a value between 0 and 4 (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to a value greater than 4
- It is currently set to a different value than the configured value

## Notes

- **Security benefit**: Limiting the number of cached logons reduces the attack surface. An attacker who is able to access the file system could locate cached logon information and use brute force attacks to determine user passwords. Windows encrypts this information and obscures its physical location, but limiting the number still reduces risk.

- **Usability vs Security**: Setting this to 0 disables the logon cache feature entirely, which means users cannot log on if the Domain Controller is unavailable. Setting it to 1-4 allows limited offline logon capability while still maintaining security. The default value of 4 balances usability with security.

- **Cache behavior**: When a new user logs on and the cache is full (e.g., 4 users cached), the oldest cached logon session is overwritten.

- **Domain requirement**: This setting primarily affects domain-joined computers and domain accounts. Local accounts are not affected by this setting.

- **Value 0**: If set to 0, the logon cache feature is disabled. Users will not be able to log on if the Domain Controller is unavailable. While this is the most secure option, it may impact usability in environments where Domain Controllers may be temporarily unavailable.

- **If the registry value does not exist**, it will be created and set to 4 (or the configured value) to ensure compliance.
