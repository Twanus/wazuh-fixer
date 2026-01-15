# Windows Relax Minimum Password Length Limits Role

## Description

This role remediates CIS Benchmark check 1.1.6 (check ID 26004): "Ensure 'Relax minimum password length limits' is set to 'Enabled'".

The role configures the Windows registry setting to enable support for passwords longer than the legacy 14-character limit. This allows organizations to enforce longer and generally stronger passwords or passphrases where MFA is not in use.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems (Windows 10 Release 2004 / Server 2022 or newer)
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_relax_pwd_length_limits_enabled` | `true` | Whether to enable RelaxMinimumPasswordLengthLimits. Should be true (Enabled = 1) per CIS requirement. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

```yaml
---
- name: Remediate Windows Relax Minimum Password Length Limits
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_relax_pwd_length_limits
```

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 1.1.6 (check 26004)
- **CIS CSC v7**: 16.2
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Rationale

This setting enables the enforcement of longer and generally stronger passwords or passphrases where MFA is not in use. The legacy Windows password length limit is 14 characters. Enabling this setting allows organizations to require passwords longer than 14 characters (up to 128 characters), enabling stronger security policies through longer passphrases.

## Notes

- This setting is only available on Windows 10 Release 2004 and Server 2022 (or newer).
- This setting is not available via downloadable Administrative Templates (ADMX/ADML).
- Must use Windows 10 Release 2004 / Server 2022 (or newer) to view or edit this setting with Group Policy Management Console.
- This setting only affects local accounts on the computer. Domain accounts are only affected by settings on the Domain Controllers.
- Registry path: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\SAM`
- Registry value: `RelaxMinimumPasswordLengthLimits` (DWORD: 1 = Enabled, 0 = Disabled)
- This works in conjunction with the minimum password length policy (CIS 1.1.4).

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
