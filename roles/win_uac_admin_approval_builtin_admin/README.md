# Windows UAC Admin Approval Mode for Built-in Administrator Role

## Description

This role remediates CIS Benchmark check 2.3.17.1 (check ID 26064): "Ensure 'User Account Control: Admin Approval Mode for the Built-in Administrator account' is set to 'Enabled'".

The role configures the Windows registry setting to enable Admin Approval Mode for the built-in Administrator account. This is a critical security control that helps mitigate the risk of malicious software running under elevated credentials without the user or administrator being aware of its activity.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_admin_approval_builtin_admin_filter_administrator_token` | `1` | Registry value for FilterAdministratorToken. 0 = Disabled - Admin Approval Mode disabled for built-in Administrator, 1 = Enabled - Admin Approval Mode enabled for built-in Administrator (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Admin Approval Mode for Built-in Administrator Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_admin_approval_builtin_admin
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Admin Approval Mode for Built-in Administrator Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_admin_approval_builtin_admin  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.1 (check 26064)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

One of the risks that the User Account Control feature introduced with Windows Vista is trying to mitigate is that of malicious software running under elevated credentials without the user or administrator being aware of its activity. An attack vector for these programs was to discover the password of the account named "Administrator" because that user account was created for all installations of Windows. To address this risk, in Windows Vista or newer, the built-in Administrator account is now disabled by default. In a default installation of a new computer, accounts with administrative control over the computer are initially set up in one of two ways:

- If the computer is not joined to a domain, the first user account you create has the equivalent permissions as a local administrator.
- If the computer is joined to a domain, no local administrator accounts are created. The Enterprise or Domain Administrator must log on to the computer and create one if a local administrator account is warranted.

Once Windows is installed, the built-in Administrator account may be manually enabled, but we strongly recommend that this account remain disabled. However, if the built-in Administrator account must be enabled, this policy setting ensures that Admin Approval Mode is enabled for that account, providing an additional layer of security.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `FilterAdministratorToken`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "FilterAdministratorToken" -ErrorAction SilentlyContinue | Select-Object FilterAdministratorToken
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `FilterAdministratorToken` is set to 1 (Enabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Admin Approval Mode for the Built-in Administrator account`
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that even if the built-in Administrator account is enabled, it will still be subject to User Account Control (UAC) prompts, providing an additional layer of security against malicious software.

- **Built-in Administrator account**: The built-in Administrator account is disabled by default in Windows Vista and later. This policy setting only applies if the account has been manually enabled.

- **Admin Approval Mode**: When enabled, this setting ensures that the built-in Administrator account runs in Admin Approval Mode, which means that even administrative actions will prompt for approval, helping to prevent unauthorized changes.

- **Attack mitigation**: This setting helps mitigate the risk of malicious software running under elevated credentials without the user or administrator being aware of its activity, particularly if the built-in Administrator account password is discovered.

- **Best practice**: While this role enables Admin Approval Mode for the built-in Administrator account, the best practice is to keep the built-in Administrator account disabled and use other administrative accounts instead.

- **Domain environments**: In domain environments, local administrator accounts are typically not created by default. This setting is most relevant for standalone or workgroup computers where local administrator accounts may be used.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
