# QTrack - User Roles & Test Accounts Guide

## Overview

This document provides comprehensive guidance on **user roles, permissions, and test accounts** for the QTrack Quality Assurance management system. It serves as a reference for developers, QA engineers, and system administrators to understand role-based access control and testing scenarios.

## Role-Based Access Control Architecture

### Role Hierarchy Structure

```
ADMIN (System Administrator)
    ├── Full system access and configuration
    ├── User management and system settings
    └── Complete CRUD operations on all entities

MANAGER (Team/Project Manager)
    ├── Team oversight and project management
    ├── Advanced reporting and analytics
    └── Resource allocation and planning

QA (Quality Assurance Engineer)
    ├── Test case creation and execution
    ├── Quality metrics and reporting
    └── Bug tracking and verification

DEV (Developer)
    ├── Ticket resolution and updates
    ├── Code-related collaboration
    └── Limited test case viewing

USER (Basic User/Stakeholder)
    ├── Ticket creation and viewing
    ├── Basic reporting access
    └── Read-only project information
```

---

## Detailed Role Specifications

### ADMIN - System Administrator Role

**Purpose:** Complete system administration with unrestricted access to all features and configurations

#### Core Responsibilities
- **System Configuration:** Complete control over system settings, integrations, and configurations
- **User Management:** Create, modify, and deactivate user accounts with role assignments
- **Data Administration:** Full CRUD operations on all entities including tickets, projects, and test cases
- **Analytics & Reporting:** Access to all system analytics, performance metrics, and compliance reports
- **Security Management:** Audit trail access, security configuration, and compliance monitoring

#### Functional Capabilities
- **Ticket Management:** Complete lifecycle management including creation, assignment, resolution, and deletion
- **Project Administration:** Project creation, configuration, team assignment, and resource allocation
- **Test Case Management:** Full test suite administration including creation, execution, and result analysis
- **System Maintenance:** Database management, backup procedures, and system optimization
- **Integration Management:** External tool integrations and API configuration

#### Test Account Portfolio

| Account Email | Password | Specialization | 2FA Status | Usage Purpose |
|---------------|----------|----------------|------------|---------------|
| `admin@qtrack.com` | `admin123` | System Administration | Enabled | General admin testing |
| `superadmin@qtrack.com` | `admin123` | Super Administrator | Enabled | High-privilege testing |

### MANAGER - Team/Project Manager Role

**Purpose:** Team leadership and project oversight with focus on resource management and strategic planning

#### Core Responsibilities
- **Team Management:** Team member oversight, performance tracking, and capacity planning
- **Project Oversight:** Project timeline management, milestone tracking, and deliverable coordination
- **Resource Allocation:** Task assignment, workload distribution, and priority management
- **Reporting & Analytics:** Team performance metrics, project health dashboards, and executive reporting
- **Quality Governance:** Quality standard enforcement and process improvement initiatives

#### Functional Capabilities
- **Ticket Assignment:** Advanced ticket routing and team member assignment capabilities
- **Project Planning:** Project timeline creation, milestone definition, and resource planning
- **Team Analytics:** Performance dashboards, productivity metrics, and capacity analysis
- **Quality Metrics:** Test coverage analysis, defect trending, and quality gate monitoring
- **Stakeholder Communication:** Executive reporting, status updates, and escalation management

#### Test Account Portfolio

| Account Email | Password | Specialization | Team Focus | Usage Purpose |
|---------------|----------|----------------|------------|---------------|
| `qa.manager@qtrack.com` | `manager123` | QA Team Management | Quality Assurance | QA team leadership testing |
| `project.manager@qtrack.com` | `manager123` | Project Management | Cross-functional | Project coordination testing |
| `team.lead@qtrack.com` | `manager123` | Technical Leadership | Development Teams | Team lead workflow testing |

### QA - Quality Assurance Engineer Role

**Purpose:** Comprehensive testing and quality assurance with focus on test execution and quality metrics

