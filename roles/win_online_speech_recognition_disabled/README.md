# win_online_speech_recognition_disabled

This role remediates CIS Benchmark 18.1.2.2 (check 26168): Ensure 'Allow users to enable online speech recognition services' is set to 'Disabled'.

## Description

This policy enables the automatic learning component of input personalization that includes speech, inking, and typing. Automatic learning enables the collection of speech and handwriting patterns, typing history, contacts, and recent calendar information. It is required for the use of Cortana. Some of this collected information may be stored on the user's OneDrive, in the case of inking and typing; some of the information will be uploaded to Microsoft to personalize speech.

**The recommended state for this setting is: Disabled.**

## Rationale

If this setting is Enabled, sensitive information could be stored in the cloud or sent to Microsoft. This includes speech patterns, handwriting patterns, typing history, contacts, and recent calendar information. Disabling this setting prevents the automatic collection and transmission of this sensitive data to Microsoft's cloud services.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_online_speech_recognition_disabled_disabled_value` | `0` | Registry value for AllowInputPersonalization (0 = Disabled) |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Disable online speech recognition services
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_online_speech_recognition_disabled
```

Or using the development path:

```yaml
---
- name: Disable online speech recognition services
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_online_speech_recognition_disabled  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 18.1.2.2 (check 26168)
- **CIS CSC v7**: 5.1
- **CIS CSC v8**: 4.1
- **CMMC v2.0**: AC.L1-3.1.1, AC.L1-3.1.2, CM.L2-3.4.1, CM.L2-3.4.2, CM.L2-3.4.6, CM.L2-3.4.7
- **ISO 27001:2013**: A.14.2.5, A.8.1.3
- **NIST SP 800-53**: CM-7(1), CM-9, SA-10
- **PCI DSS v3.2.1**: 11.5, 2.2
- **PCI DSS v4.0**: 1.1.1, 1.2.1, 1.2.6, 1.2.7, 1.5.1, 2.1.1, 2.2.1
- **SOC 2**: CC7.1, CC8.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\InputPersonalization`
- **Value Name**: `AllowInputPersonalization`
- **Value Type**: `REG_DWORD`
- **Required Value**: `0` (Disabled)

## Group Policy Path

Computer Configuration\Policies\Administrative Templates\Control Panel\Regional and Language Options\Allow users to enable online speech recognition services

**Note**: This Group Policy path is provided by the Group Policy template Globalization.admx/adml that is included with the Microsoft Windows 10 RTM (Release 1507) Administrative Templates (or newer).

**Note #2**: In older Microsoft Windows Administrative Templates, this setting was initially named "Allow input personalization", but it was renamed to "Allow users to enable online speech recognition services" starting with the Windows 10 R1809 & Server 2019 Administrative Templates.

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\InputPersonalization" -Name "AllowInputPersonalization" -ErrorAction SilentlyContinue | Select-Object AllowInputPersonalization
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\InputPersonalization`
3. Check that `AllowInputPersonalization` is set to `0`

## Idempotency

This role is idempotent. If the registry value is already set to `0` (Disabled), no changes will be made.

## Notes

- **Privacy protection**: Disabling this setting prevents the automatic collection and transmission of sensitive user data (speech patterns, handwriting patterns, typing history, contacts, calendar information) to Microsoft's cloud services.

- **Cortana dependency**: This setting is required for the use of Cortana. If Cortana functionality is needed, this setting may need to remain enabled, but this conflicts with CIS Benchmark recommendations.

- **OneDrive storage**: When enabled, some collected information (inking and typing) may be stored on the user's OneDrive, while speech information is uploaded to Microsoft for personalization.

- **Registry key creation**: If the registry key does not exist, this role will create it and set the value to `0` (Disabled) to ensure explicit compliance.

- **Policy precedence**: This is a Group Policy setting, so if Group Policy is being used, the registry value should be set via Group Policy rather than directly in the registry. However, setting it directly in the registry will still enforce the policy.
