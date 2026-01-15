# win_audit_mpssvc_rule_level_policy_change

This role remediates CIS Benchmark 17.7.4 (check 26158): Ensure 'Audit MPSSVC Rule-Level Policy Change' is set to 'Success and Failure'.

## Description

This subcategory determines whether the operating system generates audit events when changes are made to policy rules for the Microsoft Protection Service (MPSSVC.exe). Changes to firewall rules are important for understanding the security state of the computer and how well it is protected against network attacks.

Events for this subcategory include:
- **4944**: The following policy was active when the Windows Firewall started.
- **4945**: A rule was listed when the Windows Firewall started.
- **4946**: A change has been made to Windows Firewall exception list. A rule was added.
- **4947**: A change has been made to Windows Firewall exception list. A rule was modified.
- **4948**: A change has been made to Windows Firewall exception list. A rule was deleted.
- **4949**: Windows Firewall settings were restored to the default values.
- **4950**: A Windows Firewall setting has changed.
- **4951**: A rule has been ignored because its major version number was not recognized by Windows Firewall.
- **4952**: Parts of a rule have been ignored because its minor version number was not recognized by Windows Firewall. The other parts of the rule will be enforced.
- **4953**: A rule has been ignored by Windows Firewall because it could not parse the rule.
- **4954**: Windows Firewall Group Policy settings have changed. The new settings have been applied.
- **4956**: Windows Firewall has changed the active profile.
- **4957**: Windows Firewall did not apply the following rule.
- **4958**: Windows Firewall did not apply the following rule because the rule referred to items not configured on this computer.

The recommended state for this setting is: **Success and Failure**.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to "Success and Failure" by default.

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure Audit MPSSVC Rule-Level Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_mpssvc_rule_level_policy_change
```

Or using the development path:

```yaml
---
- name: Configure Audit MPSSVC Rule-Level Policy Change
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_mpssvc_rule_level_policy_change  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.7.4 (check 26158)
- **CIS CSC v7**: 5.5, 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.1.2, A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"MPSSVC Rule-Level Policy Change"`
- **Set Command**: `auditpol.exe /set /subcategory:"MPSSVC Rule-Level Policy Change" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
MPSSVC Rule-Level Policy Change           Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change\Audit MPSSVC Rule - Level Policy Change`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"MPSSVC Rule-Level Policy Change"
```

The output should show "Success and Failure" for the MPSSVC Rule-Level Policy Change subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\Policy Change`
3. Check that "Audit MPSSVC Rule - Level Policy Change" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed changes to Windows Firewall policy rules.
- Changes to firewall rules are important for understanding the security state of the computer and how well it is protected against network attacks.
- The events generated (4944-4958) are useful for investigating security incidents and tracking firewall configuration changes.
- Without this setting enabled, it is difficult or impossible to determine when firewall rules have been modified.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