#### Core Responsibilities
- **Test Case Development:** Test case creation, maintenance, and optimization for comprehensive coverage
- **Test Execution:** Manual and automated test execution with detailed result documentation
- **Quality Metrics:** Quality dashboard monitoring, defect tracking, and coverage analysis
- **Bug Management:** Defect identification, documentation, verification, and closure
- **Process Improvement:** Testing methodology enhancement and best practice implementation

#### Functional Capabilities
- **Test Suite Management:** Complete test suite lifecycle including creation, organization, and execution
- **Defect Lifecycle:** Bug reporting, tracking, verification, and closure with detailed documentation
- **Quality Reporting:** Test execution reports, coverage analysis, and quality trend monitoring
- **Collaboration Tools:** Developer collaboration, stakeholder communication, and knowledge sharing
- **Automation Integration:** Test automation tool integration and automated test result analysis

#### Test Account Portfolio

| Account Email | Password | Specialization | Focus Area | Usage Purpose |
|---------------|----------|----------------|------------|---------------|
| `senior.qa@qtrack.com` | `qa123` | Senior QA Engineer | Test Strategy | Advanced QA workflow testing |
| `qa.analyst@qtrack.com` | `qa123` | QA Analyst | Requirements Analysis | Analytical testing scenarios |
| `automation.tester@qtrack.com` | `qa123` | Test Automation | Automation Frameworks | Automated testing workflows |
| `manual.tester@qtrack.com` | `qa123` | Manual Testing | Exploratory Testing | Manual testing procedures |
| `performance.tester@qtrack.com` | `qa123` | Performance Testing | Load/Stress Testing | Performance testing scenarios |

### DEV - Developer Role

**Purpose:** Development-focused access with emphasis on ticket resolution and technical collaboration

#### Core Responsibilities
- **Ticket Resolution:** Bug fixing, feature implementation, and technical task completion
- **Code Collaboration:** Technical discussions, code review participation, and knowledge sharing
- **Documentation:** Technical documentation, implementation notes, and solution documentation
- **Quality Participation:** Developer testing, code quality assurance, and peer review
- **Technical Communication:** Cross-team collaboration and technical requirement clarification

#### Functional Capabilities
- **Ticket Management:** Ticket viewing, status updates, comment addition, and resolution marking
- **Collaboration Tools:** Team communication, technical discussions, and knowledge sharing
- **Limited Analytics:** Personal productivity metrics and assigned task tracking
- **Documentation Access:** Technical documentation viewing and contribution
- **Integration Tools:** Development tool integration and workflow optimization

#### Test Account Portfolio

| Account Email | Password | Specialization | Technology Focus | Usage Purpose |
|---------------|----------|----------------|-----------------|---------------|
| `senior.dev@qtrack.com` | `dev123` | Senior Developer | Full Stack | Senior developer workflows |
| `frontend.dev@qtrack.com` | `dev123` | Frontend Developer | UI/UX Development | Frontend-specific testing |
| `backend.dev@qtrack.com` | `dev123` | Backend Developer | API/Database | Backend development testing |
| `fullstack.dev@qtrack.com` | `dev123` | Full Stack Developer | End-to-End | Complete development cycle testing |

### USER - Basic User/Stakeholder Role

**Purpose:** Limited access for business stakeholders with focus on visibility and basic interactions

#### Core Responsibilities
- **Ticket Creation:** Issue reporting, feature requests, and business requirement documentation
- **Project Visibility:** Project status monitoring, milestone tracking, and deliverable awareness
- **Communication:** Stakeholder feedback, requirement clarification, and business input
- **Reporting Access:** Basic reporting capabilities and project health visibility
- **Quality Feedback:** User acceptance feedback and quality validation from business perspective

#### Functional Capabilities
- **Ticket Operations:** Ticket creation, viewing, and comment addition with limited editing
- **Project Monitoring:** Read-only access to project information and status updates
- **Basic Reporting:** Access to summary reports and project dashboards
- **Communication Tools:** Comment systems and feedback mechanisms
- **Documentation Access:** Read-only access to user documentation and guides

#### Test Account Portfolio

