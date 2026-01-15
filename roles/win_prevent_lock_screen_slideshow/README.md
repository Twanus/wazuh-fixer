# win_prevent_lock_screen_slideshow

This role remediates CIS Benchmark 18.1.1.2 (check 26167): Ensure 'Prevent enabling lock screen slide show' is set to 'Enabled'.

## Description

This policy setting disables the lock screen slide show settings in PC Settings and prevents a slide show from playing on the lock screen. When enabled, users cannot configure or play a slide show on the lock screen, which extends the protection afforded by the lock screen to slide show contents.

**The recommended state for this setting is: Enabled.**

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_prevent_lock_screen_slideshow_no_lock_screen_slideshow` | `1` | Registry value for NoLockScreenSlideshow. 0 = Disabled/Not Set (lock screen slide show allowed), 1 = Enabled (lock screen slide show prevented, CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Prevent Enabling Lock Screen Slide Show
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_prevent_lock_screen_slideshow
```

### Using Development Path

```yaml
---
- name: Test Prevent Enabling Lock Screen Slide Show Role (Development)
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_prevent_lock_screen_slideshow  # noqa role-name[path]
  post_tasks:
    - name: Verify role completed successfully
      ansible.builtin.debug:
        msg: "Role execution completed. Check the output above for configuration."
```

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Personalization`
- **Registry Value**: `NoLockScreenSlideshow` (DWORD)
- **Value 0**: Disabled/Not Set - Lock screen slide show settings are available and slide show can play on the lock screen
- **Value 1**: Enabled - Lock screen slide show settings are disabled and slide show cannot play on the lock screen (CIS requirement)

## Verification

To verify the configuration manually:

1. Open Group Policy Management Editor
2. Navigate to: `Computer Configuration\Policies\Administrative Templates\Control Panel\Personalization\Prevent enabling lock screen slide show`
3. Verify that "Prevent enabling lock screen slide show" is set to "Enabled"

Or use PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "NoLockScreenSlideshow" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NoLockScreenSlideshow
```

Expected output: `1`

## Compliance

This role addresses the following compliance frameworks:

- **CIS Benchmark**: 18.1.1.2 (check 26167)
- **CIS CSC v7**: 16.11
- **ISO 27001:2013**: A.8.1.3

## Rationale

Disabling the lock screen slide show extends the protection afforded by the lock screen to slide show contents. This prevents unauthorized access to slide show functionality when the device is locked, reducing the risk of privacy violations and unauthorized content display. The lock screen is designed to protect the device and user data, and allowing slide show functionality from the lock screen could potentially be exploited to display content without user consent or knowledge.

## Remediation

To establish the recommended configuration via Group Policy, set the following UI path to "Enabled":

`Computer Configuration\Policies\Administrative Templates\Control Panel\Personalization\Prevent enabling lock screen slide show`

**Note**: This Group Policy path is provided by the Group Policy template `ControlPanelDisplay.admx/adml` that is included with the Microsoft Windows 8.1 & Server 2012 R2 Administrative Templates (or newer).

## Checks

The Wazuh check (26167) passes if all of the following conditions are met (Condition: all):

- The registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Personalization` exists, AND
- The registry value `NoLockScreenSlideshow` exists, AND
- The registry value `NoLockScreenSlideshow` equals `1`

## Idempotency

This role is idempotent. Running it multiple times will produce the same result without unnecessary changes. If the setting is already configured correctly, the role will report that no changes were needed.

## Security Benefits

- **Privacy Protection**: Prevents unauthorized slide show access when the device is locked
- **Lock Screen Security**: Extends the security boundary of the lock screen to include slide show features
- **Attack Surface Reduction**: Eliminates potential privacy violations from unauthorized slide show activation
- **Compliance**: Meets requirements for multiple security frameworks and standards
- **User Privacy**: Protects users from potential unauthorized content display or information disclosure

## Notes

- This setting disables the lock screen slide show settings in PC Settings
- When enabled, a slide show cannot play on the lock screen
- The setting applies to all users on the system
- If the registry key or value does not exist, the role will create them
- This policy is part of the Personalization group policy settings
- The Group Policy template `ControlPanelDisplay.admx/adml` must be available for this setting to be configurable via Group Policy

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
