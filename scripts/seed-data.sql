-- QTrack Database Seed Data
-- This script populates the database with sample data for testing and development

-- Sample Users
INSERT INTO users (id, email, name, role, avatar, created_at, updated_at, is_active, last_login) VALUES
('user-1', 'admin@qtrack.com', 'Admin User', 'admin', '/avatars/admin.jpg', NOW(), NOW(), true, NOW()),
('user-2', 'manager@qtrack.com', 'QA Manager', 'manager', '/avatars/manager.jpg', NOW(), NOW(), true, NOW() - INTERVAL '2 hours'),
('user-3', 'agent1@qtrack.com', 'QA Agent 1', 'agent', '/avatars/agent1.jpg', NOW(), NOW(), true, NOW() - INTERVAL '1 hour'),
('user-4', 'agent2@qtrack.com', 'QA Agent 2', 'agent', '/avatars/agent2.jpg', NOW(), NOW(), true, NOW() - INTERVAL '30 minutes'),
('user-5', 'tester@qtrack.com', 'Senior Tester', 'agent', '/avatars/tester.jpg', NOW(), NOW(), true, NOW() - INTERVAL '15 minutes');

-- Sample Projects
INSERT INTO projects (id, name, description, status, created_by, created_at, updated_at, members, ticket_count) VALUES
('proj-1', 'E-commerce Platform', 'Main e-commerce application testing', 'active', 'user-1', NOW(), NOW(), '["user-2", "user-3", "user-4"]', 15),
('proj-2', 'Mobile App QA', 'Mobile application quality assurance', 'active', 'user-2', NOW(), NOW(), '["user-3", "user-5"]', 8),
('proj-3', 'API Testing Suite', 'Backend API comprehensive testing', 'active', 'user-1', NOW(), NOW(), '["user-4", "user-5"]', 12);

-- Sample Tickets
INSERT INTO tickets (id, title, description, status, priority, category, assigned_to, reported_by, created_at, updated_at, resolved_at, tags, attachments, estimated_hours, actual_hours) VALUES
('ticket-1', 'Login form validation fails', 'Email validation not working properly on login form', 'open', 'high', 'bug', 'user-3', 'user-2', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour', NULL, '["frontend", "validation"]', '[]', 4, NULL),
('ticket-2', 'Add dark mode support', 'Implement dark mode theme across the application', 'in-progress', 'medium', 'feature', 'user-4', 'user-1', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours', NULL, '["ui", "theme"]', '[]', 8, 3),
('ticket-3', 'Performance issue on dashboard', 'Dashboard loads slowly with large datasets', 'resolved', 'critical', 'bug', 'user-5', 'user-2', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', '["performance", "dashboard"]', '[]', 6, 5),
('ticket-4', 'API rate limiting', 'Implement rate limiting for API endpoints', 'open', 'medium', 'enhancement', 'user-4', 'user-1', NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes', NULL, '["api", "security"]', '[]', 12, NULL),
('ticket-5', 'Mobile responsive issues', 'Layout breaks on mobile devices', 'in-progress', 'high', 'bug', 'user-3', 'user-5', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour', NULL, '["mobile", "responsive"]', '[]', 6, 2);

-- Sample Test Cases
INSERT INTO test_cases (id, title, description, steps, expected_result, actual_result, status, priority, assigned_to, created_by, created_at, updated_at, executed_at, tags, linked_tickets) VALUES
('test-1', 'User Login Flow', 'Test complete user login functionality', '["Navigate to login page", "Enter valid credentials", "Click login button", "Verify dashboard access"]', 'User successfully logs in and sees dashboard', 'Login successful, dashboard loaded', 'passed', 'high', 'user-3', 'user-2', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', '["authentication", "critical-path"]', '["ticket-1"]'),
('test-2', 'Password Reset', 'Test password reset functionality', '["Click forgot password", "Enter email", "Check email for reset link", "Follow link and reset password"]', 'Password reset email sent and password updated', NULL, 'pending', 'medium', 'user-4', 'user-2', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NULL, '["authentication", "email"]', '[]'),
('test-3', 'Dashboard Performance', 'Test dashboard loading performance', '["Login to application", "Navigate to dashboard", "Measure load time", "Check for errors"]', 'Dashboard loads within 2 seconds', 'Dashboard loaded in 1.2 seconds', 'passed', 'high', 'user-5', 'user-1', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', '["performance", "dashboard"]', '["ticket-3"]'),
('test-4', 'Mobile Responsiveness', 'Test application on mobile devices', '["Open app on mobile", "Test navigation", "Check form layouts", "Verify touch interactions"]', 'All elements properly sized and functional on mobile', 'Some buttons too small on mobile', 'failed', 'high', 'user-3', 'user-5', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', '["mobile", "ui"]', '["ticket-5"]');

-- Sample Test Suites
INSERT INTO test_suites (id, name, description, test_cases, status, created_by, created_at, updated_at, last_executed, pass_rate) VALUES
('suite-1', 'Authentication Suite', 'Complete authentication flow testing', '["test-1", "test-2"]', 'active', 'user-2', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours', 50.0),
('suite-2', 'Performance Suite', 'Application performance testing', '["test-3"]', 'active', 'user-1', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 hours', 100.0),
('suite-3', 'UI/UX Suite', 'User interface and experience testing', '["test-4"]', 'active', 'user-5', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', 0.0);

-- Sample Comments
INSERT INTO comments (id, ticket_id, user_id, content, created_at, updated_at, is_internal, attachments) VALUES
('comment-1', 'ticket-1', 'user-3', 'I can reproduce this issue. The email regex pattern seems incorrect.', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', false, '[]'),
('comment-2', 'ticket-1', 'user-2', 'Please check the validation logic in the auth component.', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', true, '[]'),
('comment-3', 'ticket-2', 'user-4', 'Dark mode implementation is 60% complete. Working on the dashboard components now.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', false, '[]'),
('comment-4', 'ticket-3', 'user-5', 'Performance issue resolved by implementing pagination and lazy loading.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', false, '[]');

-- Sample Activity Logs
INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details, created_at) VALUES
('log-1', 'user-3', 'ticket_updated', 'ticket', 'ticket-1', '{"field": "status", "old_value": "open", "new_value": "in-progress"}', NOW() - INTERVAL '1 hour'),
('log-2', 'user-4', 'comment_added', 'comment', 'comment-3', '{"ticket_id": "ticket-2", "content_length": 85}', NOW() - INTERVAL '2 hours'),
('log-3', 'user-5', 'ticket_resolved', 'ticket', 'ticket-3', '{"resolution_time_hours": 144}', NOW() - INTERVAL '1 day'),
('log-4', 'user-2', 'test_case_created', 'test_case', 'test-4', '{"priority": "high", "linked_tickets": ["ticket-5"]}', NOW() - INTERVAL '1 day');
