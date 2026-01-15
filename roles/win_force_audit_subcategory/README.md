# win_force_audit_subcategory

This role remediates CIS Benchmark 2.3.2.1 (check 26013): Ensure 'Audit: Force audit policy subcategory settings (Windows Vista or later) to override audit policy category settings' is set to 'Enabled'.

## Description

Prior to the introduction of auditing subcategories in Windows Vista, it was difficult to track events at a per-system or per-user level. The larger event categories created too many events and the key information that needed to be audited was difficult to find.

This policy setting allows administrators to enable the more precise auditing capabilities present in Windows Vista. The Audit Policy settings available in Windows Server 2003 Active Directory do not yet contain settings for managing the new auditing subcategories. To properly apply the auditing policies prescribed in this baseline, the Audit: Force audit policy subcategory settings (Windows Vista or later) to override audit policy category settings setting needs to be configured to Enabled.

**Important**: Be very cautious about audit settings that can generate a large volume of traffic. For example, if you enable either success or failure auditing for all of the Privilege Use subcategories, the high volume of audit events generated can make it difficult to find other types of entries in the Security log. Such a configuration could also have a significant impact on system performance.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_force_audit_subcategory_enabled_value` | `1` | Registry value for SCENoApplyLegacyAuditPolicy (1 = Enabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Force audit policy subcategory settings to override category settings
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_force_audit_subcategory
```

Or using the development path:

```yaml
---
- name: Force audit policy subcategory settings to override category settings
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_force_audit_subcategory  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.2.1 (check 26013)
- **CIS CSC v7**: 6.2, 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 9.4.5, 10.2, 10.2.1, 10.2.1.2, 10.2.1.5
- **SOC 2**: CC5.2, CC7.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
- **Value Name**: `SCENoApplyLegacyAuditPolicy`
- **Value Type**: `REG_DWORD`
- **Required Value**: `1` (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Lsa" -Name "SCENoApplyLegacyAuditPolicy" | Select-Object SCENoApplyLegacyAuditPolicy
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Lsa`
3. Check that `SCENoApplyLegacyAuditPolicy` is set to `1`

## Idempotency

This role is idempotent. If the registry value is already set to `1` (Enabled), no changes will be made.

## Notes

- This setting enables more precise auditing capabilities available in Windows Vista and later versions.
- Once enabled, audit policy subcategory settings will override the older audit policy category settings.
- This setting should be configured before applying granular audit policies via subcategories.
- Be aware that enabling granular audit subcategories may generate a high volume of audit events, which can impact system performance and make it difficult to find specific events in the Security log.
- If the registry value does not exist, it will be created and set to `1` (Enabled).
