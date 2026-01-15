# Windows UAC Secure Desktop Prompt Role

## Description

This role remediates CIS Benchmark check 2.3.17.7 (check ID 26070): "Ensure 'User Account Control: Switch to the secure desktop when prompting for elevation' is set to 'Enabled'".

The role configures the Windows registry setting to enable the secure desktop for User Account Control (UAC) elevation prompts. This is a critical security control that helps prevent spoofing attacks by presenting a distinct, secure desktop environment when prompting users for elevation.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_secure_desktop_prompt_prompt_on_secure_desktop` | `1` | Registry value for PromptOnSecureDesktop. 0 = Disabled - Standard elevation prompt, 1 = Enabled - Secure desktop elevation prompt (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Secure Desktop Prompt Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_secure_desktop_prompt
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Secure Desktop Prompt Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_secure_desktop_prompt  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.7 (check 26070)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

Standard elevation prompt dialog boxes can be spoofed, which may cause users to disclose their passwords to malicious software. The secure desktop presents a very distinct appearance when prompting for elevation, where the user desktop dims, and the elevation prompt UI is more prominent. This increases the likelihood that users who become accustomed to the secure desktop will recognize a spoofed elevation prompt dialog box and not fall for the trick.

When enabled, the secure desktop:
- Dims the user's desktop background
- Displays the elevation prompt in a more prominent, secure environment
- Makes it significantly more difficult for malicious software to spoof the elevation prompt
- Provides a clear visual distinction that users can learn to recognize

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `PromptOnSecureDesktop`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "PromptOnSecureDesktop" -ErrorAction SilentlyContinue | Select-Object PromptOnSecureDesktop
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `PromptOnSecureDesktop` is set to 1 (Enabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Switch to the secure desktop when prompting for elevation`
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting significantly reduces the risk of spoofing attacks where malicious software attempts to trick users into entering their credentials by displaying a fake elevation prompt.

- **User experience**: When enabled, users will see their desktop dim when an elevation prompt appears, making it clear that they are in a secure environment. This visual cue helps users distinguish legitimate elevation prompts from potential spoofing attempts.

- **Spoofing mitigation**: The secure desktop is isolated from the user's normal desktop environment, making it extremely difficult for malicious software to overlay fake prompts or intercept user input.

- **User training**: Users should be educated to recognize the secure desktop appearance (dimmed background, prominent prompt) and to be suspicious of any elevation prompts that do not display this characteristic.

- **Compatibility**: This setting works with all versions of Windows that support User Account Control (Windows Vista and later).

- **Performance**: The secure desktop has minimal performance impact and provides significant security benefits.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
