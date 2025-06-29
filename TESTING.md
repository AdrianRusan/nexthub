# Testing Guide for Nexthub

This document provides a comprehensive overview of the testing infrastructure and guidelines for the Nexthub video conferencing application.

## 📋 Table of Contents

- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Mocking Strategy](#mocking-strategy)
- [CI/CD Integration](#cicd-integration)

## 🛠 Testing Stack

### Component Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **jest-dom**: Custom Jest matchers for DOM elements

### E2E Testing
- **Playwright**: End-to-end testing framework
- **Multi-browser support**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

### Additional Tools
- **MSW (Mock Service Worker)**: API mocking
- **TypeScript**: Type safety for tests
- **Coverage reporting**: Built-in Jest coverage

## 📁 Test Structure

```
__tests__/
├── components/           # Component unit tests
│   ├── MeetingTypeList.test.tsx
│   ├── MeetingRoom.test.tsx
│   ├── HomeCard.test.tsx
│   ├── DateTime.test.tsx
│   └── ui/
│       └── Button.test.tsx
├── pages/               # Page integration tests
│   └── home.test.tsx
e2e/
├── specs/               # E2E test specifications
│   ├── auth.spec.ts
│   └── meeting-flows.spec.ts
```

## 🚀 Running Tests

### Component Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

### Browser-Specific E2E Tests

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## 📊 Test Coverage

### Current Coverage Areas

#### ✅ Component Tests
- **MeetingTypeList**: Complete coverage of all meeting actions, error states, and user interactions
- **MeetingRoom**: Layout controls, participant management, call states
- **HomeCard**: Click interactions, styling variations, accessibility
- **DateTime**: Time display, formatting, updates
- **Button UI**: All variants, sizes, states, and accessibility features

#### ✅ Page Tests
- **Home Page**: Full page rendering, component integration, responsive behavior

#### ✅ E2E Tests
- **Authentication**: Sign-in/sign-up flows, protected routes, error handling
- **Meeting Flows**: Creating, scheduling, joining meetings
- **Meeting Room**: Video layouts, participant controls, call management
- **Error Handling**: Network failures, API errors, recovery scenarios

### Coverage Targets
- **Unit Tests**: >90% code coverage
- **Integration Tests**: All critical user journeys
- **E2E Tests**: Complete user workflows from login to meeting completion

## ✍️ Writing Tests

### Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render with correct props', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should complete user journey', async ({ page }) => {
  await page.goto('/')
  
  // Test user interaction
  await page.click('text=New Meeting')
  await expect(page.locator('text=Start an Instant Meeting')).toBeVisible()
  
  // Verify navigation
  await page.click('button:has-text("Start Meeting")')
  await page.waitForURL('**/meeting/**')
})
```

### Testing Guidelines

#### Component Tests
1. **Test behavior, not implementation**
2. **Use data-testids for reliable element selection**
3. **Mock external dependencies**
4. **Test edge cases and error states**
5. **Ensure accessibility compliance**

#### E2E Tests
1. **Test complete user workflows**
2. **Use realistic test data**
3. **Handle async operations properly**
4. **Test across different browsers and devices**
5. **Include network failure scenarios**

## 🎭 Mocking Strategy

### Global Mocks (jest.setup.js)
- **Next.js Router**: Navigation functions
- **Clerk Authentication**: User state and auth methods
- **Stream Video SDK**: Video calling functionality
- **Browser APIs**: Clipboard, crypto, ResizeObserver

### Component-Specific Mocks
```typescript
// Mock expensive child components
jest.mock('@/components/ExpensiveComponent', () => {
  return function MockExpensiveComponent(props) {
    return <div data-testid="expensive-component" {...props} />
  }
})
```

### API Mocking
```typescript
// E2E API mocking
await page.route('**/api/**', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true })
  })
})
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Unit Tests
  run: npm run test:coverage

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Pre-commit Hooks
- Run unit tests on staged files
- Check test coverage thresholds
- Lint test files

## 🧪 Test Categories

### Unit Tests
- **Purpose**: Test individual components in isolation
- **Speed**: Fast (< 100ms per test)
- **Coverage**: Component logic, props handling, event callbacks

### Integration Tests
- **Purpose**: Test component interactions
- **Speed**: Medium (100-500ms per test)
- **Coverage**: Page-level rendering, data flow

### E2E Tests
- **Purpose**: Test complete user workflows
- **Speed**: Slow (1-10s per test)
- **Coverage**: User journeys, cross-browser compatibility

## 🚨 Debugging Tests

### Component Test Debugging
```typescript
import { render, screen } from '@testing-library/react'
import { debug } from '@testing-library/react'

// Debug rendered DOM
render(<MyComponent />)
screen.debug() // Prints current DOM state
```

### E2E Test Debugging
```bash
# Run with headed browser
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Record test execution
npx playwright test --video=on
```

### Common Issues
1. **Async timing**: Use `waitFor`, `findBy` queries
2. **Mock not working**: Check mock path and timing
3. **Element not found**: Verify selectors and rendering
4. **Test flakiness**: Add proper waits and error handling

## 📈 Metrics and Reporting

### Coverage Reports
- Generated in `coverage/` directory
- HTML report available at `coverage/lcov-report/index.html`
- Coverage thresholds enforced in Jest config

### E2E Reports
- HTML report generated by Playwright
- Screenshots and videos on failure
- Test results available in `test-results/`

### Performance Metrics
- Test execution time monitoring
- Memory usage tracking
- Flaky test identification

## 🔧 Configuration Files

### Jest Configuration
- `jest.config.js`: Main Jest configuration
- `jest.setup.js`: Global test setup and mocks
- `types/jest-dom.d.ts`: TypeScript declarations for jest-dom

### Playwright Configuration
- `playwright.config.ts`: E2E test configuration
- Multi-browser and mobile testing setup
- Parallel execution and retry logic

## 🎯 Best Practices

### Testing Principles
1. **Test user behavior, not implementation details**
2. **Write tests that provide confidence in deployments**
3. **Keep tests simple and focused**
4. **Use descriptive test names**
5. **Follow the testing pyramid (more unit tests, fewer E2E tests)**

### Maintenance
1. **Update tests when behavior changes**
2. **Remove obsolete tests**
3. **Refactor test utilities for reusability**
4. **Monitor and fix flaky tests**
5. **Keep test dependencies updated**

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🤝 Contributing to Tests

When adding new features:
1. Write component tests for new components
2. Add E2E tests for new user flows
3. Update existing tests if behavior changes
4. Ensure coverage thresholds are met
5. Document any new testing patterns

For questions or issues with tests, please refer to this guide or reach out to the development team.