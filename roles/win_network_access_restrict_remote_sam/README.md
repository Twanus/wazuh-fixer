# win_network_access_restrict_remote_sam

This role remediates CIS Benchmark 2.3.10.10 (check 26047): Ensure 'Network access: Restrict clients allowed to make remote calls to SAM' is set to 'Administrators: Remote Access: Allow'.

## Description

To ensure that an unauthorized user cannot anonymously list local account names or groups and use the information to attempt to guess passwords or perform social engineering attacks. (Social engineering attacks try to deceive users in some way to obtain passwords or some form of security information.)

This policy setting allows you to restrict remote RPC connections to SAM. The recommended state for this setting is: **Administrators: Remote Access: Allow**.

**Note**: A Windows 10 R1607, Server 2016 or newer OS is required to access and set this value in Group Policy.

**Note #2**: This setting was originally only supported on Windows 10 R1607 or newer, then support for it was added to Windows 7 or newer via the March 2017 security patches.

**Note #3**: If your organization is using Microsoft Defender for Identity (formerly Azure Advanced Threat Protection (Azure ATP)), the (organization-named) Defender for Identity Directory Service Account (DSA), will also need to be granted the same Remote Access: Allow permission. For more information on adding the service account please see [Configure SAM-R to enable lateral movement path detection in Microsoft Defender for Identity | Microsoft Docs](https://docs.microsoft.com/en-us/defender-for-identity/configure-sam-r).

## Requirements

- Ansible 2.9 or higher
- Windows target host (Windows 10 R1607, Server 2016 or newer, or Windows 7 or newer with March 2017 security patches)
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_access_restrict_remote_sam_sddl_value` | `"O:BAG:BAD:(A;;RC;;;BA)"` | SDDL (Security Descriptor Definition Language) string value for RestrictRemoteSAM. This value grants Administrators group Remote Access permission. |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Configure network access restriction for remote SAM calls
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_access_restrict_remote_sam
```

Or using the development path:

```yaml
---
- name: Configure network access restriction for remote SAM calls
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_access_restrict_remote_sam  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.10.10 (check 26047)

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
- **Value Name**: `RestrictRemoteSAM`
- **Value Type**: `REG_SZ` (String)
- **Required Value**: `O:BAG:BAD:(A;;RC;;;BA)` (SDDL format granting Administrators: Remote Access: Allow)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "RestrictRemoteSAM" -ErrorAction SilentlyContinue | Select-Object RestrictRemoteSAM
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa`
3. Check that `RestrictRemoteSAM` is set to `O:BAG:BAD:(A;;RC;;;BA)`

## Idempotency

This role is idempotent. If the registry value is already set to `O:BAG:BAD:(A;;RC;;;BA)`, no changes will be made. The role will update the value if it is different or does not exist.

## Notes

- **Security benefit**: This setting restricts remote RPC connections to SAM to only authorized users (Administrators by default). This helps prevent unauthorized users from anonymously listing local account names or groups and using the information to attempt to guess passwords or perform social engineering attacks.

- **Social engineering protection**: By restricting remote access to SAM, this setting reduces the risk of social engineering attacks where attackers use account names to deceive users into revealing passwords or other security information.

- **Windows version requirements**: A Windows 10 R1607, Server 2016 or newer OS is required to access and set this value in Group Policy. Support for this setting was added to Windows 7 or newer via the March 2017 security patches.

- **Microsoft Defender for Identity**: If your organization is using Microsoft Defender for Identity, the Defender for Identity Directory Service Account (DSA) will also need to be granted the same Remote Access: Allow permission. See the Microsoft documentation for details.

- **SDDL format**: The setting uses Security Descriptor Definition Language (SDDL) format. The value `O:BAG:BAD:(A;;RC;;;BA)` means:
  - `O:BA` = Owner: Built-in Administrators
  - `G:BA` = Group: Built-in Administrators
  - `D:` = DACL (Discretionary Access Control List)
  - `(A;;RC;;;BA)` = Allow (A) Remote Access (RC) to Built-in Administrators (BA)

- **If the registry value does not exist**, it will be created and set to `O:BAG:BAD:(A;;RC;;;BA)` to ensure compliance.