| Account Email | Password | Role Type | Business Function | Usage Purpose |
|---------------|----------|-----------|------------------|---------------|
| `business.analyst@qtrack.com` | `user123` | Business Analyst | Requirements Analysis | Business analysis workflows |
| `product.owner@qtrack.com` | `user123` | Product Owner | Product Management | Product ownership testing |
| `stakeholder@qtrack.com` | `user123` | Business Stakeholder | Executive Oversight | Stakeholder visibility testing |

---

## Special Purpose Test Accounts

### Demonstration and Training Accounts

#### Demo Account Configuration
**Account:** `demo@qtrack.com` / `demo123`
- **Role:** QA (Quality Assurance Engineer)
- **Purpose:** Product demonstrations, training sessions, and external presentations
- **Features:** Pre-populated with sample data, optimized for demonstration scenarios
- **Restrictions:** Limited data modification capabilities, reset daily

#### Training Environment Account
**Account:** `training@qtrack.com` / `training123`
- **Role:** Rotational (configurable for training purposes)
- **Purpose:** User onboarding, feature training, and skill development
- **Features:** Sandbox environment with guided tutorials and training materials
- **Reset Schedule:** Weekly reset with fresh training data

### Testing Scenario Accounts

#### Inactive User Testing
**Account:** `inactive.user@qtrack.com` / `user123`
- **Status:** Inactive/Disabled
- **Purpose:** Testing inactive user scenarios, access control validation, and system behavior
- **Test Scenarios:** Login prevention, session handling, and reactivation procedures

#### Pending Activation Account
**Account:** `pending.user@qtrack.com` / `user123`
- **Status:** Pending Email Verification
- **Purpose:** Testing account activation workflows and email verification processes
- **Test Scenarios:** Email verification, account activation, and onboarding flows

---

## Comprehensive Permission Matrix

### Feature Access Control Matrix

| Feature Category | ADMIN | MANAGER | QA | DEV | USER | Implementation Notes |
|------------------|-------|---------|----|----|------|-------------------|
| **Ticket Management** |
| tickets.create | ✅ All | ✅ Team | ✅ Yes | ❌ No | ✅ Limited | Users can create but not assign |
| tickets.read | ✅ All | ✅ Team | ✅ Assigned | ✅ Assigned | ✅ Created | Role-based visibility filtering |
| tickets.update | ✅ All | ✅ Team | ✅ Assigned | ✅ Assigned | ❌ No | Status-dependent permissions |
| tickets.delete | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No | Admin-only destructive operations |
| tickets.assign | ✅ All | ✅ Team | ❌ No | ❌ No | ❌ No | Management-level responsibility |
| tickets.resolve | ✅ All | ❌ No | ❌ No | ✅ Assigned | ❌ No | Developer resolution authority |
| tickets.reopen | ✅ All | ✅ Team | ✅ Yes | ❌ No | ❌ No | Quality control measure |
| **User Management** |
| users.create | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Admin-only user provisioning |
| users.read | ✅ All | ✅ Team | ✅ Team | ✅ Team | ❌ No | Team visibility only |
| users.update | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No | Admin-only user modification |
| users.deactivate | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Admin-only access control |
| **Project Management** |
| projects.create | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Strategic-level decision |
| projects.read | ✅ All | ✅ Assigned | ✅ Assigned | ✅ Assigned | ✅ Stakeholder | Project-based access |
| projects.update | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No | Admin configuration only |
| projects.archive | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Admin lifecycle management |
| **Test Case Management** |
| test-cases.create | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No | QA expertise required |
| test-cases.read | ✅ All | ✅ Team | ✅ Yes | ✅ Limited | ❌ No | Development collaboration |
| test-cases.execute | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No | Testing specialization |
| test-cases.update | ✅ Yes | ❌ No | ✅ Owner | ❌ No | ❌ No | Test case ownership |
| test-cases.delete | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Admin data protection |
| **Test Suite Management** |
| test-suites.create | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No | QA organization capability |
| test-suites.manage | ✅ Yes | ❌ No | ✅ Owner | ❌ No | ❌ No | Suite ownership model |
| test-suites.execute | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No | Testing execution authority |
| **Analytics & Reporting** |
| analytics.basic | ✅ Yes | ✅ Team | ✅ Personal | ✅ Personal | ✅ Limited | Role-appropriate insights |
| analytics.advanced | ✅ Yes | ✅ Team | ❌ No | ❌ No | ❌ No | Management decision support |
| analytics.executive | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Strategic-level reporting |
| reports.export | ✅ All | ✅ Team | ✅ Personal | ✅ Personal | ❌ No | Data export capabilities |
| **System Administration** |
| system.settings | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | System configuration |
| system.audit | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Security and compliance |
| system.backup | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | Data protection |
| system.integration | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | External system management |

