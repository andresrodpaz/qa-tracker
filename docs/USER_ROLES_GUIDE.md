# QTrack User Roles & Test Accounts Guide

## Role Hierarchy & Permissions

### ADMIN (System Administrator)
**Full system access with all permissions**
- Complete CRUD operations on all entities
- User management and system settings
- Advanced analytics and reporting
- System configuration and maintenance

**Test Accounts:**
- `admin@qtrack.com` / `admin123` - System Administrator
- `superadmin@qtrack.com` / `admin123` - Super Admin

### MANAGER (Team/Project Manager)
**Team oversight and project management**
- Ticket assignment and team management
- Project oversight and reporting
- Test case assignment and review
- Team performance analytics

**Test Accounts:**
- `qa.manager@qtrack.com` / `manager123` - QA Team Manager
- `project.manager@qtrack.com` / `manager123` - Project Manager
- `team.lead@qtrack.com` / `manager123` - Team Lead

### QA (Quality Assurance Engineer)
**Testing and quality assurance focus**
- Test case creation and execution
- Test suite management
- Bug reporting and verification
- Quality metrics and reporting

**Test Accounts:**
- `senior.qa@qtrack.com` / `qa123` - Senior QA Engineer
- `qa.analyst@qtrack.com` / `qa123` - QA Analyst
- `automation.tester@qtrack.com` / `qa123` - Automation Test Engineer
- `manual.tester@qtrack.com` / `qa123` - Manual Test Specialist
- `performance.tester@qtrack.com` / `qa123` - Performance Test Engineer

### DEV (Developer)
**Development and resolution tasks**
- Ticket resolution and updates
- Code-related comments and discussions
- Limited test case viewing
- Project collaboration

**Test Accounts:**
- `senior.dev@qtrack.com` / `dev123` - Senior Developer
- `frontend.dev@qtrack.com` / `dev123` - Frontend Developer
- `backend.dev@qtrack.com` / `dev123` - Backend Developer
- `fullstack.dev@qtrack.com` / `dev123` - Full Stack Developer

### USER (Basic User)
**Limited access for stakeholders**
- Ticket creation and viewing
- Comment creation
- Basic reporting access
- Read-only project information

**Test Accounts:**
- `business.analyst@qtrack.com` / `user123` - Business Analyst
- `product.owner@qtrack.com` / `user123` - Product Owner
- `stakeholder@qtrack.com` / `user123` - Business Stakeholder

## Special Test Accounts

### Demo Account
- `demo@qtrack.com` / `demo123` - Demo User (QA role)
- Perfect for demonstrations and training

### Inactive Account
- `inactive.user@qtrack.com` / `user123` - Inactive User
- For testing inactive user scenarios

## Permission Matrix

| Permission | ADMIN | MANAGER | QA | DEV | USER |
|------------|-------|---------|----|----|------|
| tickets.create | ✅ | ✅ | ✅ | ❌ | ✅ |
| tickets.read | ✅ | ✅ | ✅ | ✅ | ✅ |
| tickets.update | ✅ | ✅ | ✅ | ✅ | ❌ |
| tickets.delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| tickets.assign | ✅ | ✅ | ❌ | ❌ | ❌ |
| tickets.resolve | ✅ | ❌ | ❌ | ✅ | ❌ |
| users.manage | ✅ | ❌ | ❌ | ❌ | ❌ |
| projects.manage | ✅ | ❌ | ❌ | ❌ | ❌ |
| test-cases.create | ✅ | ❌ | ✅ | ❌ | ❌ |
| test-cases.execute | ✅ | ❌ | ✅ | ❌ | ❌ |
| test-suites.manage | ✅ | ❌ | ✅ | ❌ | ❌ |
| analytics.view | ✅ | ✅ | ❌ | ❌ | ❌ |
| system.admin | ✅ | ❌ | ❌ | ❌ | ❌ |

## Testing Scenarios

### Authentication Testing
- Test login with each role type
- Verify role-based access control
- Test 2FA enabled/disabled accounts
- Test inactive account handling

### Permission Testing
- Verify each role can only access permitted features
- Test permission boundaries and error handling
- Validate UI elements show/hide based on permissions

### Workflow Testing
- Test complete ticket lifecycle with different roles
- Verify collaboration between roles
- Test escalation and assignment workflows

## Quick Login Commands (for testing)

\`\`\`javascript
// Admin login
localStorage.setItem('qtrack_auth', 'mock_jwt_token');
localStorage.setItem('qtrack_user', JSON.stringify({
  id: '1', email: 'admin@qtrack.com', name: 'System Administrator',
  role: 'ADMIN', permissions: [...], twoFactorEnabled: true
}));

// QA login  
localStorage.setItem('qtrack_user', JSON.stringify({
  id: '6', email: 'senior.qa@qtrack.com', name: 'Senior QA Engineer',
  role: 'QA', permissions: [...], twoFactorEnabled: true
}));
