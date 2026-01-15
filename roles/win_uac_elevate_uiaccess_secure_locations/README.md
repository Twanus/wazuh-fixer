# Windows UAC Elevate UIAccess Applications in Secure Locations Role

## Description

This role remediates CIS Benchmark check 2.3.17.5 (check ID 26068): "Ensure 'User Account Control: Only elevate UIAccess applications that are installed in secure locations' is set to 'Enabled'".

The role configures the Windows registry setting to ensure that applications requesting User Interface Accessibility (UIAccess) integrity level must reside in secure locations in the file system. This is a critical security control that helps prevent malicious applications from bypassing User Interface Privilege Isolation (UIPI) restrictions.

## Requirements

- Ansible 2.9 or higher
- Target hosts must be Windows systems
- The `ansible.windows` collection must be installed
- Appropriate privileges to modify registry (typically Administrator)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_uac_elevate_uiaccess_secure_locations_enable_secure_uia_paths` | `1` | Registry value for EnableSecureUIAPaths. 0 = Disabled/Not Set - UIAccess applications can run from any location, 1 = Enabled - UIAccess applications must be installed in secure locations (CIS requirement). |

## Dependencies

- `ansible.windows` collection

## Example Playbook

### Using Collection Format

```yaml
---
- name: Remediate Windows UAC Elevate UIAccess Applications in Secure Locations Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - twanus.wazuh_fixer.win_uac_elevate_uiaccess_secure_locations
```

### Using Development Path

```yaml
---
- name: Remediate Windows UAC Elevate UIAccess Applications in Secure Locations Policy
  hosts: windows_servers
  gather_facts: yes
  roles:
    - role: ../roles/win_uac_elevate_uiaccess_secure_locations  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.17.5 (check 26068)
- **CIS CSC v7**: 4.4
- **ISO 27001:2013**: A.9.4.3

## Rationale

UIAccess Integrity allows an application to bypass User Interface Privilege Isolation (UIPI) restrictions when an application is elevated in privilege from a standard user to an administrator. This is required to support accessibility features such as screen readers that are transmitting user interfaces to alternative forms. A process that is started with UIAccess rights has the following abilities:

- To set the foreground window.
- To drive any application window using SendInput function.
- To use read input for all integrity levels using low-level hooks, raw input, GetKeyState, GetAsyncKeyState, and GetKeyboardInput.
- To set journal hooks.
- To use AttachThreadInput to attach a thread to a higher integrity input queue.

If this policy setting is not enabled, UIAccess applications could be installed in non-secure locations and potentially be modified by malicious users or software. This could allow malicious applications to bypass UIPI restrictions and gain elevated privileges, potentially compromising system security.

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
- **Value Name**: `EnableSecureUIAPaths`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Enabled)

## Secure Locations

When this policy is enabled, UIAccess applications must be installed in one of the following secure locations:

- `...\Program Files\`, including subfolders
- `...\Windows\System32\`
- `...\Program Files (x86)\`, including subfolders (for 64-bit versions of Windows)

**Note**: Windows enforces a public key infrastructure (PKI) signature check on any interactive application that requests to run with a UIAccess integrity level regardless of the state of this security setting.

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "EnableSecureUIAPaths" -ErrorAction SilentlyContinue | Select-Object EnableSecureUIAPaths
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System`
3. Check that `EnableSecureUIAPaths` is set to 1 (Enabled)

You can also verify using Group Policy:

1. Open `gpedit.msc`
2. Navigate to `Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\User Account Control: Only elevate UIAccess applications that are installed in secure locations`
3. Verify it is set to "Enabled"

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Enabled), no changes will be made. The role will update the value if it is different from 1.

## Notes

- **Security benefit**: Enabling this setting ensures that UIAccess applications can only run from secure, protected locations in the file system, preventing malicious applications from being placed in user-accessible locations and then used to bypass UIPI restrictions.

- **UIAccess applications**: These are typically accessibility applications such as screen readers, on-screen keyboards, and other assistive technologies that need to interact with applications running at different integrity levels.

- **PKI signature requirement**: Even with this policy enabled, Windows still requires that UIAccess applications be signed with a valid PKI certificate, providing an additional layer of security.

- **Accessibility support**: This setting is important for supporting accessibility features while maintaining security. It ensures that legitimate accessibility applications can function properly while preventing malicious applications from exploiting UIAccess privileges.

- **Attack mitigation**: This setting helps mitigate the risk of malicious applications being placed in user-accessible locations (such as user profile directories) and then used to bypass UIPI restrictions to gain elevated privileges or access sensitive information.

- **Best practice**: Always ensure that legitimate UIAccess applications are installed in the secure locations specified by this policy. Applications installed in other locations will not be able to request UIAccess integrity level.

## License

GPL-2.0-or-later

## Author Information

Antoon Vereecken <antveree@gmail.com>
