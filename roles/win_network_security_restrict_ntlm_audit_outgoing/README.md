# win_network_security_restrict_ntlm_audit_outgoing

This role remediates CIS Benchmark 2.3.11.12 (check 26061): Ensure 'Network security: Restrict NTLM: Outgoing NTLM traffic to remote servers' is set to 'Audit all' or higher.

## Description

Auditing and monitoring NTLM traffic can assist in identifying systems using this outdated authentication protocol, so they can be remediated to using a more secure protocol, such as Kerberos. The log information gathered can also assist in forensic investigations after a malicious attack. NTLM and NTLMv2 authentication is vulnerable to various attacks, including SMB relay, man-in-the-middle, and brute force attacks. Reducing and eliminating NTLM authentication in an environment reduces the risk of an attacker gaining access to systems on the network.

This policy setting allows the auditing of outgoing NTLM traffic. Events for this setting are recorded in the operational event log (e.g. Applications and Services Log\Microsoft\Windows\NTLM). 

**The recommended state for this setting is: Audit all (value 1).** Configuring this setting to Deny All (value 2) also conforms to the benchmark. Note: Configuring this setting to Deny All is more secure, however it could have a negative impact on applications that still require NTLM. Test carefully before implementing the Deny All value.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_network_security_restrict_ntlm_audit_outgoing_value` | `1` | Registry value for RestrictSendingNTLMTraffic. Set to 1 to enable auditing for all outgoing NTLM traffic (recommended). Set to 2 to deny all outgoing NTLM traffic (more secure but may impact applications). Options: 0=Allow all, 1=Audit all, 2=Deny all. |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Enable network security - restrict NTLM audit outgoing traffic
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_network_security_restrict_ntlm_audit_outgoing
```

Or using the development path:

```yaml
---
- name: Enable network security - restrict NTLM audit outgoing traffic
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_network_security_restrict_ntlm_audit_outgoing  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.11.12 (check 26061)
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
- **Value Name**: `RestrictSendingNTLMTraffic`
- **Value Type**: `REG_DWORD`
- **Required Value**: 1 (Audit all) or 2 (Deny all)

### Registry Value Options

- **0** = Allow all (not compliant)
- **1** = Audit all (recommended, compliant)
- **2** = Deny all (more secure, compliant, but may impact applications)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0" -Name "RestrictSendingNTLMTraffic" -ErrorAction SilentlyContinue | Select-Object RestrictSendingNTLMTraffic
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0`
3. Check that `RestrictSendingNTLMTraffic` is set to 1 (Audit all) or 2 (Deny all)

You can also view the audit logs in Event Viewer:

1. Open Event Viewer
2. Navigate to `Applications and Services Logs\Microsoft\Windows\NTLM\Operational`
3. Review outgoing NTLM authentication events

## Idempotency

This role is idempotent. If the registry value is already set to 1 (Audit all) or 2 (Deny all), no changes will be made. The role will create the value if it does not exist, or update it if it is different from the configured value.

## Notes

- **Security benefit**: Enabling this setting allows organizations to audit and monitor outgoing NTLM authentication traffic. This helps identify systems using the outdated NTLM protocol so they can be migrated to more secure protocols like Kerberos.

- **Forensic investigation**: The audit logs gathered can assist in forensic investigations after a malicious attack by providing visibility into authentication attempts.

- **Attack mitigation**: NTLM and NTLMv2 authentication is vulnerable to various attacks including SMB relay, man-in-the-middle, and brute force attacks. Monitoring NTLM traffic helps identify and remediate these vulnerabilities.

- **Deny All consideration**: While setting the value to 2 (Deny all) is more secure and also compliant, it may have a negative impact on applications that still require NTLM. Test carefully before implementing the Deny All value in production environments.

- **Compliance**: This setting helps meet multiple compliance requirements related to audit logging and monitoring, including CIS, NIST, PCI DSS, and SOC 2 controls.

- **If the registry value does not exist**, it will be created and set to 1 (Audit all) to ensure compliance.

- **Group Policy path**: This setting can also be configured via Group Policy at: Computer Configuration\Policies\Windows Settings\Security Settings\Local Policies\Security Options\Restrict NTLM: Outgoing NTLM traffic to remote servers
