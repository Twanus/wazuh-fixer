# win_network_access_null_session_shares

This role remediates CIS Benchmark 2.3.10.11 (check 26048): Ensure 'Network access: Shares that can be accessed anonymously' is set to 'None'.

## Description

This policy setting determines which network shares can be accessed by anonymous users. The default configuration for this policy setting has little effect because all users have to be authenticated before they can access shared resources on the server.

**The recommended state for this setting is: <blank> (i.e. None).**

It is very dangerous to allow any values in this setting. Any shares that are listed can be accessed by any network user, which could lead to the exposure or corruption of sensitive data.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

This role does not require any variables. The registry value `NullSessionShares` should simply not exist (be removed).

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set network access shares to None
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_null_session_shares
```

Or using the development path:

```yaml
---
- name: Set network access shares to None
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_null_session_shares  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.11 (check 26048)
- **CIS CSC v7**: 14.6
- **ISO 27001:2013**: A.9.1.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `NullSessionShares`
- **Value Type**: `REG_MULTI_SZ` or `REG_SZ`
- **Required Value**: The value should not exist (be removed/absent) or be empty

## Verification

You can verify the setting using PowerShell:

```powershell
$value = Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\LanManServer\Parameters" -Name "NullSessionShares" -ErrorAction SilentlyContinue
if ($null -eq $value) {
    Write-Output "NullSessionShares does not exist (compliant)"
} else {
    Write-Output "NullSessionShares exists: $($value.NullSessionShares)"
}
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `NullSessionShares` does not exist (or is empty if it exists)

## Idempotency

This role is idempotent. If the registry value does not exist (or is empty), no changes will be made. The role will remove the value if it exists and contains any data.

## Notes

- **Security benefit**: Setting this to None (blank/empty) prevents anonymous access to network shares, which is critical for protecting sensitive data. Any shares listed in this setting can be accessed by any network user without authentication, which could lead to the exposure or corruption of sensitive data.

- **Data protection**: This setting is very dangerous if misconfigured. Allowing anonymous access to shares means that any network user can access those shares without authentication, potentially exposing sensitive data or allowing data corruption.

- **Default behavior**: When this value is not set (does not exist), no shares can be accessed anonymously, which is the recommended state. The default configuration has little effect because all users have to be authenticated before they can access shared resources on the server.

- **Network shares**: Network shares are folders that are made available over the network. By default, Windows requires authentication to access shares. However, if shares are listed in the `NullSessionShares` registry value, they can be accessed anonymously by any network user.

- **If the registry value exists with data**, this role will remove it to ensure compliance. The value should not exist, or if it exists, it should be empty (no shares listed).

- **Group Policy path**: To establish the recommended configuration via Group Policy, set the following UI path to <blank> (i.e. None): `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\Network access: Shares that can be accessed anonymously`.
