# Windows UAC Standard User Elevation Deny Role

## Description

This role remediates CIS Benchmark check 2.3.17.3 (check ID 26066): "Ensure 'User Account Control: Behavior of the elevation prompt for standard users' is set to 'Automatically deny elevation requests'".

The role configures the Windows registry setting to automatically deny elevation requests for standard users. This is a critical security control that helps mitigate the risk of malicious programs running under elevated credentials without the user or administrator being aware of their activity.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_standard_user_elevation_deny_consent_prompt_behavior_user` | `0` | Registry value for ConsentPromptBehaviorUser. 0 = Automatically deny elevation requests (CIS requirement), 3 = Prompt for credentials on the secure desktop. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Standard User Elevation Deny Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_standard_user_elevation_deny
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Standard User Elevation Deny Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_standard_user_elevation_deny  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.3 (check 26066)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

One of the risks that the User Account Control feature introduced with Windows Vista is trying to mitigate is that of malicious programs running under elevated credentials without the user or administrator being aware of their activity. This setting raises awareness to the user that a program requires the use of elevated privilege operations and requires that the user be able to supply administrative credentials in order for the program to run.

When this policy setting is configured to "Automatically deny elevation requests", standard users will not be able to elevate their privileges. If a program requires elevated privileges, it will fail to run, and the user will need to contact an administrator to run the program. This provides a strong security posture by preventing standard users from inadvertently granting elevated privileges to malicious software.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `ConsentPromptBehaviorUser`
- **Value Type**: `REG_DWORD`
- **Required Value**: 0 (Automatically deny elevation requests)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "ConsentPromptBehaviorUser" -ErrorAction SilentlyContinue | Select-Object ConsentPromptBehaviorUser
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `ConsentPromptBehaviorUser` is set to 0 (Automatically deny elevation requests)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Behavior of the elevation prompt for standard users`
3. Verify it is set to "Automatically deny elevation requests"

## Idempotency

This role is idempotent. If the registry value is already set to 0 (Automatically deny elevation requests), no changes will be made. The role will update the value if it is different from 0.

## Notes

- **Security benefit**: Automatically denying elevation requests for standard users prevents malicious software from running with elevated privileges without explicit administrator intervention. This significantly reduces the attack surface and helps prevent privilege escalation attacks.

- **User experience**: When this setting is enabled, standard users will not be able to run programs that require elevated privileges. They will need to contact an administrator to run such programs. This may impact user productivity but provides stronger security.

- **Administrator accounts**: This setting only affects standard (non-administrator) user accounts. Administrator accounts are controlled by separate UAC settings.

- **Compatibility**: This setting is compatible with all Windows versions that support User Account Control (Windows Vista and later).

- **Best practice**: This setting is recommended by CIS Benchmarks as it provides the strongest security posture for standard user accounts. Organizations should balance security requirements with operational needs.

- **Attack mitigation**: This setting helps mitigate the risk of malicious software running under elevated credentials without the user or administrator being aware of its activity, particularly through social engineering attacks that trick users into granting elevated privileges.

- **Group Policy**: This setting can also be configured via Group Policy at `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Behavior of the elevation prompt for standard users`.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
