# Windows UAC Consent Prompt Behavior for Administrators Role

## Description

This role remediates CIS Benchmark check 2.3.17.2 (check ID 26065): "Ensure 'User Account Control: Behavior of the elevation prompt for administrators in Admin Approval Mode' is set to 'Prompt for consent on the secure desktop'".

The role configures the Windows registry setting to control the behavior of the elevation prompt for administrators in Admin Approval Mode. This is a critical security control that helps mitigate the risk of malicious software running under elevated credentials without the user or administrator being aware of its activity.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_consent_prompt_behavior_admin_consent_prompt_behavior_admin` | `2` | Registry value for ConsentPromptBehaviorAdmin. 0 = Elevate without prompting, 1 = Prompt for credentials on the secure desktop, 2 = Prompt for consent on the secure desktop (CIS requirement), 3 = Prompt for credentials, 4 = Prompt for consent, 5 = Prompt for consent for non-Windows binaries. |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Consent Prompt Behavior for Administrators Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_consent_prompt_behavior_admin
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Consent Prompt Behavior for Administrators Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_consent_prompt_behavior_admin  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.2 (check 26065)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

One of the risks that the User Account Control feature introduced with Windows Vista is trying to mitigate is that of malicious software running under elevated credentials without the user or administrator being aware of its activity. This setting raises awareness to the administrator of elevated privilege operations and permits the administrator to prevent a malicious program from elevating its privilege when the program attempts to do so.

The "Prompt for consent on the secure desktop" setting ensures that:
- Administrators are prompted for consent before any elevation occurs
- The prompt appears on the secure desktop, which is isolated from other processes and cannot be intercepted by malicious software
- The administrator must explicitly approve or deny the elevation request

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `ConsentPromptBehaviorAdmin`
- **Value Type**: `REG_DWORD`
- **Required Value**: 2 (Prompt for consent on the secure desktop)

### Value Options

- **0**: Elevate without prompting - Not recommended, provides no security
- **1**: Prompt for credentials on the secure desktop - Acceptable alternative
- **2**: Prompt for consent on the secure desktop - **Recommended (CIS requirement)**
- **3**: Prompt for credentials - Less secure, prompt not on secure desktop
- **4**: Prompt for consent - Less secure, prompt not on secure desktop
- **5**: Prompt for consent for non-Windows binaries - Less secure, prompt not on secure desktop

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "ConsentPromptBehaviorAdmin" -ErrorAction SilentlyContinue | Select-Object ConsentPromptBehaviorAdmin
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `ConsentPromptBehaviorAdmin` is set to 2 (Prompt for consent on the secure desktop)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Behavior of the elevation prompt for administrators in Admin Approval Mode`
3. Verify it is set to "Prompt for consent on the secure desktop"

## Idempotency

This role is idempotent. If the registry value is already set to 2 (Prompt for consent on the secure desktop), no changes will be made. The role will update the value if it is different from 2 or if the value is not set.

## Notes

- **Security benefit**: This setting ensures that administrators are always prompted for consent before any elevation occurs, and the prompt appears on the secure desktop which cannot be intercepted by malicious software.

- **Secure desktop**: The secure desktop is an isolated desktop environment that is separate from the user's normal desktop. When a UAC prompt appears on the secure desktop, it cannot be accessed or manipulated by other processes, providing protection against UI spoofing attacks.

- **Admin Approval Mode**: This setting only applies when Admin Approval Mode is enabled. If Admin Approval Mode is disabled, this setting has no effect.

- **Attack mitigation**: This setting helps mitigate the risk of malicious software running under elevated credentials without the user or administrator being aware of its activity by requiring explicit consent on a secure desktop.

- **Alternative values**: While the CIS Benchmark requires value 2, value 1 (Prompt for credentials on the secure desktop) also conforms to the benchmark and may be used in environments where credential prompts are preferred over consent prompts.

- **User experience**: This setting may increase the number of prompts administrators see, but this is a necessary trade-off for security. The secure desktop ensures that prompts cannot be spoofed or intercepted.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
