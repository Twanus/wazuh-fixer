# win_interactive_logon_smart_card_removal

This role remediates CIS Benchmark 2.3.7.9 (check 26030): Ensure 'Interactive logon: Smart card removal behavior' is set to 'Lock Workstation' or higher.

## Description

Users sometimes forget to lock their workstations when they are away from them, allowing the possibility for malicious users to access their computers. If smart cards are used for authentication, the computer should automatically lock itself when the card is removed to ensure that only the user with the smart card is accessing resources using those credentials.

This policy setting determines what happens when the smart card for a logged-on user is removed from the smart card reader.

**The recommended state for this setting is: Lock Workstation (value 1).** Configuring this setting to Force Logoff (value 2) or Disconnect if a Remote Desktop Services session (value 3) also conforms to the benchmark.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- Smart card readers and smart card infrastructure (for the setting to be effective)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_interactive_logon_smart_card_removal_sc_remove_option` | `1` | Smart card removal behavior. Must be 1 (Lock Workstation - recommended), 2 (Force Logoff), or 3 (Disconnect if Remote Desktop Services session). Value 0 (No action) does not conform to CIS. |

### Valid Values

- **0** = No action (does not conform to CIS Benchmark)
- **1** = Lock Workstation (recommended by CIS)
- **2** = Force Logoff (also conforms to CIS)
- **3** = Disconnect if Remote Desktop Services session (also conforms to CIS)

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set smart card removal behavior
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_smart_card_removal
```

Or using the development path:

```yaml
---
- name: Set smart card removal behavior
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_smart_card_removal_sc_remove_option: 1
  roles:
    - role: ../roles/win_interactive_logon_smart_card_removal  # noqa role-name[path]
```

### Override to use Force Logoff

```yaml
---
- name: Set smart card removal to Force Logoff
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_smart_card_removal_sc_remove_option: 2
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_smart_card_removal
```

### Override to use Disconnect if Remote Desktop Services session

```yaml
---
- name: Set smart card removal to Disconnect
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_interactive_logon_smart_card_removal_sc_remove_option: 3
  roles:
    - role: twanus.wazuh_fixer.win_interactive_logon_smart_card_removal
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.7.9 (check 26030)
- **CIS CSC v7**: 16.11
- **CIS CSC v8**: 4.3
- **CMMC v2.0**: AC.L2-3.1.10, AC.L2-3.1.11
- **HIPAA**: 164.312(a)(2)(iii)
- **ISO 27001:2013**: A.8.1.3
- **NIST SP 800-53**: AC-11, AC-11(1), AC-12, AC-2(5)
- **PCI DSS v3.2.1**: 8.1.8
- **PCI DSS v4.0**: 8.2.8

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon`
- **Value Name**: `ScRemoveOption`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Lock Workstation - recommended), 2 (Force Logoff), or 3 (Disconnect if Remote Desktop Services session)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" -Name "ScRemoveOption" -ErrorAction SilentlyContinue | Select-Object ScRemoveOption
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon`
3. Check that `ScRemoveOption` is set to 1, 2, or 3

## Idempotency

This role is idempotent. If the registry value is already set to the configured value (1, 2, or 3), no changes will be made. The role will update the value if it is different from the configured value.

## Notes

- **Security benefit**: Automatically locking the workstation (or forcing logoff/disconnect) when a smart card is removed prevents unauthorized access if users forget to lock their workstations. This ensures that only the user with the smart card can access resources using those credentials.

- **Recommended value**: The default value is 1 (Lock Workstation), which is recommended by CIS. This provides the best balance between security and usability, as users can unlock the workstation by reinserting their smart card without having to log back on.

- **Alternative values**: Values 2 (Force Logoff) and 3 (Disconnect if Remote Desktop Services session) also conform to the CIS Benchmark and may be appropriate for specific environments:
  - **Force Logoff (2)**: Completely logs off the user when the smart card is removed. This is more secure but less convenient, as users must log back on after reinserting their smart card.
  - **Disconnect if Remote Desktop Services session (3)**: Disconnects the Remote Desktop Services session when the smart card is removed. This is useful for terminal server environments.

- **Smart card infrastructure**: This setting only applies when smart cards are used for authentication. Organizations using smart cards should configure this setting to ensure automatic protection when cards are removed.

- **If the registry value does not exist**, it will be created and set to 1 (Lock Workstation - recommended) to ensure compliance.
