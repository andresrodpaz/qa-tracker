# Contributing to QTrack

Thank you for your interest in contributing to QTrack! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our Code of Conduct.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 13.0 or higher
- Redis 6.0 or higher
- Git

### Development Setup

1. **Fork and Clone**
   \`\`\`bash
   git clone https://github.com/your-username/qtrack.git
   cd qtrack
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Database Setup**
   \`\`\`bash
   npm run db:migrate
   npm run db:seed
   \`\`\`

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve or add documentation
- **Testing**: Add or improve test coverage
- **Design**: UI/UX improvements and suggestions

### Before You Start

1. **Check Existing Issues**: Look for existing issues or discussions
2. **Create an Issue**: For significant changes, create an issue first
3. **Discuss**: Engage with maintainers and community members
4. **Plan**: Outline your approach before coding

### Branch Naming Convention

Use descriptive branch names:
- `feature/ticket-ai-analysis`
- `bugfix/login-validation-error`
- `docs/api-documentation-update`
- `refactor/authentication-service`

## Pull Request Process

### 1. Preparation

\`\`\`bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Run tests
npm run test
npm run test:e2e

# Run linting
npm run lint:fix

# Build project
npm run build
\`\`\`

### 2. Commit Guidelines

Follow conventional commit format:

\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
\`\`\`
feat(tickets): add AI-powered ticket classification

fix(auth): resolve login validation error for special characters

docs(api): update authentication endpoint documentation

test(tickets): add unit tests for ticket creation workflow
\`\`\`

### 3. Pull Request Template

When creating a pull request, include:

\`\`\`markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or clearly documented)
\`\`\`

### 4. Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## Coding Standards

### TypeScript/JavaScript

\`\`\`typescript
// Use TypeScript for type safety
interface TicketData {
  title: string;
  description: string;
  priority: Priority;
  assigneeId?: string;
}

// Use meaningful variable names
const isTicketOverdue = (ticket: Ticket): boolean => {
  return ticket.dueDate && new Date(ticket.dueDate) < new Date();
};

// Add JSDoc comments for complex functions
/**
 * Calculates the priority score for AI-based ticket classification
 * @param content - The ticket content to analyze
 * @param metadata - Additional ticket metadata
 * @returns Priority score between 0-100
 */
async function calculatePriorityScore(
  content: string, 
  metadata: TicketMetadata
): Promise<number> {
  // Implementation
}
\`\`\`

### React Components

\`\`\`tsx
// Use functional components with TypeScript
interface TicketCardProps {
  ticket: Ticket;
  onUpdate: (ticket: Ticket) => void;
  className?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({ 
  ticket, 
  onUpdate, 
  className 
}) => {
  // Use meaningful state names
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract complex logic to custom hooks
  const { updateTicket, isUpdating } = useTicketMutation();

  return (
    <Card className={cn("ticket-card", className)}>
      {/* Component JSX */}
    </Card>
  );
};
\`\`\`

### CSS/Styling

\`\`\`css
/* Use Tailwind CSS classes primarily */
.ticket-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

/* Use CSS custom properties for theming */
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}

/* Follow BEM methodology for custom CSS */
.ticket-list__item {
  /* Styles */
}

.ticket-list__item--selected {
  /* Modifier styles */
}
\`\`\`

## Testing Requirements

### Unit Tests

\`\`\`typescript
// components/__tests__/TicketCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketCard } from '../TicketCard';

describe('TicketCard', () => {
  const mockTicket = {
    id: '1',
    title: 'Test Ticket',
    status: 'OPEN',
    priority: 'HIGH'
  };

  it('renders ticket information correctly', () => {
    render(<TicketCard ticket={mockTicket} onUpdate={jest.fn()} />);
    
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('calls onUpdate when ticket is modified', () => {
    const mockOnUpdate = jest.fn();
    render(<TicketCard ticket={mockTicket} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    // ... test implementation
  });
});
\`\`\`

### Integration Tests

\`\`\`typescript
// api/__tests__/tickets.integration.test.ts
import request from 'supertest';
import app from '../app';

describe('Tickets API', () => {
  it('should create a new ticket', async () => {
    const ticketData = {
      title: 'Integration Test Ticket',
      description: 'Test description',
      priority: 'MEDIUM'
    };

    const response = await request(app)
      .post('/api/tickets')
      .send(ticketData)
      .expect(201);

    expect(response.body.ticket.title).toBe(ticketData.title);
  });
});
\`\`\`

### E2E Tests

\`\`\`typescript
// e2e/ticket-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('complete ticket workflow', async ({ page }) => {
  await page.goto('/tickets');
  
  // Create ticket
  await page.click('[data-testid="new-ticket-button"]');
  await page.fill('[data-testid="ticket-title"]', 'E2E Test Ticket');
  await page.click('[data-testid="create-button"]');
  
  // Verify creation
  await expect(page.locator('text=E2E Test Ticket')).toBeVisible();
});
\`\`\`

### Test Coverage Requirements

- **Unit Tests**: Minimum 80% coverage
- **Integration Tests**: Cover all API endpoints
- **E2E Tests**: Cover critical user workflows
- **Component Tests**: Test user interactions and edge cases

## Documentation

### Code Documentation

\`\`\`typescript
/**
 * Service for managing ticket operations with AI integration
 */
export class TicketService {
  /**
   * Creates a new ticket with AI analysis
   * @param ticketData - The ticket information
   * @param options - Additional options for ticket creation
   * @returns Promise resolving to the created ticket with AI insights
   * @throws {ValidationError} When ticket data is invalid
   * @throws {AIServiceError} When AI analysis fails
   */
  async createTicket(
    ticketData: CreateTicketData,
    options: TicketCreationOptions = {}
  ): Promise<TicketWithAIInsights> {
    // Implementation
  }
}
\`\`\`

### API Documentation

Use OpenAPI/Swagger for API documentation:

\`\`\`yaml
# api-docs.yaml
paths:
  /api/tickets:
    post:
      summary: Create a new ticket
      description: Creates a new ticket with optional AI analysis
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTicketRequest'
      responses:
        201:
          description: Ticket created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TicketResponse'
\`\`\`

### README Updates

When adding new features, update relevant README sections:
- Installation instructions
- Configuration options
- Usage examples
- API changes

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes prepared

## Getting Help

### Resources

- **Documentation**: Check the `/docs` directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server

### Asking Questions

When asking for help:
1. **Search First**: Check existing issues and documentation
2. **Provide Context**: Include relevant code, error messages, and environment details
3. **Be Specific**: Clearly describe the problem and expected behavior
4. **Include Steps**: Provide steps to reproduce the issue

### Reporting Bugs

Use the bug report template:

\`\`\`markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js version: [e.g., 18.17.0]
- QTrack version: [e.g., 1.2.3]
\`\`\`

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to QTrack! Your efforts help make this project better for everyone.
