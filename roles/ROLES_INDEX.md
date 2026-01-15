# Roles Index

This document lists all available roles in the `twanus.wazuh_fixer` collection, along with their corresponding Wazuh check numbers and CIS Benchmark references.

## Password Policy Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26000 | `win_pwd_hist_size` | 1.1.1 | Ensure 'Enforce password history' is set to '24 or more password(s)' |
| 26001 | `win_max_pwd_age` | 1.1.2 | Ensure 'Maximum password age' is set to '365 or fewer days, but not 0' |
| 26002 | `win_min_pwd_age` | 1.1.3 | Ensure 'Minimum password age' is set to '1 or more day(s)' |
| 26003 | `win_min_pwd_length` | 1.1.4 | Ensure 'Minimum password length' is set to '14 or more characters' |
| 26004 | `win_relax_pwd_length_limits` | 1.1.6 | Ensure 'Relax minimum password length limits' is set to 'Enabled' |

## Account Lockout Policy Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26005 | `win_account_lockout_duration` | 1.2.1 | Ensure 'Account lockout duration' is set to '15 or more minute(s)' |
| 26006 | `win_account_lockout_threshold` | 1.2.2 | Ensure 'Account lockout threshold' is set to '5 or fewer invalid logon attempt(s), but not 0' |
| 26007 | `win_account_lockout_reset` | 1.2.4 | Ensure 'Reset account lockout counter after' is set to '15 or more minute(s)' |

## Account Management Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26008 | `win_block_ms_accounts` | 2.3.1.1 | Ensure 'Accounts: Block Microsoft accounts' is set to 'Users can't add or log on with Microsoft accounts' |
| 26009 | `win_guest_account_status` | 2.3.1.2 | Ensure 'Accounts: Guest account status' is set to 'Disabled' |
| 26010 | `win_limit_blank_password_use` | 2.3.1.3 | Ensure 'Accounts: Limit local account use of blank passwords to console logon only' is set to 'Enabled' |
| 26011 | `win_rename_admin_account` | 2.3.1.4 | Configure 'Accounts: Rename administrator account' |
| 26012 | `win_rename_guest_account` | 2.3.1.5 | Configure 'Accounts: Rename guest account' |