---

## Testing Scenarios and Validation

### Authentication Testing Scenarios

#### Login Flow Validation
**Test Cases:**
- **TC_AUTH_001:** Valid credentials login for each role type
- **TC_AUTH_002:** Invalid credentials handling and error messaging
- **TC_AUTH_003:** Account lockout after multiple failed attempts
- **TC_AUTH_004:** Password reset functionality for all role types
- **TC_AUTH_005:** Two-factor authentication flow validation

#### Role-Based Access Control Testing
**Test Cases:**
- **TC_RBAC_001:** Role assignment and permission inheritance validation
- **TC_RBAC_002:** Unauthorized access prevention and error handling
- **TC_RBAC_003:** Permission boundary testing for each role
- **TC_RBAC_004:** Role transition testing and permission updates
- **TC_RBAC_005:** Session management and role-based timeout handling

#### Session Management Testing
**Test Cases:**
- **TC_SESSION_001:** Session timeout behavior for different roles
- **TC_SESSION_002:** Concurrent session handling across devices
- **TC_SESSION_003:** Session hijacking prevention and security validation
- **TC_SESSION_004:** Automatic logout after inactivity periods
- **TC_SESSION_005:** Session persistence across browser restarts

### Permission Validation Testing

#### Feature Access Testing
**Systematic Validation:**
- **Permission Matrix Verification:** Each role's access to features matches defined permissions
- **UI Element Visibility:** Interface elements show/hide appropriately based on user role
- **API Endpoint Security:** Backend API enforces role-based access control
- **Data Filtering:** Users see only data appropriate to their role and assignments
- **Error Handling:** Graceful handling of unauthorized access attempts

#### Workflow Integration Testing
**Cross-Role Collaboration:**
- **Ticket Lifecycle Testing:** Complete ticket workflow with role interactions
- **Assignment Workflows:** Manager assignment to QA and Developer roles
- **Escalation Procedures:** Proper escalation paths and notification systems
- **Collaboration Features:** Comments, attachments, and communication tools
- **Quality Gates:** Role-based approval and validation workflows

### User Experience Testing

#### Role-Specific Interface Testing
**Interface Adaptation:**
- **Dashboard Customization:** Role-appropriate dashboard content and widgets
- **Navigation Structure:** Menu items and navigation based on user permissions
- **Feature Discoverability:** Appropriate feature exposure for each role type
- **Workflow Optimization:** Role-specific workflow efficiency and usability
- **Help and Documentation:** Context-sensitive help based on user role

---

## Test Account Management

### Account Lifecycle Management

#### Account Creation and Setup
```bash
# Development environment account setup
npm run seed:test-accounts

# Reset test account passwords
npm run reset:test-passwords

# Verify account status
npm run verify:test-accounts
```

#### Account Maintenance Schedule
- **Daily:** Account status verification and reset for demo accounts
- **Weekly:** Password rotation for security testing accounts
- **Monthly:** Account permission audit and validation
- **Quarterly:** Complete test account portfolio review and optimization

### Quick Access Testing Commands

