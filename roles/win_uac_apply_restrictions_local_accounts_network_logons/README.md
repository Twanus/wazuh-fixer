# Windows UAC Apply Restrictions to Local Accounts on Network Logons Role

## Description

This role remediates CIS Benchmark check 18.4.1 (check ID 26170): "Ensure 'Apply UAC restrictions to local accounts on network logons' is set to 'Enabled'".

The role configures the Windows registry setting to apply User Account Control (UAC) restrictions to local accounts when they authenticate via network logon (e.g., NET USE, connecting to C$, etc.). This is a critical security control that helps mitigate the risk of credential theft for local accounts when the same account and password is configured on multiple systems.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Warnings

### WinRM Authentication Impact for Local Admin Accounts

**Critical Warning**: This role breaks WinRM (Windows Remote Management) authentication for local administrator accounts in standalone (non-AD) Windows environments.

**Issue**: When `LocalAccountTokenFilterPolicy` is set to `0` (Enabled - the CIS requirement), local accounts including those in the Administrators group cannot obtain full administrative tokens during network logons. This includes WinRM authentication used by Ansible.

**Impact**:
- After applying this role, Ansible operations using local admin accounts over WinRM will fail with authentication errors (e.g., `401 InvalidCredentialsError: credentials rejected`)
- The `ansible.windows.win_ping` module and other WinRM-based operations will fail
- This affects **all** local accounts, even those in the Administrators group
- Interactive logons (RDP, console) are not affected - only network logons (WinRM, SMB, etc.)

**Affected Environments**:
- Standalone Windows servers (no Active Directory)
- Workgroups
- Windows systems managed via Ansible using local admin accounts

**Workarounds**:
1. **Domain Accounts (Recommended)**: Use Active Directory domain accounts for WinRM authentication. Domain accounts are not affected by `LocalAccountTokenFilterPolicy`.
2. **Apply Role Order**: Ensure this role is applied last in your playbook if you need continued local admin access for subsequent roles.
3. **Alternative Management**: Use domain-joined systems or alternative remote management methods that don't rely on local account network logons.
4. **Accept Limitation**: Understand that applying CIS 18.4.1 means local admin accounts cannot be used for WinRM/remote administration - this is the security behavior the CIS benchmark intends.

**Technical Details**:
- Registry Value: `HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\System\LocalAccountTokenFilterPolicy = 0`
- Effect: Enables UAC token filtering for local accounts on network logons
- Result: Local accounts authenticate but receive filtered (non-admin) tokens over network connections
- Reference: Microsoft KB 951016 - "Description of User Account Control and remote restrictions in Windows Vista"

**Note**: This is not a bug - it is the intended security behavior of CIS 18.4.1. The CIS benchmark explicitly requires this setting to prevent Pass-the-Hash attacks, even at the cost of breaking local admin remote access patterns.

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_apply_restrictions_local_accounts_network_logons_local_account_token_filter_policy` | `0` | Registry value for LocalAccountTokenFilterPolicy. 0 = Enabled - UAC restrictions applied to local accounts on network logons (CIS requirement - default Windows behavior), 1 = Disabled - Full administrative rights for local accounts on network logons. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Apply Restrictions to Local Accounts on Network Logons Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_apply_restrictions_local_accounts_network_logons
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Apply Restrictions to Local Accounts on Network Logons Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_apply_restrictions_local_accounts_network_logons  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 18.4.1 (check 26170)
- **CIS CSC v7**: 4.3
- **ISO 27001:2013**: A.9.2.3

## Rationale

Local accounts are at high risk for credential theft when the same account and password is configured on multiple systems. Ensuring this policy is Enabled significantly reduces that risk.

This setting controls whether local accounts can be used for remote administration via network logon (e.g., NET USE, connecting to C$, etc.). When enabled, UAC token-filtering is applied to local accounts on network logons. Membership in powerful groups such as Administrators is disabled and powerful privileges are removed from the resulting access token. This configures the LocalAccountTokenFilterPolicy registry value to 0, which is the default behavior for Windows.

When disabled, local accounts have full administrative rights when authenticating via network logon, by configuring the LocalAccountTokenFilterPolicy registry value to 1. This creates a significant security risk as it allows credential theft attacks (such as Pass-the-Hash) when the same local account and password is used across multiple systems.

For more information about local accounts and credential theft, review the "Mitigating Pass-the-Hash (PtH) Attacks and Other Credential Theft Techniques" documents. For more information about LocalAccountTokenFilterPolicy, see Microsoft Knowledge Base article 951016: Description of User Account Control and remote restrictions in Windows Vista.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `LocalAccountTokenFilterPolicy`
- **Value Type**: `REG_DWORD`
- **Required Value**: 0 (Enabled - UAC restrictions applied)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "LocalAccountTokenFilterPolicy" -ErrorAction SilentlyContinue | Select-Object LocalAccountTokenFilterPolicy
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `LocalAccountTokenFilterPolicy` is set to 0 (Enabled) or does not exist (defaults to 0)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Administrative Templates\MS Security Guide\Apply UAC restrictions to local accounts on network logons`
   - **Note**: This Group Policy path does not exist by default. An additional Group Policy template (SecGuide.admx/adml) is required - it is available from Microsoft at this link.
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 0 (Enabled), or if the value does not exist (which defaults to 0), no changes will be made. The role will update the value if it is different from 0.

## Notes

- **WinRM Authentication Impact**: **IMPORTANT** - This role breaks WinRM authentication for local admin accounts. See the [Warnings](#warnings) section above for details and workarounds.

- **Security benefit**: Enabling this setting ensures that local accounts are subject to UAC restrictions when authenticating via network logon, significantly reducing the risk of credential theft attacks such as Pass-the-Hash (PtH). When the same local account and password is used across multiple systems, this setting helps prevent attackers from using stolen credentials to gain full administrative access.

- **Default behavior**: When the LocalAccountTokenFilterPolicy registry value does not exist, Windows defaults to 0 (Enabled), which is the recommended setting. This role explicitly sets the value to 0 to ensure compliance and auditability.

- **Network logon scenarios**: This setting applies to remote administration scenarios such as:
  - NET USE commands
  - Connecting to administrative shares (e.g., C$)
  - Remote administration tasks using local accounts

- **Local accounts**: This setting specifically applies to local accounts, not domain accounts. Domain accounts are managed differently through domain policies.

- **Token filtering**: When enabled, UAC token-filtering removes administrative privileges from local accounts during network logon, forcing them to run with standard user privileges unless explicitly elevated.

- **Credential theft mitigation**: This setting is a critical control for mitigating Pass-the-Hash (PtH) attacks and other credential theft techniques. By restricting local account privileges on network logons, even if credentials are stolen, attackers cannot immediately gain full administrative access.

- **Group Policy template**: The Group Policy setting for this configuration requires an additional template file (SecGuide.admx/adml) that is not included by default in Windows. Organizations that want to manage this setting via Group Policy must download and install this template from Microsoft.

- **Domain environments**: In domain environments, this setting is particularly important for systems that may have local administrator accounts created for various purposes (backup services, service accounts, etc.). Ensuring these accounts are subject to UAC restrictions helps prevent lateral movement if credentials are compromised.

## License

GPL-2.0-or-later

## Author Information

This role was created as part of the `twanus.wazuh_fixer` Ansible collection for CIS Windows Benchmark remediation.