## Audit Policy Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26013 | `win_force_audit_subcategory` | 2.3.2.1 | Ensure 'Audit: Force audit policy subcategory settings (Windows Vista or later) to override audit policy category settings' is set to 'Enabled' |
| 26014 | `win_audit_shutdown_on_fail` | 2.3.2.2 | Ensure 'Audit: Shut down system immediately if unable to log security audits' is set to 'Disabled' |
| 26139 | `win_audit_credential_validation` | 17.1.1 | Ensure 'Audit Credential Validation' is set to 'Success and Failure' |
| 26140 | `win_audit_application_group_management` | 17.2.1 | Ensure 'Audit Application Group Management' is set to 'Success and Failure' |
| 26141 | `win_audit_security_group_management` | 17.2.2 | Ensure 'Audit Security Group Management' is set to include 'Success' |
| 26142 | `win_audit_user_account_management` | 17.2.3 | Ensure 'Audit User Account Management' is set to 'Success and Failure' |
| 26143 | `win_audit_pnp_activity` | 17.3.1 | Ensure 'Audit PNP Activity' is set to include 'Success' |
| 26144 | `win_audit_process_creation` | 17.3.2 | Ensure 'Audit Process Creation' is set to include 'Success' |
| 26146 | `win_audit_group_membership` | 17.5.2 | Ensure 'Audit Group Membership' is set to include 'Success' |
| 26147 | `win_audit_logoff` | 17.5.3 | Ensure 'Audit Logoff' is set to include 'Success' |
| 26148 | `win_audit_logon` | 17.5.4 | Ensure 'Audit Logon' is set to 'Success and Failure' |
| 26149 | `win_audit_other_logon_logoff_events` | 17.5.5 | Ensure 'Audit Other Logon/Logoff Events' is set to 'Success and Failure' |
| 26150 | `win_audit_special_logon` | 17.5.6 | Ensure 'Audit Special Logon' is set to include 'Success' |
| 26152 | `win_audit_file_share` | 17.6.2 | Ensure 'Audit File Share' is set to 'Success and Failure' |
| 26153 | `win_audit_other_object_access_events` | 17.6.3 | Ensure 'Audit Other Object Access Events' is set to 'Success and Failure' |
| 26154 | `win_audit_removable_storage` | 17.6.4 | Ensure 'Audit Removable Storage' is set to 'Success and Failure' |
| 26155 | `win_audit_audit_policy_change` | 17.7.1 | Ensure 'Audit Audit Policy Change' is set to include 'Success' |
| 26156 | `win_audit_authentication_policy_change` | 17.7.2 | Ensure 'Audit Authentication Policy Change' is set to include 'Success' |
| 26157 | `win_audit_authorization_policy_change` | 17.7.3 | Ensure 'Audit Authorization Policy Change' is set to include 'Success' |
| 26158 | `win_audit_mpssvc_rule_level_policy_change` | 17.7.4 | Ensure 'Audit MPSSVC Rule-Level Policy Change' is set to 'Success and Failure' |
| 26159 | `win_audit_other_policy_change_events` | 17.7.5 | Ensure 'Audit Other Policy Change Events' is set to include 'Failure' |
| 26160 | `win_audit_sensitive_privilege_use` | 17.8.1 | Ensure 'Audit Sensitive Privilege Use' is set to 'Success and Failure' |
| 26161 | `win_audit_ipsec_driver` | 17.9.1 | Ensure 'Audit IPsec Driver' is set to 'Success and Failure' |
| 26162 | `win_audit_other_system_events` | 17.9.2 | Ensure 'Audit Other System Events' is set to 'Success and Failure' |
| 26163 | `win_audit_security_state_change` | 17.9.3 | Ensure 'Audit Security State Change' is set to include 'Success' |
| 26164 | `win_audit_security_system_extension` | 17.9.4 | Ensure 'Audit Security System Extension' is set to include 'Success' |
| 26165 | `win_audit_system_integrity` | 17.9.5 | Ensure 'Audit System Integrity' is set to 'Success and Failure' |

## Device Management Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26015 | `win_prevent_printer_drivers` | 2.3.4.1 | Ensure 'Devices: Prevent users from installing printer drivers' is set to 'Enabled' |
| 26171 | `win_print_rpc_privacy` | 18.4.2 | Ensure 'Configure RPC packet level privacy setting for incoming connections' is set to 'Enabled' |

## Domain Member Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26016 | `win_domain_encrypt_secure_channel` | 2.3.6.1 | Ensure 'Domain member: Digitally encrypt or sign secure channel data (always)' is set to 'Enabled' |
| 26017 | `win_domain_encrypt_secure_channel_when_possible` | 2.3.6.2 | Ensure 'Domain member: Digitally encrypt secure channel data (when possible)' is set to 'Enabled' |
| 26018 | `win_domain_sign_secure_channel_when_possible` | 2.3.6.3 | Ensure 'Domain member: Digitally sign secure channel data (when possible)' is set to 'Enabled' |
| 26020 | `win_domain_max_machine_pwd_age` | 2.3.6.5 | Ensure 'Domain member: Maximum machine account password age' is set to '30 or fewer days, but not 0' |
| 26021 | `win_domain_require_strong_key` | 2.3.6.6 | Ensure 'Domain member: Require strong (Windows 2000 or later) session key' is set to 'Enabled' |

