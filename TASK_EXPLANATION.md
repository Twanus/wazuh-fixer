# Task Explanation: Creating Ansible Roles for CIS Windows Benchmark Remediation

## Overview

You are tasked with creating Ansible roles that remediate specific CIS (Center for Internet Security) Windows Benchmark checks. Each role is part of the `twanus.wazuh_fixer` Ansible collection and addresses a specific security configuration requirement for Windows systems.

## Input Format

For each task, you will receive:
1. **Check Number** (e.g., 26044, 26045, 26046) - This is the Wazuh check number
2. **Title** - The CIS Benchmark check title
3. **Registry/Command Path** - The Windows registry path or command used to check the setting
4. **Rationale** - Explanation of why this setting is important
5. **Remediation** - Steps to configure the setting
6. **Description** - Detailed description of the policy setting
7. **Checks (Condition)** - The validation logic (e.g., "Condition: all", "Condition: any") and specific registry values/commands
8. **Compliance** - Compliance mappings (e.g., `cis: 2.3.10.7`)

## Expected Output

For each CIS check, create a complete Ansible role with the following structure:

### Role Structure

```
roles/win_{descriptive_role_name}/
├── tasks/main.yml           # Main tasks that check and apply the setting
├── defaults/main.yml        # Default variables for the role
├── meta/main.yml           # Role metadata (author, description, tags, dependencies)
├── README.md               # Comprehensive documentation
└── handlers/main.yml       # (Optional) Handlers if needed for verification
```

### Key Requirements

1. **Idempotency**: The role must be idempotent - running it multiple times should produce the same result without unnecessary changes.

2. **Naming Convention**: 
   - Role names use snake_case with `win_` prefix
   - Variable names must be prefixed with the role name (e.g., `win_role_name_setting_name`)
   - Register variables must also use the role prefix

3. **Registry-Based Settings**:
   - Use `ansible.windows.win_regedit` module for registry modifications
   - Use `ansible.windows.win_shell` with PowerShell to check current values
   - Handle different registry value types: `REG_DWORD`, `REG_SZ`, `REG_MULTI_SZ`

4. **Password/Account Policy Settings**:
   - May use `net accounts` command or `secedit` via PowerShell
   - Handle temporary file paths (use `C:\Windows\Temp` for system accessibility)
   - Use `/quiet` flag with `secedit` to suppress prompts

5. **Account Management**:
   - Use WMI/CIM queries to find accounts by SID
   - Use PowerShell cmdlets like `Disable-LocalUser`, `Rename-LocalUser`
   - Check for well-known account names (Administrator, Guest, etc.)

6. **Role Tasks Pattern**:
   ```yaml
   - name: Check current setting
     ansible.windows.win_shell: |
       # PowerShell to check registry/command
     register: role_name_current_setting
     changed_when: false

   - name: Display current setting
     ansible.builtin.debug:
       msg: "Current setting: {{ role_name_current_setting.stdout | trim }}"

   - name: Set setting to required value
     ansible.windows.win_regedit:  # or win_shell for commands
       # Configuration
     register: role_name_apply_setting
     when: condition_to_check_if_change_needed
     changed_when: true

   - name: Report if no changes were needed
     ansible.builtin.debug:
       msg: "Setting already configured correctly"
     when: setting_already_correct
   ```

7. **Default Variables**:
   - Define in `defaults/main.yml`
   - Use descriptive names with role prefix
   - Include comments explaining the CIS Benchmark requirement

8. **Metadata**:
   - Include CIS Benchmark number and Wazuh check number in description
   - Add relevant tags (security, wazuh, hardening, cis, windows, etc.)
   - Specify platform compatibility (Windows, all versions)

9. **Documentation**:
   - Comprehensive README.md with:
     - Description and rationale
     - Requirements
     - Role variables table
     - Example playbooks (collection format and development path)
     - Registry/command details
     - Verification instructions
     - Idempotency notes
     - Security benefits and notes

