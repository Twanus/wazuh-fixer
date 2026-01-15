# win_network_security_restrict_ntlm_audit_incoming

This role remediates CIS Benchmark 2.3.11.11 (check 26060): Ensure 'Network security: Restrict NTLM: Audit Incoming NTLM Traffic' is set to 'Enable auditing for all accounts'.

## Description

Auditing and monitoring NTLM traffic can assist in identifying systems using this outdated authentication protocol, so they can be remediated to using a more secure protocol, such as Kerberos. The log information gathered can also assist in forensic investigations after a malicious attack. NTLM and NTLMv2 authentication is vulnerable to various attacks, including SMB relay, man-in-the-middle, and brute force attacks. Reducing and eliminating NTLM authentication in an environment reduces the risk of an attacker gaining access to systems on the network.

This policy setting allows the auditing of incoming NTLM traffic. Events for this setting are recorded in the operational event log (e.g. Applications and Services Log\Microsoft\Windows\NTLM).

**The recommended state for this setting is: Enable auditing for all accounts (value 2).**

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_restrict_ntlm_audit_incoming_value` | `2` | Registry value for AuditReceivingNTLMTraffic. Set to 2 to enable auditing for all accounts. Options: 0=Disabled, 1=Enable auditing for domain accounts, 2=Enable auditing for all accounts. |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable network security - restrict NTLM audit incoming traffic
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_restrict_ntlm_audit_incoming
```

Or using the development path:

```yaml
---
- name: Enable network security - restrict NTLM audit incoming traffic
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_restrict_ntlm_audit_incoming  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.11 (check 26060)
- **CIS CSC v7**: 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0`
- **Value Name**: `AuditReceivingNTLMTraffic`
- **Value Type**: `REG_DWORD`
- **Required Value**: 2 (Enable auditing for all accounts)

### Registry Value Options

- **0** = Disabled (no auditing)
- **1** = Enable auditing for domain accounts
- **2** = Enable auditing for all accounts (recommended)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0" -Name "AuditReceivingNTLMTraffic" -ErrorAction SilentlyContinue | Select-Object AuditReceivingNTLMTraffic
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0`
3. Check that `AuditReceivingNTLMTraffic` is set to 2

You can also view the audit logs in Event Viewer:

1. Open Event Viewer
2. Navigate to `Applications and Services Logs\Microsoft\Windows\NTLM\Operational`
3. Review incoming NTLM authentication events

## Idempotency

This role is idempotent. If the registry value is already set to 2 (Enable auditing for all accounts), no changes will be made. The role will create the value if it does not exist, or update it if it is different from 2.

## Notes

- **Security benefit**: Enabling this setting allows organizations to audit and monitor NTLM authentication traffic. This helps identify systems using the outdated NTLM protocol so they can be migrated to more secure protocols like Kerberos.

- **Forensic investigation**: The audit logs gathered can assist in forensic investigations after a malicious attack by providing visibility into authentication attempts.

- **Attack mitigation**: NTLM and NTLMv2 authentication is vulnerable to various attacks including SMB relay, man-in-the-middle, and brute force attacks. Monitoring NTLM traffic helps identify and remediate these vulnerabilities.

- **Compliance**: This setting helps meet multiple compliance requirements related to audit logging and monitoring, including CIS, NIST, PCI DSS, and SOC 2 controls.

- **If the registry value does not exist**, it will be created and set to 2 (Enable auditing for all accounts) to ensure compliance.