## Interactive Logon Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26022 | `win_interactive_logon_require_ctrl_alt_del` | 2.3.7.1 | Ensure 'Interactive logon: Do not require CTRL+ALT+DEL' is set to 'Disabled' |
| 26023 | `win_interactive_logon_dont_display_last_user` | 2.3.7.2 | Ensure 'Interactive logon: Don't display last signed-in' is set to 'Enabled' |
| 26024 | `win_interactive_logon_machine_lockout_threshold` | 2.3.7.3 | Ensure 'Interactive logon: Machine account lockout threshold' is set to '10 or fewer invalid logon attempts, but not 0' |
| 26025 | `win_interactive_logon_machine_inactivity_limit` | 2.3.7.4 | Ensure 'Interactive logon: Machine inactivity limit' is set to '900 or fewer second(s), but not 0' |
| 26027 | `win_interactive_logon_message_title` | 2.3.7.6 | Configure 'Interactive logon: Message title for users attempting to log on' |
| 26028 | `win_interactive_logon_cached_logons_count` | 2.3.7.7 | Ensure 'Interactive logon: Number of previous logons to cache (in case domain controller is not available)' is set to '4 or fewer logon(s)' |
| 26029 | `win_interactive_logon_password_expiry_warning` | 2.3.7.8 | Ensure 'Interactive logon: Prompt user to change password before expiration' is set to 'between 5 and 14 days' |
| 26030 | `win_interactive_logon_smart_card_removal` | 2.3.7.9 | Ensure 'Interactive logon: Smart card removal behavior' is set to 'Lock Workstation' or higher |

## Microsoft Network Client Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26031 | `win_ms_network_client_sign_always` | 2.3.8.1 | Ensure 'Microsoft network client: Digitally sign communications (always)' is set to 'Enabled' |
| 26032 | `win_ms_network_client_sign_if_server_agrees` | 2.3.8.2 | Ensure 'Microsoft network client: Digitally sign communications (if server agrees)' is set to 'Enabled' |
| 26033 | `win_ms_network_client_plaintext_password` | 2.3.8.3 | Ensure 'Microsoft network client: Send unencrypted password to third-party SMB servers' is set to 'Disabled' |

## Microsoft Network Server Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26034 | `win_ms_network_server_idle_timeout` | 2.3.9.1 | Ensure 'Microsoft network server: Amount of idle time required before suspending session' is set to '15 or fewer minute(s)' |
| 26035 | `win_ms_network_server_sign_always` | 2.3.9.2 | Ensure 'Microsoft network server: Digitally sign communications (always)' is set to 'Enabled' |
| 26036 | `win_ms_network_server_sign_if_client_agrees` | 2.3.9.3 | Ensure 'Microsoft network server: Digitally sign communications (if client agrees)' is set to 'Enabled' |
| 26037 | `win_ms_network_server_disconnect_logon_hours` | 2.3.9.4 | Ensure 'Microsoft network server: Disconnect clients when logon hours expire' is set to 'Enabled' |
| 26038 | `win_ms_network_server_spn_validation` | 2.3.9.5 | Ensure 'Microsoft network server: Server SPN target name validation level' is set to 'Accept if provided by client' or higher |

## SMB Configuration Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26172 | `win_smb_v1_client_driver_disabled` | 18.4.3 | Ensure 'Configure SMB v1 client driver' is set to 'Enabled: Disable driver (recommended)' |
| 26173 | `win_smb_v1_server_disabled` | 18.4.4 | Ensure 'Configure SMB v1 server' is set to 'Disabled' |

## Network Access Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26039 | `win_network_access_restrict_anonymous_sam` | 2.3.10.2 | Ensure 'Network access: Do not allow anonymous enumeration of SAM accounts' is set to 'Enabled' |
| 26040 | `win_network_access_restrict_anonymous` | 2.3.10.3 | Ensure 'Network access: Do not allow anonymous enumeration of SAM accounts and shares' is set to 'Enabled' |
| 26041 | `win_network_access_disable_cred_storage` | 2.3.10.4 | Ensure 'Network access: Do not allow storage of passwords and credentials for network authentication' is set to 'Enabled' |
| 26042 | `win_network_access_everyone_includes_anonymous` | 2.3.10.5 | Ensure 'Network access: Let Everyone permissions apply to anonymous users' is set to 'Disabled' |
| 26043 | `win_network_access_null_session_pipes` | 2.3.10.6 | Ensure 'Network access: Named Pipes that can be accessed anonymously' is set to 'None' |
| 26044 | `win_network_access_remotely_accessible_registry_paths` | 2.3.10.7 | Ensure 'Network access: Remotely accessible registry paths' is configured |
| 26045 | `win_network_access_remotely_accessible_registry_paths_and_subpaths` | 2.3.10.8 | Ensure 'Network access: Remotely accessible registry paths and sub-paths' is configured |
| 26046 | `win_network_access_restrict_anonymous_access_named_pipes_shares` | 2.3.10.9 | Ensure 'Network access: Restrict anonymous access to Named Pipes and Shares' is set to 'Enabled' |
| 26047 | `win_network_access_restrict_remote_sam` | 2.3.10.10 | Ensure 'Network access: Restrict clients allowed to make remote calls to SAM' is set to 'Administrators: Remote Access: Allow' |
| 26048 | `win_network_access_null_session_shares` | 2.3.10.11 | Ensure 'Network access: Shares that can be accessed anonymously' is set to 'None' |
| 26049 | `win_network_access_sharing_security_model` | 2.3.10.12 | Ensure 'Network access: Sharing and security model for local accounts' is set to 'Classic - local users authenticate as themselves' |