10. **Test Playbook (REQUIRED)**:
    - **MUST CREATE** a test playbook in `playbooks/test-windows-{role-name}-dev.yml`
    - Use relative path for development: `../roles/win_role_name  # noqa role-name[path]`
    - Include post_tasks for verification message
    - **MUST EXECUTE** the playbook by running: `source .venv/bin/activate && ansible-playbook -i inventory.ini playbooks/test-windows-{role-name}-dev.yml`
    - **CRITICAL**: You MUST actually RUN the playbook against the Windows VM - creating the playbook is NOT sufficient
    - The playbook MUST execute successfully (exit code 0, no task failures)
    - **MUST VERIFY idempotency** by running the playbook twice - second run should show `changed=0`
    - Fix any errors before considering the task complete
    - Do NOT mark the task as complete until the playbook executes successfully

11. **ROLES_INDEX.md Update**:
    - Add new role to appropriate category table
    - Include: Role Name, Wazuh Check, CIS Benchmark, Description
    - Update total role count
    - Update category count

## Technical Patterns

### Registry DWORD Values
```yaml
- name: Set registry DWORD value
  ansible.windows.win_regedit:
    path: HKLM:\Path\To\Key
    name: ValueName
    data: "{{ role_name_value }}"
    type: dword
```

### Registry String Values
```yaml
- name: Set registry string value
  ansible.windows.win_regedit:
    path: HKLM:\Path\To\Key
    name: ValueName
    data: "{{ role_name_string_value }}"
    type: string
```

### Registry Multistring Values (REG_MULTI_SZ)
```yaml
- name: Set registry multistring value
  ansible.windows.win_regedit:
    path: HKLM:\Path\To\Key
    name: ValueName
    data: "{{ role_name_multistring_list }}"
    type: multistring
```
Note: For multistring, use a YAML list in defaults/main.yml with single quotes for paths with backslashes.

### Removing Registry Values (set to None/absent)
```yaml
- name: Remove registry value
  ansible.windows.win_regedit:
    path: HKLM:\Path\To\Key
    name: ValueName
    state: absent
```

### Using secedit for Security Policies
```yaml
- name: Set security policy using secedit
  ansible.windows.win_shell: |
    secedit /export /cfg C:\Windows\Temp\secpol.cfg 2>&1 | Out-Null
    # Modify config file
    secedit /configure /db C:\Windows\Temp\secpol.sdb /cfg C:\Windows\Temp\secpol.cfg /quiet 2>&1 | Out-Null
    Remove-Item C:\Windows\Temp\secpol.* -ErrorAction SilentlyContinue
```

### Using net accounts for Password Policies
```yaml
- name: Set password policy using net accounts
  ansible.windows.win_shell: |
    net accounts /uniquepw:{{ role_name_value }} 2>&1
    if ($LASTEXITCODE -ne 0) {
      Write-Error "Failed to set policy. Exit code: $LASTEXITCODE"
      exit $LASTEXITCODE
    }
```

### Checking Arrays/Collections in PowerShell
For REG_MULTI_SZ values:
```powershell
if ($value -is [System.Array]) {
  $result = ($value | Sort-Object) -join "|"
} else {
  $result = $value.ToString()
}
```

## Codebase Context

- **Collection**: `twanus.wazuh_fixer`
- **Location**: `/home/jacko/ansible/twanus/wazuh_fixer/`
- **Inventory**: `inventory.ini` (Windows target with WinRM)
- **Dependencies**: `ansible.windows` collection (>=3.3.0), `pywinrm` Python library
- **Testing**: Use development playbooks with relative paths before building collection
- **Linting**: Ensure no Ansible lint errors (variable prefixes, handler usage, naming conventions)

## Quality Checklist

- [ ] Role is idempotent
- [ ] All variables use role name prefix
- [ ] Registry paths are correct
- [ ] Value types match (dword, string, multistring)
- [ ] PowerShell scripts handle errors and null values
- [ ] README.md is comprehensive
- [ ] **Test playbook CREATED** (`playbooks/test-windows-{role-name}-dev.yml`)
- [ ] **Test playbook ACTUALLY EXECUTED** (ansible-playbook command was run against the VM)
- [ ] **Test playbook EXECUTED successfully** (exit code 0, no task failures in PLAY RECAP)
- [ ] **Idempotency VERIFIED** (second run shows `changed=0` in PLAY RECAP)
- [ ] **All errors FIXED** before completion
- [ ] ROLES_INDEX.md updated
- [ ] No linter errors
- [ ] Handles "NOT_SET" or missing values appropriately
- [ ] Comparison logic handles different ordering (for arrays/lists)

