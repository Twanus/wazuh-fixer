# win_audit_ipsec_driver

This role remediates CIS Benchmark 17.9.1 (check 26161): Ensure 'Audit IPsec Driver' is set to 'Success and Failure'.

## Description

This subcategory reports on the activities of the Internet Protocol security (IPsec) driver. Events for this subcategory include:

- **4960**: IPsec dropped an inbound packet that failed an integrity check. If this problem persists, it could indicate a network issue or that packets are being modified in transit to this computer. Verify that the packets sent from the remote computer are the same as those received by this computer. This error might also indicate interoperability problems with other IPsec implementations.
- **4961**: IPsec dropped an inbound packet that failed a replay check. If this problem persists, it could indicate a replay attack against this computer.
- **4962**: IPsec dropped an inbound packet that failed a replay check. The inbound packet had too low a sequence number to ensure it was not a replay.
- **4963**: IPsec dropped an inbound clear text packet that should have been secured. This is usually due to the remote computer changing its IPsec policy without informing this computer. This could also be a spoofing attack attempt.
- **4965**: IPsec received a packet from a remote computer with an incorrect Security Parameter Index (SPI). This is usually caused by malfunctioning hardware that is corrupting packets. If these errors persist, verify that the packets sent from the remote computer are the same as those received by this computer. This error may also indicate interoperability problems with other IPsec implementations. In that case, if connectivity is not impeded, then these events can be ignored.
- **5478**: IPsec Services has started successfully.
- **5479**: IPsec Services has been shut down successfully. The shutdown of IPsec Services can put the computer at greater risk of network attack or expose the computer to potential security risks.
- **5480**: IPsec Services failed to get the complete list of network interfaces on the computer. This poses a potential security risk because some of the network interfaces may not get the protection provided by the applied IPsec filters. Use the IP Security Monitor snap-in to diagnose the problem.
- **5483**: IPsec Services failed to initialize RPC server. IPsec Services could not be started.
- **5484**: IPsec Services has experienced a critical failure and has been shut down. The shutdown of IPsec Services can put the computer at greater risk of network attack or expose the computer to potential security risks.
- **5485**: IPsec Services failed to process some IPsec filters on a plug-and-play event for network interfaces. This poses a potential security risk because some of the network interfaces may not get the protection provided by the applied IPsec filters. Use the IP Security Monitor snap-in to diagnose the problem.

Auditing these events may be useful when investigating a security incident. The recommended state for this setting is: **Success and Failure**.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify audit policy settings (typically requires Administrator privileges)
- The `auditpol.exe` command must be available (included in Windows by default)

## Role Variables

This role does not require any variables to be set. The audit policy is configured to "Success and Failure" by default.

## Dependencies

None.

## Example Playbook

### Using the Collection Format

```yaml
---
- name: Configure Audit IPsec Driver
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_audit_ipsec_driver
```

### Using Development Path (for testing)

```yaml
---
- name: Configure Audit IPsec Driver
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_audit_ipsec_driver  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 17.9.1 (check 26161)
- **CIS CSC v7**: 6.3
- **CIS CSC v8**: 8.5
- **CMMC v2.0**: AU.L2-3.3.1
- **ISO 27001:2013**: A.12.4.1
- **NIST SP 800-53**: AU-3(1), AU-7
- **PCI DSS v3.2.1**: 10.1, 10.2.2, 10.2.4, 10.2.5, 10.3
- **PCI DSS v4.0**: 10.2, 10.2.1, 10.2.1.2, 10.2.1.5, 9.4.5
- **SOC 2**: CC5.2, CC7.2

## Command Details

This role uses the `auditpol.exe` command to configure the audit policy:

- **Check Command**: `auditpol.exe /get /subcategory:"IPsec Driver"`
- **Set Command**: `auditpol.exe /set /subcategory:"IPsec Driver" /success:enable /failure:enable`

The check command output typically looks like:
```
System audit policy

Category/Subcategory                      Setting
IPsec Driver                              Success and Failure
```

## Group Policy Configuration

To establish the recommended configuration via Group Policy, set the following UI path to Success and Failure:
- **Path**: `Computer Configuration\Policies\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System\Audit IPsec Driver`

## Verification

You can verify the setting using PowerShell:

```powershell
auditpol.exe /get /subcategory:"IPsec Driver"
```

The output should show "Success and Failure" for the IPsec Driver subcategory.

Alternatively, you can verify using Group Policy:

1. Open `gpedit.msc` (Local Group Policy Editor)
2. Navigate to `Computer Configuration\Windows Settings\Security Settings\Advanced Audit Policy Configuration\Audit Policies\System`
3. Check that "Audit IPsec Driver" is set to "Success and Failure"

## Idempotency

This role is idempotent. If the audit policy is already set to "Success and Failure", no changes will be made.

## Notes

- This setting enables auditing for both successful and failed IPsec driver events.
- The events generated (4960, 4961, 4962, 4963, 4965, 5478, 5479, 5480, 5483, 5484, 5485) are useful for investigating security incidents and network issues.
- IPsec driver events can help detect network attacks, packet tampering, replay attacks, and IPsec service failures.
- This role requires Administrator privileges to modify audit policy settings.
- The `auditpol.exe` command is available by default on Windows systems.