#### Development Testing Shortcuts
```javascript
// Admin authentication simulation
const adminAuth = {
  id: '1',
  email: 'admin@qtrack.com',
  name: 'System Administrator',
  role: 'ADMIN',
  permissions: ['*'], // All permissions
  twoFactorEnabled: true,
  lastLogin: new Date(),
  sessionTimeout: 480 // 8 hours
};

// QA Engineer authentication simulation
const qaAuth = {
  id: '6',
  email: 'senior.qa@qtrack.com',
  name: 'Senior QA Engineer',
  role: 'QA',
  permissions: [
    'tickets.read', 'tickets.create', 'tickets.update',
    'test-cases.create', 'test-cases.execute', 'test-cases.update',
    'test-suites.create', 'test-suites.manage',
    'analytics.personal', 'reports.export'
  ],
  twoFactorEnabled: true,
  lastLogin: new Date(),
  sessionTimeout: 240 // 4 hours
};

// Manager authentication simulation
const managerAuth = {
  id: '3',
  email: 'qa.manager@qtrack.com',
  name: 'QA Team Manager',
  role: 'MANAGER',
  permissions: [
    'tickets.read', 'tickets.create', 'tickets.update', 'tickets.assign',
    'users.read', 'projects.read',
    'analytics.team', 'analytics.advanced', 'reports.export'
  ],
  twoFactorEnabled: true,
  lastLogin: new Date(),
  sessionTimeout: 360 // 6 hours
};
```

#### Automated Testing Integration
```javascript
// Jest test helper for role-based testing
const testWithRole = (role, testFn) => {
  beforeEach(() => {
    setMockUser(testAccounts[role]);
  });
  
  afterEach(() => {
    clearMockUser();
  });
  
  testFn();
};

// Usage example
describe('Ticket Management', () => {
  testWithRole('QA', () => {
    it('should allow QA to create tickets', () => {
      // Test implementation
    });
  });
  
  testWithRole('USER', () => {
    it('should prevent USER from assigning tickets', () => {
      // Test implementation
    });
  });
});
```

---

## Security Considerations

### Account Security Best Practices

#### Password Management
- **Complexity Requirements:** Minimum 8 characters with mixed case, numbers, and symbols
- **Rotation Policy:** Test account passwords rotated monthly
- **Secure Storage:** All test credentials stored in encrypted configuration
- **Access Logging:** Complete audit trail of test account usage

#### Two-Factor Authentication
- **Implementation:** All privileged accounts (ADMIN, MANAGER) require 2FA
- **Testing Scenarios:** 2FA setup, validation, and recovery procedures
- **Backup Codes:** Secure backup code generation and validation
- **Device Management:** Multiple device registration and management

#### Session Security
- **Token Management:** JWT-based authentication with role-based claims
- **Timeout Policies:** Role-based session timeout configuration
- **Concurrent Sessions:** Multiple device session management and security
- **Secure Logout:** Complete session cleanup and token invalidation

### Compliance and Audit Requirements

#### Audit Trail Logging
- **User Activity:** Complete logging of user actions and data access
- **Permission Changes:** Audit trail for role and permission modifications
- **System Access:** Login/logout events with timestamp and location data
- **Data Modifications:** Complete change history for all data entities

#### Compliance Standards
- **Data Protection:** GDPR/CCPA compliance for user data handling
- **Access Control:** SOC 2 Type II compliance for access management
- **Security Standards:** ISO 27001 alignment for information security
- **Quality Standards:** ISO 9001 compliance for quality management processes

---

## Troubleshooting and Support

### Common Issues and Resolutions

#### Authentication Problems
**Issue:** User cannot login with test credentials
- **Resolution:** Verify account status, reset password, check 2FA settings
- **Prevention:** Regular account health checks and automated validation

**Issue:** Permission denied errors during testing
- **Resolution:** Verify role assignment, check permission matrix, validate feature flags
- **Prevention:** Automated permission testing and role validation

#### Account Management Issues
**Issue:** Test account data corruption or inconsistency
- **Resolution:** Reset account data, re-seed test environment, verify database integrity
- **Prevention:** Regular data backups and integrity checks

### Support Resources

#### Documentation Links
- **API Documentation:** [Role-Based API Reference](../api/roles.md)
- **Testing Procedures:** [Role Testing Guide](../testing/role-testing.md)
- **Security Guidelines:** [Security Best Practices](../security/README.md)


---