## Network Security Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26050 | `win_network_security_local_system_computer_identity` | 2.3.11.1 | Ensure 'Network security: Allow Local System to use computer identity for NTLM' is set to 'Enabled' |
| 26051 | `win_network_security_allow_localsystem_null_session_fallback` | 2.3.11.2 | Ensure 'Network security: Allow LocalSystem NULL session fallback' is set to 'Disabled' |
| 26052 | `win_network_security_pku2u_allow_online_id` | 2.3.11.3 | Ensure 'Network Security: Allow PKU2U authentication requests to this computer to use online identities' is set to 'Disabled' |
| 26053 | `win_network_security_kerberos_encryption_types` | 2.3.11.4 | Ensure 'Network security: Configure encryption types allowed for Kerberos' is set to 'AES128_HMAC_SHA1, AES256_HMAC_SHA1, Future encryption types' |
| 26054 | `win_network_security_no_lm_hash` | 2.3.11.5 | Ensure 'Network security: Do not store LAN Manager hash value on next password change' is set to 'Enabled' |
| 26055 | `win_network_security_force_logoff_logon_hours_expire` | 2.3.11.6 | Ensure 'Network security: Force logoff when logon hours expire' is set to 'Enabled' |
| 26056 | `win_network_security_lan_manager_auth_level` | 2.3.11.7 | Ensure 'Network security: LAN Manager authentication level' is set to 'Send NTLMv2 response only. Refuse LM & NTLM' |
| 26057 | `win_network_security_ldap_client_signing` | 2.3.11.8 | Ensure 'Network security: LDAP client signing requirements' is set to 'Negotiate signing' or higher |
| 26058 | `win_network_security_minimum_session_security_ntlm_ssp_clients` | 2.3.11.9 | Ensure 'Network security: Minimum session security for NTLM SSP based (including secure RPC) clients' is set to 'Require NTLMv2 session security, Require 128-bit encryption' |
| 26059 | `win_network_security_minimum_session_security_ntlm_ssp_servers` | 2.3.11.10 | Ensure 'Network security: Minimum session security for NTLM SSP based (including secure RPC) servers' is set to 'Require NTLMv2 session security, Require 128-bit encryption' |
| 26060 | `win_network_security_restrict_ntlm_audit_incoming` | 2.3.11.11 | Ensure 'Network security: Restrict NTLM: Audit Incoming NTLM Traffic' is set to 'Enable auditing for all accounts' |
| 26061 | `win_network_security_restrict_ntlm_audit_outgoing` | 2.3.11.12 | Ensure 'Network security: Restrict NTLM: Outgoing NTLM traffic to remote servers' is set to 'Audit all' or higher |

## System Objects Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26062 | `win_system_objects_case_insensitivity` | 2.3.15.1 | Ensure 'System objects: Require case insensitivity for non-Windows subsystems' is set to 'Enabled' |
| 26063 | `win_system_objects_strengthen_default_permissions` | 2.3.15.2 | Ensure 'System objects: Strengthen default permissions of internal system objects (e.g. Symbolic Links)' is set to 'Enabled' |

