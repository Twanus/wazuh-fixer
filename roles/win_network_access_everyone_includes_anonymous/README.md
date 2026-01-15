# win_network_access_everyone_includes_anonymous

This role remediates CIS Benchmark 2.3.10.5 (check 26042): Ensure 'Network access: Let Everyone permissions apply to anonymous users' is set to 'Disabled'.

## Description

An unauthorized user could anonymously list account names and shared resources and use the information to attempt to guess passwords, perform social engineering attacks, or launch DoS attacks.

This policy setting determines what additional permissions are assigned for anonymous connections to the computer.

**The recommended state for this setting is: Disabled.**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_everyone_includes_anonymous_disabled_value` | `0` | Registry value for EveryoneIncludesAnonymous. Set to 0 to disable Everyone permissions applying to anonymous users (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable network access Everyone permissions for anonymous users
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_everyone_includes_anonymous
```

Or using the development path:

```yaml
---
- name: Disable network access Everyone permissions for anonymous users
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_everyone_includes_anonymous  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.5 (check 26042)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
- **Value Name**: `EveryoneIncludesAnonymous`
- **Value Type**: `REG_DWORD`
- **Required Value**: 0 (Disabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa" -Name "EveryoneIncludesAnonymous" -ErrorAction SilentlyContinue | Select-Object EveryoneIncludesAnonymous
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
3. Check that `EveryoneIncludesAnonymous` is set to 0 (or does not exist, which is also compliant)

## Idempotency

This role is idempotent. If the registry value is already set to 0 (Disabled), no changes will be made. The role will update the value if it is different from 0.

## Notes

- **Security benefit**: Disabling this setting prevents Everyone permissions from being applied to anonymous users. This helps prevent unauthorized users from anonymously listing account names and shared resources, which could be used to attempt to guess passwords, perform social engineering attacks, or launch DoS attacks.

- **Anonymous connections**: This setting determines what additional permissions are assigned for anonymous connections to the computer. When disabled, anonymous users will not be granted the same permissions as the Everyone group.

- **Security risk**: If this setting is enabled, anonymous users are granted the same permissions as the Everyone group, which can include permissions to list account names and shared resources. This increases the attack surface and makes it easier for attackers to gather information about the system.

- **Social engineering protection**: By preventing anonymous users from accessing information that would normally be available to the Everyone group, this setting helps reduce the risk of social engineering attacks where attackers use information about account names and shared resources to deceive users.

- **DoS attack mitigation**: This setting also helps prevent DoS attacks by limiting the information that anonymous users can access.

- **If the registry value does not exist**, it is considered compliant (the check condition allows for the value not existing). However, this role will create the value and set it to 0 (Disabled) to ensure explicit compliance.
