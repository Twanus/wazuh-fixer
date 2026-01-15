# win_ms_network_server_spn_validation

This role remediates CIS Benchmark 2.3.9.5 (check 26038): Ensure 'Microsoft network server: Server SPN target name validation level' is set to 'Accept if provided by client' or higher.

## Description

The identity of a computer can be spoofed to gain unauthorized access to network resources.

This policy setting controls the level of validation a computer with shared folders or printers (the server) performs on the service principal name (SPN) that is provided by the client computer when it establishes a session using the server message block (SMB) protocol. The server message block (SMB) protocol provides the basis for file and print sharing and other networking operations, such as remote Windows administration.

The SMB protocol supports validating the SMB server service principal name (SPN) within the authentication blob provided by a SMB client to prevent a class of attacks against SMB servers referred to as SMB relay attacks. This setting will affect both SMB1 and SMB2.

**The recommended state for this setting is: Accept if provided by client (value 1).** Configuring this setting to Required from client (value 2) also conforms to the benchmark.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_ms_network_server_spn_validation_validation_level` | `1` | SPN validation level. Must be 1 (Accept if provided by client - recommended) or 2 (Required from client - also conforms). Value 0 (Off) does not conform to CIS. |

### Valid Values

- **0** = Off - no SPN validation (does not conform to CIS Benchmark)
- **1** = Accept if provided by client (recommended by CIS)
- **2** = Required from client (also conforms to CIS)

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set Microsoft network server SPN validation level
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_server_spn_validation
```

Or using the development path:

```yaml
---
- name: Set Microsoft network server SPN validation level
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_ms_network_server_spn_validation_validation_level: 1
  roles:
    - role: ../roles/win_ms_network_server_spn_validation  # noqa role-name[path]
```

### Override to use Required from client

```yaml
---
- name: Set Microsoft network server SPN validation to Required from client
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_ms_network_server_spn_validation_validation_level: 2
  roles:
    - role: twanus.wazuh_fixer.win_ms_network_server_spn_validation
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.9.5 (check 26038)
- **CIS CSC v7**: 5.1
- **CIS CSC v8**: 4.1
- **CMMC v2.0**: AC.L1-3.1.1, AC.L1-3.1.2, CM.L2-3.4.1, CM.L2-3.4.2, CM.L2-3.4.6, CM.L2-3.4.7
- **ISO 27001:2013**: A.14.2.5, A.8.1.3
- **NIST SP 800-53**: CM-7(1), CM-9, SA-10
- **PCI DSS v3.2.1**: 11.5, 2.2
- **PCI DSS v4.0**: 1.1.1, 1.2.1, 1.2.6, 1.2.7, 1.5.1, 2.1.1, 2.2.1
- **SOC 2**: CC7.1, CC8.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters`
- **Value Name**: `SMBServerNameHardeningLevel`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Accept if provided by client - recommended) or 2 (Required from client - also conforms)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters" -Name "SMBServerNameHardeningLevel" -ErrorAction SilentlyContinue | Select-Object SMBServerNameHardeningLevel
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters`
3. Check that `SMBServerNameHardeningLevel` is set to 1 or 2

## Idempotency

This role is idempotent. If the registry value is already set to 1 or 2 (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to 0 (Off - not compliant)
- It is currently set to a different value than the configured value

## Notes

- **Security benefit**: Enabling SPN validation helps prevent SMB relay attacks by validating the service principal name (SPN) provided by the client during SMB authentication. This prevents attackers from spoofing the identity of a computer to gain unauthorized access to network resources.

- **Recommended value**: The default value is 1 (Accept if provided by client), which is recommended by CIS. This provides protection while maintaining compatibility.

- **Alternative value**: Value 2 (Required from client) also conforms to the CIS Benchmark and provides stricter validation. Use this value if you want to require SPN validation from all clients.

- **SMB relay attacks**: This setting helps prevent SMB relay attacks, which are a class of attacks where an attacker intercepts SMB authentication traffic and relays it to another server to gain unauthorized access.

- **SMB1 and SMB2**: This setting affects both SMB1 and SMB2 protocols, providing protection across different SMB versions.

- **Network connectivity**: Setting this to 2 (Required from client) may affect connectivity with older clients that do not support SPN validation. The default value of 1 (Accept if provided by client) provides a balance between security and compatibility.

- **If the registry value does not exist**, it will be created and set to 1 (Accept if provided by client - recommended) to ensure compliance.