## User Account Control Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26064 | `win_uac_admin_approval_builtin_admin` | 2.3.17.1 | Ensure 'User Account Control: Admin Approval Mode for the Built-in Administrator account' is set to 'Enabled' |
| 26065 | `win_uac_consent_prompt_behavior_admin` | 2.3.17.2 | Ensure 'User Account Control: Behavior of the elevation prompt for administrators in Admin Approval Mode' is set to 'Prompt for consent on the secure desktop' |
| 26066 | `win_uac_standard_user_elevation_deny` | 2.3.17.3 | Ensure 'User Account Control: Behavior of the elevation prompt for standard users' is set to 'Automatically deny elevation requests' |
| 26067 | `win_uac_detect_app_installations` | 2.3.17.4 | Ensure 'User Account Control: Detect application installations and prompt for elevation' is set to 'Enabled' |
| 26068 | `win_uac_elevate_uiaccess_secure_locations` | 2.3.17.5 | Ensure 'User Account Control: Only elevate UIAccess applications that are installed in secure locations' is set to 'Enabled' |
| 26069 | `win_uac_run_all_admins_in_admin_approval_mode` | 2.3.17.6 | Ensure 'User Account Control: Run all administrators in Admin Approval Mode' is set to 'Enabled' |
| 26070 | `win_uac_secure_desktop_prompt` | 2.3.17.7 | Ensure 'User Account Control: Switch to the secure desktop when prompting for elevation' is set to 'Enabled' |
| 26071 | `win_uac_virtualize_file_registry_write_failures` | 2.3.17.8 | Ensure 'User Account Control: Virtualize file and registry write failures to per-user locations' is set to 'Enabled' |
| 26170 | `win_uac_apply_restrictions_local_accounts_network_logons` | 18.4.1 | Ensure 'Apply UAC restrictions to local accounts on network logons' is set to 'Enabled' |

