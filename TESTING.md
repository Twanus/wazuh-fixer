# Testing Guide

This guide explains how to test the roles in this Ansible collection.

## Prerequisites

### 1. Install Python Requirements

Install the required Python package for WinRM connectivity:

```bash
pip install pywinrm
```

Or install from requirements file:

```bash
pip install -r requirements.txt
```

### 2. Install Required Collections

```bash
ansible-galaxy collection install ansible.windows
```

### 3. Configure Windows Hosts

Ensure your Windows hosts have WinRM configured. You can use the following PowerShell script (run as Administrator):

```powershell
# Enable WinRM
Enable-PSRemoting -Force

# Configure WinRM for basic authentication (if needed)
Set-Item WSMan:\localhost\Service\Auth\Basic -Value $true

# Set WinRM to allow unencrypted traffic (for testing only - use HTTPS in production)
Set-Item WSMan:\localhost\Service\AllowUnencrypted -Value $true

# Restart WinRM service
Restart-Service WinRM
```

For production environments, configure HTTPS with certificates.

### 3. Prepare Inventory

Edit `inventory.yml` and add your Windows host information:

```yaml
all:
  children:
    windows_servers:
      hosts:
        my-windows-host:
          ansible_host: 192.168.1.100
          ansible_user: Administrator
          ansible_password: your_password
          ansible_connection: winrm
          ansible_winrm_transport: ntlm
          ansible_winrm_server_cert_validation: ignore
```

**Security Note:** For production environments, consider using secure credential management solutions or environment variables instead of hardcoding passwords in inventory files.

## Testing the Windows Password History Role

### Basic Test

```bash
ansible-playbook -i inventory.yml playbooks/test-windows-password-history.yml
```

### Test with Verbose Output

```bash
ansible-playbook -i inventory.yml playbooks/test-windows-password-history.yml -v
```

### Test with Custom Password History Size

```bash
ansible-playbook -i inventory.yml playbooks/test-windows-password-history.yml -e "win_pwd_hist_size_password_history_size=24"
```

### Test with Check Mode (Dry Run)

```bash
ansible-playbook -i inventory.yml playbooks/test-windows-password-history.yml --check
```

Note: Check mode may not work perfectly with Windows security policy changes, but it's useful for syntax validation.

### Test Specific Host

```bash
ansible-playbook -i inventory.yml playbooks/test-windows-password-history.yml --limit my-windows-host
```

## Verification

After running the playbook, you can manually verify on the Windows host:

```powershell
# Check password history size
secedit /export /cfg $env:TEMP\secpol.cfg
Get-Content $env:TEMP\secpol.cfg | Select-String "PasswordHistorySize"
Remove-Item $env:TEMP\secpol.cfg
```

Or via Group Policy Editor:
1. Open `gpedit.msc`
2. Navigate to: Computer Configuration → Windows Settings → Security Settings → Account Policies → Password Policy
3. Check "Enforce password history" setting

## Troubleshooting

### Connection Issues

If you encounter WinRM connection errors:

1. **Test WinRM connectivity:**
   ```bash
   ansible windows_servers -i inventory.yml -m win_ping
   ```

2. **Check firewall rules:**
   ```powershell
   # On Windows host
   Get-NetFirewallRule -DisplayName "Windows Remote Management*"
   ```

3. **Verify WinRM service:**
   ```powershell
   # On Windows host
   Get-Service WinRM
   ```

### Authentication Issues

- Ensure the user account has Administrator privileges
- For domain environments, use Kerberos authentication
- Check if the account is locked or disabled

### Permission Issues

- The role requires Administrator privileges to modify security policies
- Ensure the `ansible_user` has sufficient permissions

## Continuous Testing

For automated testing, consider:

1. **Molecule** - For role testing framework
2. **GitHub Actions / GitLab CI** - For CI/CD pipeline testing
3. **Test Kitchen** - For infrastructure testing

## Example Test Scenarios

1. **First Run:** Should set password history if not already configured
2. **Second Run:** Should be idempotent (no changes)
3. **Value Change:** Should update if current value is less than required
4. **Already Compliant:** Should report no changes needed
