# win_network_access_restrict_anonymous_sam

This role remediates CIS Benchmark 2.3.10.2 (check 26039): Ensure 'Network access: Do not allow anonymous enumeration of SAM accounts' is set to 'Enabled'.

## Description

An unauthorized user could anonymously list account names and use the information to attempt to guess passwords or perform social engineering attacks. (Social engineering attacks try to deceive users in some way to obtain passwords or some form of security information.)

This policy setting controls the ability of anonymous users to enumerate the accounts in the Security Accounts Manager (SAM). If you enable this policy setting, users with anonymous connections will not be able to enumerate domain account user names on the systems in your environment. This policy setting also allows additional restrictions on anonymous connections.

**The recommended state for this setting is: Enabled.**

**Note**: This policy has no effect on Domain Controllers.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_restrict_anonymous_sam_enabled_value` | `1` | Registry value for RestrictAnonymousSAM. Set to 1 to enable restriction of anonymous SAM enumeration (required). |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable network access restriction for anonymous SAM enumeration
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_restrict_anonymous_sam
```

Or using the development path:

```yaml
---
- name: Enable network access restriction for anonymous SAM enumeration
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_restrict_anonymous_sam  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.2 (check 26039)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
- **Value Name**: `RestrictAnonymousSAM`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "RestrictAnonymousSAM" -ErrorAction SilentlyContinue | Select-Object RestrictAnonymousSAM
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
3. Check that `RestrictAnonymousSAM` is set to 1 (or does not exist, which is also compliant)

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting prevents anonymous users from enumerating account names in the Security Accounts Manager (SAM). This helps prevent attackers from using this information to guess passwords or perform social engineering attacks.

- **Social engineering protection**: By preventing anonymous enumeration of SAM accounts, this setting reduces the risk of social engineering attacks where attackers use account names to deceive users into revealing passwords or other security information.

- **Domain Controllers**: This policy has no effect on Domain Controllers. Domain Controllers have their own security policies that control anonymous access.

- **Anonymous connections**: This setting restricts what information can be accessed by users with anonymous connections, adding an additional layer of security to your environment.

- **Domain account enumeration**: When enabled, users with anonymous connections will not be able to enumerate domain account user names on the systems in your environment.

- **If the registry value does not exist**, it is considered compliant (the check condition allows for the value not existing). However, this role will create the value and set it to 1 (Enabled) to ensure explicit compliance.