## System Services Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26072 | `win_bluetooth_audio_gateway_service_disabled` | 5.1 | Ensure 'Bluetooth Audio Gateway Service (BTAGService)' is set to 'Disabled' |
| 26073 | `win_bluetooth_support_service_disabled` | 5.2 | Ensure 'Bluetooth Support Service (bthserv)' is set to 'Disabled' |
| 26074 | `win_computer_browser_service_disabled` | 5.3 | Ensure 'Computer Browser (Browser)' is set to 'Disabled' or 'Not Installed' |
| 26075 | `win_downloaded_maps_manager_disabled` | 5.4 | Ensure 'Downloaded Maps Manager (MapsBroker)' is set to 'Disabled' |
| 26076 | `win_geolocation_service_disabled` | 5.5 | Ensure 'Geolocation Service (lfsvc)' is set to 'Disabled' |
| 26077 | `win_iis_admin_service_disabled` | 5.6 | Ensure 'IIS Admin Service (IISADMIN)' is set to 'Disabled' or 'Not Installed' |
| 26078 | `win_infrared_monitor_service_disabled` | 5.7 | Ensure 'Infrared monitor service (irmon)' is set to 'Disabled' or 'Not Installed' |
| 26079 | `win_link_layer_topology_discovery_mapper_disabled` | 5.8 | Ensure 'Link-Layer Topology Discovery Mapper (lltdsvc)' is set to 'Disabled' |
| 26080 | `win_lxss_manager_service_disabled` | 5.9 | Ensure 'LxssManager (LxssManager)' is set to 'Disabled' or 'Not Installed' |
| 26081 | `win_ftp_service_disabled` | 5.10 | Ensure 'Microsoft FTP Service (FTPSVC)' is set to 'Disabled' or 'Not Installed' |
| 26082 | `win_iscsi_initiator_service_disabled` | 5.11 | Ensure 'Microsoft iSCSI Initiator Service (MSiSCSI)' is set to 'Disabled' |
| 26083 | `win_openssh_ssh_server_disabled` | 5.12 | Ensure 'OpenSSH SSH Server (sshd)' is set to 'Disabled' or 'Not Installed' |
| 26084 | `win_peer_name_resolution_protocol_service_disabled` | 5.13 | Ensure 'Peer Name Resolution Protocol (PNRPsvc)' is set to 'Disabled' or 'Not Installed' |
| 26085 | `win_peer_networking_grouping_disabled` | 5.14 | Ensure 'Peer Networking Grouping (p2psvc)' is set to 'Disabled' |
| 26086 | `win_peer_networking_identity_manager_disabled` | 5.15 | Ensure 'Peer Networking Identity Manager (p2pimsvc)' is set to 'Disabled' |
| 26087 | `win_pnrp_machine_name_publication_service_disabled` | 5.16 | Ensure 'PNRP Machine Name Publication Service (PNRPAutoReg)' is set to 'Disabled' |
| 26088 | `win_print_spooler_service_disabled` | 5.17 | Ensure 'Print Spooler (Spooler)' is set to 'Disabled' |
| 26089 | `win_wercplsupport_disabled` | 5.18 | Ensure 'Problem Reports and Solutions Control Panel Support (wercplsupport)' is set to 'Disabled' |
| 26090 | `win_remote_access_auto_connection_manager_disabled` | 5.19 | Ensure 'Remote Access Auto Connection Manager (RasAuto)' is set to 'Disabled' |
| 26091 | `win_remote_desktop_configuration_service_disabled` | 5.20 | Ensure 'Remote Desktop Configuration (SessionEnv)' is set to 'Disabled' |
| 26092 | `win_remote_desktop_services_disabled` | 5.21 | Ensure 'Remote Desktop Services (TermService)' is set to 'Disabled' |
| 26093 | `win_remote_desktop_services_usermode_port_redirector_disabled` | 5.22 | Ensure 'Remote Desktop Services UserMode Port Redirector (UmRdpService)' is set to 'Disabled' |
| 26094 | `win_rpc_locator_service_disabled` | 5.23 | Ensure 'Remote Procedure Call (RPC) Locator (RpcLocator)' is set to 'Disabled' |
| 26095 | `win_remote_registry_disabled` | 5.24 | Ensure 'Remote Registry (RemoteRegistry)' is set to 'Disabled' |
| 26096 | `win_routing_remote_access_service_disabled` | 5.25 | Ensure 'Routing and Remote Access (RemoteAccess)' is set to 'Disabled' |
| 26097 | `win_server_service_disabled` | 5.26 | Ensure 'Server (LanmanServer)' is set to 'Disabled' |
| 26098 | `win_simple_tcpip_services_disabled` | 5.27 | Ensure 'Simple TCP/IP Services (simptcp)' is set to 'Disabled' or 'Not Installed' |
| 26099 | `win_snmp_service_disabled` | 5.28 | Ensure 'SNMP Service (SNMP)' is set to 'Disabled' or 'Not Installed' |
| 26100 | `win_special_administration_console_helper_disabled` | 5.29 | Ensure 'Special Administration Console Helper (sacsvr)' is set to 'Disabled' or 'Not Installed' |
| 26101 | `win_ssdp_discovery_service_disabled` | 5.30 | Ensure 'SSDP Discovery (SSDPSRV)' is set to 'Disabled' |
| 26102 | `win_upnp_device_host_disabled` | 5.31 | Ensure 'UPnP Device Host (upnphost)' is set to 'Disabled' |
| 26103 | `win_web_management_service_disabled` | 5.32 | Ensure 'Web Management Service (WMSvc)' is set to 'Disabled' or 'Not Installed' |
| 26104 | `win_windows_error_reporting_service_disabled` | 5.33 | Ensure 'Windows Error Reporting Service (WerSvc)' is set to 'Disabled' |
| 26105 | `win_wecsvc_disabled` | 5.34 | Ensure 'Windows Event Collector (Wecsvc)' is set to 'Disabled' |
| 26106 | `win_wmp_network_sharing_service_disabled` | 5.35 | Ensure 'Windows Media Player Network Sharing Service (WMPNetworkSvc)' is set to 'Disabled' or 'Not Installed' |
| 26107 | `win_mobile_hotspot_service_disabled` | 5.36 | Ensure 'Windows Mobile Hotspot Service (icssvc)' is set to 'Disabled' |
| 26108 | `win_windows_push_notifications_system_service_disabled` | 5.37 | Ensure 'Windows Push Notifications System Service (WpnService)' is set to 'Disabled' |
| 26109 | `win_pushtoinstall_service_disabled` | 5.38 | Ensure 'Windows PushToInstall Service (PushToInstall)' is set to 'Disabled' |
| 26110 | `win_winrm_service_disabled` | 5.39 | Ensure 'Windows Remote Management (WS-Management) (WinRM)' is set to 'Disabled' |
| 26111 | `win_world_wide_web_publishing_service_disabled` | 5.40 | Ensure 'World Wide Web Publishing Service (W3SVC)' is set to 'Disabled' or 'Not Installed' |
| 26112 | `win_xbox_accessory_management_service_disabled` | 5.41 | Ensure 'Xbox Accessory Management Service (XboxGipSvc)' is set to 'Disabled' |
| 26113 | `win_xbox_live_auth_manager_disabled` | 5.42 | Ensure 'Xbox Live Auth Manager (XblAuthManager)' is set to 'Disabled' |
| 26114 | `win_xbox_live_game_save_disabled` | 5.43 | Ensure 'Xbox Live Game Save (XblGameSave)' is set to 'Disabled' |
| 26115 | `win_xbox_live_networking_service_disabled` | 5.44 | Ensure 'Xbox Live Networking Service (XboxNetApiSvc)' is set to 'Disabled' |


