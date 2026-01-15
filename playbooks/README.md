# Playbooks

This directory contains example playbooks for testing and using the roles in this collection.

## Test Playbooks

### test-windows-password-history-dev.yml

**Development playbook** - Uses the role directly from the `roles/` directory without requiring the collection to be built/installed. Use this for quick testing during development.

**Usage:**
```bash
ansible-playbook -i ../inventory.ini playbooks/test-windows-password-history-dev.yml
```

**Advantages:**
- No need to build/install the collection
- Faster iteration during development
- Uses relative path: `../roles/win_pwd_hist_size`

### test-windows-password-history.yml

**Production playbook** - Uses the role via the collection format. Use this to test the collection after building/installing it.

**Usage:**
```bash
# First, build and install the collection:
ansible-galaxy collection build
ansible-galaxy collection install twanus-wazuh_fixer-*.tar.gz

# Then run the playbook:
ansible-playbook -i ../inventory.ini playbooks/test-windows-password-history.yml
```

**Advantages:**
- Tests the collection format (how users will use it)
- Uses collection format: `twanus.wazuh_fixer.win_pwd_hist_size`

### Common Options

**With extra variables:**
```bash
ansible-playbook -i ../inventory.ini playbooks/test-windows-password-history-dev.yml -e "win_pwd_hist_size_password_history_size=24"
```

**With verbose output:**
```bash
ansible-playbook -i ../inventory.ini playbooks/test-windows-password-history-dev.yml -v
```

## Prerequisites

1. **Install required collections:**
   ```bash
   ansible-galaxy collection install ansible.windows
   ```

2. **Configure WinRM on Windows hosts:**
   - WinRM must be enabled and configured on target Windows hosts
   - For domain-joined machines, Kerberos authentication is recommended
   - For workgroup machines, use NTLM authentication

3. **Inventory configuration:**
   - Update `../inventory.ini` (or `../inventory.yml`) with your Windows host details
   - Ensure proper credentials and connection settings

## Security Notes

- Never commit passwords to version control
- Consider using secure credential management solutions or environment variables for sensitive data
- Consider using SSH keys or certificate-based authentication where possible
