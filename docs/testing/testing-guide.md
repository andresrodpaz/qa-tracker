# QTrack Testing Guide

## Overview
This guide covers the comprehensive testing strategy for QTrack, including unit tests, integration tests, end-to-end tests, and quality assurance procedures.

## Testing Stack
- **Unit Testing**: Vitest + Testing Library
- **E2E Testing**: Playwright
- **Accessibility**: Axe-core
- **Performance**: Lighthouse CI
- **Security**: Snyk + npm audit
- **Mocking**: MSW (Mock Service Worker)

## Running Tests

### Unit Tests
\`\`\`bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
\`\`\`

### End-to-End Tests
\`\`\`bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
\`\`\`

### Accessibility Tests
\`\`\`bash
npm run test:accessibility
\`\`\`

### Performance Tests
\`\`\`bash
npm run test:performance
\`\`\`

### Security Tests
\`\`\`bash
npm run test:security
\`\`\`

### All Tests
\`\`\`bash
npm run test:all
\`\`\`

## Test Structure

### Unit Tests
Located in `src/test/components/` and follow the pattern `*.test.tsx`

Example:
\`\`\`typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/src/test/utils/test-utils'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
\`\`\`

### E2E Tests
Located in `e2e/` directory and follow the pattern `*.spec.ts`

Example:
\`\`\`typescript
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/auth/login')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password')
  await page.click('[data-testid="login-button"]')
  await expect(page).toHaveURL('/dashboard')
})
\`\`\`

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Test Data
- Use factories for creating test data
- Keep test data minimal and focused
- Clean up after tests to avoid side effects

### 3. Mocking
- Mock external dependencies and APIs
- Use MSW for API mocking
- Mock only what's necessary for the test

### 4. Accessibility
- Include accessibility tests for all user-facing components
- Test keyboard navigation
- Verify ARIA labels and roles

### 5. Performance
- Test component render times
- Verify memory usage doesn't grow excessively
- Test with large datasets

## Coverage Requirements
- **Minimum Coverage**: 80% for lines, functions, branches, and statements
- **Critical Components**: 90%+ coverage required
- **New Features**: Must include comprehensive tests

## CI/CD Integration
Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled nightly runs

## Debugging Tests

### Unit Tests
\`\`\`bash
# Debug specific test
npm run test -- --reporter=verbose MyComponent.test.tsx

# Debug with browser tools
npm run test:ui
\`\`\`

### E2E Tests
\`\`\`bash
# Debug with Playwright inspector
npm run test:e2e:debug

# Run specific test
npx playwright test auth.spec.ts --debug
\`\`\`

## Test Utilities

### Custom Render
Use the custom render function that includes providers:
\`\`\`typescript
import { render } from '@/src/test/utils/test-utils'
\`\`\`

### Mock Data
Use test factories for consistent mock data:
\`\`\`typescript
import { createMockUser } from '@/src/test/utils/test-utils'
\`\`\`

### Waiting for Async Operations
\`\`\`typescript
import { waitFor } from '@testing-library/react'

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
\`\`\`

## Quality Gates
All tests must pass before:
- Merging pull requests
- Deploying to staging
- Releasing to production

## Reporting
Test results are available in:
- GitHub Actions (CI/CD)
- Coverage reports (HTML format)
- Playwright reports (HTML format)
- Lighthouse reports (performance)