## Windows Firewall Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26116 | `win_firewall_domain_state` | 9.1.1 | Ensure 'Windows Firewall: Domain: Firewall state' is set to 'On (recommended)' |
| 26117 | `win_firewall_domain_inbound_connections` | 9.1.2 | Ensure 'Windows Firewall: Domain: Inbound connections' is set to 'Block (default)' |
| 26118 | `win_firewall_domain_disable_notifications` | 9.1.3 | Ensure 'Windows Firewall: Domain: Settings: Display a notification' is set to 'No' |
| 26119 | `win_firewall_domain_logging_name` | 9.1.4 | Ensure 'Windows Firewall: Domain: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\domainfw.log' |
| 26120 | `win_firewall_domain_logging_size_limit` | 9.1.5 | Ensure 'Windows Firewall: Domain: Logging: Size limit (KB)' is set to '16,384 KB or greater' |
| 26121 | `win_firewall_domain_logging_dropped_packets` | 9.1.6 | Ensure 'Windows Firewall: Domain: Logging: Log dropped packets' is set to 'Yes' |
| 26122 | `win_firewall_domain_logging_successful_connections` | 9.1.7 | Ensure 'Windows Firewall: Domain: Logging: Log successful connections' is set to 'Yes' |
| 26123 | `win_firewall_private_state` | 9.2.1 | Ensure 'Windows Firewall: Private: Firewall state' is set to 'On (recommended)' |
| 26124 | `win_firewall_private_inbound_connections` | 9.2.2 | Ensure 'Windows Firewall: Private: Inbound connections' is set to 'Block (default)' |
| 26125 | `win_firewall_private_disable_notifications` | 9.2.3 | Ensure 'Windows Firewall: Private: Settings: Display a notification' is set to 'No' |
| 26126 | `win_firewall_private_logging_name` | 9.2.4 | Ensure 'Windows Firewall: Private: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\privatefw.log' |
| 26127 | `win_firewall_private_logging_size_limit` | 9.2.5 | Ensure 'Windows Firewall: Private: Logging: Size limit (KB)' is set to '16,384 KB or greater' |
| 26128 | `win_firewall_private_logging_dropped_packets` | 9.2.6 | Ensure 'Windows Firewall: Private: Logging: Log dropped packets' is set to 'Yes' |
| 26129 | `win_firewall_private_logging_successful_connections` | 9.2.7 | Ensure 'Windows Firewall: Private: Logging: Log successful connections' is set to 'Yes' |
| 26130 | `win_firewall_public_state` | 9.3.1 | Ensure 'Windows Firewall: Public: Firewall state' is set to 'On (recommended)' |
| 26131 | `win_firewall_public_inbound_connections` | 9.3.2 | Ensure 'Windows Firewall: Public: Inbound connections' is set to 'Block (default)' |
| 26132 | `win_firewall_public_disable_notifications` | 9.3.3 | Ensure 'Windows Firewall: Public: Settings: Display a notification' is set to 'No' |
| 26133 | `win_firewall_public_apply_local_firewall_rules` | 9.3.4 | Ensure 'Windows Firewall: Public: Settings: Apply local firewall rules' is set to 'No' |
| 26134 | `win_firewall_public_apply_local_connection_security_rules` | 9.3.5 | Ensure 'Windows Firewall: Public: Settings: Apply local connection security rules' is set to 'No' |
| 26135 | `win_firewall_public_logging_name` | 9.3.6 | Ensure 'Windows Firewall: Public: Logging: Name' is set to '%SystemRoot%\System32\logfiles\firewall\publicfw.log' |
| 26136 | `win_firewall_public_logging_size_limit` | 9.3.7 | Ensure 'Windows Firewall: Public: Logging: Size limit (KB)' is set to '16,384 KB or greater' |
| 26137 | `win_firewall_public_logging_dropped_packets` | 9.3.8 | Ensure 'Windows Firewall: Public: Logging: Log dropped packets' is set to 'Yes' |
| 26138 | `win_firewall_public_logging_successful_connections` | 9.3.9 | Ensure 'Windows Firewall: Public: Logging: Log successful connections' is set to 'Yes' |