**IMPORTANT: The test playbook creation and execution are MANDATORY steps. Do not skip them.**

## Example Workflow

1. Receive CIS check details (check number, title, registry path, rationale, etc.)
2. Create role directory structure
3. Write tasks/main.yml following the pattern
4. Write defaults/main.yml with appropriate defaults
5. Write meta/main.yml with metadata
6. Write comprehensive README.md
7. **CREATE test playbook** (`playbooks/test-windows-{role-name}-dev.yml`)
8. Run linter check (`read_lints`)
9. **EXECUTE the test playbook** by running: `source .venv/bin/activate && ansible-playbook -i inventory.ini playbooks/test-windows-{role-name}-dev.yml`
   - **CRITICAL**: You MUST actually EXECUTE the playbook against the Windows VM - just creating it is NOT enough
   - Activate the virtual environment first to ensure correct Python/Ansible versions
   - The playbook MUST execute successfully (exit code 0, no task failures)
   - Check the output to verify the role behaves correctly
10. **VERIFY** the playbook executed successfully (exit code 0, no errors)
11. **VERIFY idempotency** - run the playbook a second time and confirm `changed=0` in the PLAY RECAP
12. **FIX any errors** found during testing
13. Update ROLES_INDEX.md
14. **ONLY after successful execution and verification**, consider the task complete

## CRITICAL: Testing Requirements

**YOU MUST TEST EVERY ROLE YOU CREATE. DO NOT SKIP TESTING.**

### Testing Steps (Required):

1. **Create the test playbook**:
   ```yaml
   ---
   # Test playbook for win_role_name role (Development)
   # Usage: ansible-playbook -i ../inventory.ini playbooks/test-windows-role-name-dev.yml
   
   - name: Test Windows Role Name Role (Development)
     hosts: windows
     gather_facts: true
     become: false
     roles:
       - role: ../roles/win_role_name  # noqa role-name[path]
     post_tasks:
       - name: Verify role completed successfully
         ansible.builtin.debug:
           msg: "Role execution completed. Check the output above for configuration."
   ```

2. **EXECUTE the test playbook** (REQUIRED - do not skip this step):
   ```bash
   cd /home/jacko/ansible/twanus/wazuh_fixer
   source .venv/bin/activate
   ansible-playbook -i inventory.ini playbooks/test-windows-role-name-dev.yml
   ```
   - **CRITICAL**: You MUST actually RUN this command - creating the playbook file is NOT sufficient
   - **Important**: Activate the virtual environment first to ensure the correct Python/Ansible versions are used
   - This MUST be executed against the Windows VM (defined in inventory.ini) to verify the role works
   - Wait for the playbook to complete and check the output
   - Exit code must be 0 with no task failures
   - The PLAY RECAP should show no failures

3. **Verify success**:
   - Exit code must be 0
   - No task failures
   - Check output for expected behavior

4. **Verify idempotency**:
   - Run the playbook a second time
   - Second run should show `changed=0` for tasks that set values
   - Should report "already configured correctly" or similar message

5. **Fix any errors**:
   - If the playbook fails, fix the issues
   - Re-test until it passes
   - Do not consider the task complete until testing passes

### Testing is NOT Optional

- ❌ **DO NOT** skip creating the test playbook
- ❌ **DO NOT** skip EXECUTING the test playbook - creating the file is NOT enough
- ❌ **DO NOT** mark the task as complete without actually running the playbook
- ❌ **DO NOT** mark the task as complete without successful execution (exit code 0)
- ✅ **MUST** create the test playbook
- ✅ **MUST** EXECUTE the playbook against the Windows VM (run the ansible-playbook command)
- ✅ **MUST** verify the playbook executes successfully (exit code 0, no failures)
- ✅ **MUST** verify idempotency by running it twice (second run shows changed=0)
- ✅ **MUST** fix errors before completion

## Notes

- The check condition type matters:
  - `Condition: all` - All specified values must be present (e.g., all paths in a multistring)
  - `Condition: any` - Any one of the conditions satisfies (e.g., value doesn't exist OR equals specific value)
- Some checks allow "NOT_SET" as compliant, but explicitly setting the value is preferred
- Always use single quotes for YAML strings containing backslashes (registry paths)
- For multistring comparisons, sort both current and expected values before comparing
- Use descriptive, searchable role names that clearly indicate the setting being configured
