# win_domain_max_machine_pwd_age

This role remediates CIS Benchmark 2.3.6.5 (check 26020): Ensure 'Domain member: Maximum machine account password age' is set to '30 or fewer days, but not 0'.

## Description

In Active Directory-based domains, each computer has an account and password just like every user. By default, the domain members automatically change their domain password every 30 days. If you increase this interval significantly, or set it to 0 so that the computers no longer change their passwords, an attacker will have more time to undertake a brute force attack to guess the password of one or more computer accounts.

This policy setting determines the maximum allowable age for a computer account password. By default, domain members automatically change their domain passwords every 30 days. If you increase this interval significantly so that the computers no longer change their passwords, an attacker would have more time to undertake a brute force attack against one of the computer accounts.

**The recommended state for this setting is: 30 or fewer days, but not 0.**

**Important Notes:**
- A value of 0 does not conform to the benchmark as it disables maximum password age.
- Some problems can occur as a result of machine account password expiration, particularly if a machine is reverted to a previous point-in-time state, as is common with virtual machines. Depending on how far back the reversion is, the older machine account password stored on the machine may no longer be recognized by the domain controllers, and therefore the computer loses its domain trust.
- This can also disrupt non-persistent VDI implementations, and devices with write filters that disallow permanent changes to the OS volume. Some organizations may choose to exempt themselves from this recommendation and disable machine account password expiration for these situations.

## Requirements

- Ansible 2.9 or higher
- Windows target host
- WinRM connectivity
- Appropriate permissions to modify registry settings
- Domain-joined computer (this setting only applies to domain members)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `win_domain_max_machine_pwd_age_maximum_password_age` | `30` | Maximum age (in days) for machine account password. Must be between 1 and 30 days. |

## Dependencies

None.

## Example Playbook

```yaml
---
- name: Set maximum machine account password age
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_domain_max_machine_pwd_age
```

Or using the development path:

```yaml
---
- name: Set maximum machine account password age
  hosts: windows
  gather_facts: true
  become: false
  vars:
    win_domain_max_machine_pwd_age_maximum_password_age: 30
  roles:
    - role: ../roles/win_domain_max_machine_pwd_age  # noqa role-name[path]
```

## Compliance

This role addresses the following compliance requirements:

- **CIS Benchmark**: 2.3.6.5 (check 26020)
- **CIS CSC v8**: 5.2
- **CMMC v2.0**: IA.L2-3.5.7
- **PCI DSS v4.0**: 2.2.2, 8.3.5, 8.3.6, 8.6.3
- **SOC 2**: CC6.1

## Registry Details

- **Registry Path**: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Netlogon\Parameters`
- **Value Name**: `MaximumPasswordAge`
- **Value Type**: `REG_DWORD`
- **Required Value**: Between 1 and 30 days (not 0)

## Verification

You can verify the setting using PowerShell:

```powershell
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\Netlogon\Parameters" -Name "MaximumPasswordAge" -ErrorAction SilentlyContinue | Select-Object MaximumPasswordAge
```

Or using the registry editor:

1. Open `regedit.exe`
2. Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Netlogon\Parameters`
3. Check that `MaximumPasswordAge` is set to a value between 1 and 30 (not 0)

## Idempotency

This role is idempotent. If the registry value is already set to a value between 1 and 30 days (matching the configured value), no changes will be made. The role will update the value if:
- It is currently set to 0 (disabled)
- It is currently set to a value greater than 30 days
- It is currently set to a different value than the configured value

## Notes

- **Domain requirement**: This setting only applies to domain-joined computers. It has no effect on standalone or workgroup computers.

- **Machine account password**: Computer accounts in Active Directory have passwords just like user accounts. These passwords are automatically changed by the domain member periodically.

- **Default behavior**: By default, domain members automatically change their domain passwords every 30 days. This role ensures that maximum password age is explicitly set and not disabled (0).

- **Virtual machines and VDI**: Be aware that machine account password expiration can cause issues with:
  - Virtual machines that are reverted to previous snapshots
  - Non-persistent VDI implementations
  - Devices with write filters that prevent permanent OS changes

- **If the registry value does not exist**, it will be created and set to 30 days (or the configured value) to ensure compliance.