## Personalization Roles

| Wazuh Check | Role Name | CIS Benchmark | Description |
|-------------|-----------|---------------|-------------|
| 26166 | `win_prevent_lock_screen_camera` | 18.1.1.1 | Ensure 'Prevent enabling lock screen camera' is set to 'Enabled' |
| 26167 | `win_prevent_lock_screen_slideshow` | 18.1.1.2 | Ensure 'Prevent enabling lock screen slide show' is set to 'Enabled' |
| 26168 | `win_online_speech_recognition_disabled` | 18.1.2.2 | Ensure 'Allow users to enable online speech recognition services' is set to 'Disabled' |
| 26169 | `win_allow_online_tips_disabled` | 18.1.3 | Ensure 'Allow Online Tips' is set to 'Disabled' |

## Summary

**Total Roles**: 153

- **Password Policy**: 5 roles
- **Account Lockout Policy**: 3 roles
- **Account Management**: 5 roles
- **Audit Policy**: 20 roles
- **Device Management**: 2 roles
- **Domain Member**: 5 roles
- **Interactive Logon**: 8 roles
- **Microsoft Network Client**: 3 roles
- **Microsoft Network Server**: 5 roles
- **SMB Configuration**: 2 roles
- **Network Access**: 11 roles
- **Network Security**: 12 roles
- **Windows Firewall**: 21 roles
- **Personalization**: 4 roles
- **System Objects**: 2 roles
- **User Account Control**: 9 roles
- **System Services**: 43 roles

## Usage

To use any of these roles in a playbook, reference them using the collection format:

```yaml
---
- name: Apply CIS Benchmarks
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: twanus.wazuh_fixer.win_pwd_hist_size
    - role: twanus.wazuh_fixer.win_max_pwd_age
    # ... etc
```

Or use the development path (for testing before building the collection):

```yaml
---
- name: Apply CIS Benchmarks
  hosts: windows
  gather_facts: true
  become: false
  roles:
    - role: ../roles/win_pwd_hist_size  # noqa role-name[path]
    - role: ../roles/win_max_pwd_age  # noqa role-name[path]
    # ... etc
```

## Notes

- Roles with "N/A" for Wazuh Check may not have been assigned a specific Wazuh check number yet, or they may use a different numbering scheme.
- All roles are idempotent and can be run multiple times safely.
- Each role includes comprehensive documentation in its `README.md` file.
- Test playbooks are available in the `playbooks/` directory for each role.
