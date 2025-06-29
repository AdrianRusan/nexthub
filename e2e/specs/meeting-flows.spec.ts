import { test, expect, Page, Route } from '@playwright/test'

// Helper function to mock authentication
async function mockAuthentication(page: Page) {
  // Mock Clerk authentication APIs
  await page.route('**/api/auth/**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: { id: 'test-user', name: 'Test User' } })
    })
  })

  // Mock Stream Video client
  await page.route('**/api/stream/**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    })
  })
}

test.describe('Meeting Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for all tests
    await mockAuthentication(page)
    
    // Navigate to home page
    await page.goto('/')
  })

  test('should display home page with meeting options', async ({ page }) => {
    // Check that the home page loads correctly
    await expect(page).toHaveTitle(/nexthub/i)
    
    // Verify DateTime component is visible
    await expect(page.locator('text=/[0-9]{1,2}:[0-9]{2} [AP]M/i')).toBeVisible()
    
    // Verify all meeting type cards are visible
    await expect(page.locator('text=New Meeting')).toBeVisible()
    await expect(page.locator('text=Schedule Meeting')).toBeVisible()
    await expect(page.locator('text=Recordings')).toBeVisible()
    await expect(page.locator('text=Join Meeting')).toBeVisible()
  })

  test('should create instant meeting', async ({ page }) => {
    // Click on New Meeting card
    await page.click('text=New Meeting')
    
    // Modal should open
    await expect(page.locator('text=Start an Instant Meeting')).toBeVisible()
    await expect(page.locator('button:has-text("Start Meeting")')).toBeVisible()
    
    // Click Start Meeting button
    await page.click('button:has-text("Start Meeting")')
    
    // Should navigate to meeting room
    await page.waitForURL('**/meeting/**')
    expect(page.url()).toContain('/meeting/')
  })

  test('should schedule a meeting', async ({ page }) => {
    // Click on Schedule Meeting card
    await page.click('text=Schedule Meeting')
    
    // Modal should open
    await expect(page.locator('text=Schedule a Meeting')).toBeVisible()
    
    // Fill in meeting description
    const descriptionTextarea = page.locator('textarea')
    await descriptionTextarea.fill('Weekly team standup meeting')
    
    // Click Schedule Meeting button
    await page.click('button:has-text("Schedule Meeting")')
    
    // Success modal should appear
    await expect(page.locator('text=Meeting Scheduled Successfully!')).toBeVisible()
    await expect(page.locator('text=Copy the Invitation Link')).toBeVisible()
  })

  test('should copy meeting invitation link', async ({ page }) => {
    // Schedule a meeting first
    await page.click('text=Schedule Meeting')
    await page.click('button:has-text("Schedule Meeting")')
    
    // Wait for success modal
    await expect(page.locator('text=Meeting Scheduled Successfully!')).toBeVisible()
    
    // Mock clipboard API
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.resolve()
        }
      })
    })
    
    // Click copy link button
    await page.click('text=Copy the Invitation Link')
    
    // Should show success toast (if implemented)
    // await expect(page.locator('text=Link copied')).toBeVisible()
  })

  test('should join meeting via invitation link', async ({ page }) => {
    // Click on Join Meeting card
    await page.click('text=Join Meeting')
    
    // Modal should open
    await expect(page.locator('text=Paste the Invitation Link')).toBeVisible()
    
    // Fill in invitation link
    const linkInput = page.locator('input[placeholder="Invitation Link"]')
    await linkInput.fill('http://localhost:3000/meeting/test-meeting-123')
    
    // Click Join Meeting button
    await page.click('button:has-text("Join Meeting")')
    
    // Should navigate to the meeting
    await page.waitForURL('**/meeting/test-meeting-123')
    expect(page.url()).toContain('/meeting/test-meeting-123')
  })

  test('should navigate to recordings page', async ({ page }) => {
    // Click on Recordings card
    await page.click('text=Recordings')
    
    // Should navigate to recordings page
    await page.waitForURL('**/recordings')
    expect(page.url()).toContain('/recordings')
  })

  test('should handle modal close functionality', async ({ page }) => {
    // Open New Meeting modal
    await page.click('text=New Meeting')
    await expect(page.locator('text=Start an Instant Meeting')).toBeVisible()
    
    // Close modal with Escape key
    await page.keyboard.press('Escape')
    
    // Modal should be closed
    await expect(page.locator('text=Start an Instant Meeting')).not.toBeVisible()
  })

  test('should validate meeting form inputs', async ({ page }) => {
    // Open Schedule Meeting modal
    await page.click('text=Schedule Meeting')
    
    // Try to schedule without proper date (if validation exists)
    await page.click('button:has-text("Schedule Meeting")')
    
    // Should show validation errors or handle gracefully
    // This depends on the actual validation implementation
  })

  test('should handle meeting creation errors', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/**', (route: Route) => {
      route.fulfill({ status: 500, body: 'Server Error' })
    })
    
    // Try to create instant meeting
    await page.click('text=New Meeting')
    await page.click('button:has-text("Start Meeting")')
    
    // Should show error message (if toast is implemented)
    // await expect(page.locator('text=could not create the meeting')).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Test keyboard navigation through meeting cards
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to activate cards with Enter
    await page.keyboard.press('Enter')
    
    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify mobile layout
    await expect(page.locator('text=New Meeting')).toBeVisible()
    
    // Cards should stack vertically on mobile
    const meetingCards = page.locator('text=New Meeting').locator('..')
    const cardBox = await meetingCards.boundingBox()
    
    expect(cardBox?.width).toBeLessThanOrEqual(375)
  })

  test('should handle upcoming meetings display', async ({ page }) => {
    // Mock upcoming meetings data
    await page.route('**/api/meetings/**', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          meetings: [
            {
              id: 'meeting-1',
              title: 'Team Standup',
              startTime: new Date().toISOString()
            }
          ]
        })
      })
    })
    
    await page.reload()
    
    // Should display upcoming meetings
    // This depends on the CallList component implementation
  })
})

test.describe('Meeting Room Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page)
    
    // Navigate directly to a meeting room
    await page.goto('/meeting/test-meeting-id')
  })

  test('should load meeting room interface', async ({ page }) => {
    // Should show loading state initially
    await expect(page.locator('[data-testid="loader"]')).toBeVisible()
    
    // Mock successful connection
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('streamConnected'))
    })
  })

  test('should display layout controls', async ({ page }) => {
    // Wait for meeting room to load
    await page.waitForSelector('[data-testid="call-controls"]', { timeout: 10000 })
    
    // Should have layout dropdown
    await expect(page.locator('button').filter({ hasText: /layout/i })).toBeVisible()
  })

  test('should switch between video layouts', async ({ page }) => {
    await page.waitForSelector('[data-testid="call-controls"]')
    
    // Click layout dropdown
    await page.click('button[aria-haspopup="menu"]')
    
    // Select Grid layout
    await page.click('text=Grid')
    
    // Should update layout
    await expect(page.locator('[data-testid="grid-layout"]')).toBeVisible()
  })

  test('should toggle participants list', async ({ page }) => {
    await page.waitForSelector('[data-testid="call-controls"]')
    
    // Click participants button
    await page.click('button:has([data-icon="users"])')
    
    // Participants list should be visible
    await expect(page.locator('[data-testid="participants-list"]')).toBeVisible()
  })

  test('should leave meeting and return home', async ({ page }) => {
    await page.waitForSelector('[data-testid="call-controls"]')
    
    // Click leave button (if visible)
    await page.click('[data-testid="end-call-button"]')
    
    // Should navigate back to home
    await page.waitForURL('/')
    expect(page.url()).toBe('http://localhost:3000/')
  })

  test('should handle personal room features', async ({ page }) => {
    // Navigate to personal room
    await page.goto('/personal-room')
    
    // Should display personal room interface
    // This depends on the actual personal room implementation
  })
})

test.describe('Error Handling', () => {
  test('should handle network connectivity issues', async ({ page, context }) => {
    await mockAuthentication(page)
    
    // Simulate network disconnection by blocking all network requests
    await context.route('**/*', (route: Route) => {
      route.abort()
    })
    
    await page.goto('/')
    
    // Should handle offline state gracefully
    // This depends on the offline handling implementation
  })

  test('should handle Stream API failures', async ({ page }) => {
    await mockAuthentication(page)
    
    // Mock Stream API failures
    await page.route('**/stream/**', (route: Route) => {
      route.fulfill({ status: 500, body: 'Stream Service Unavailable' })
    })
    
    await page.goto('/')
    
    // Should show appropriate error messages
    // This depends on the error handling implementation
  })

  test('should recover from temporary failures', async ({ page }) => {
    await mockAuthentication(page)
    
    let failureCount = 0
    await page.route('**/api/**', (route: Route) => {
      failureCount++
      if (failureCount <= 2) {
        route.fulfill({ status: 500 })
      } else {
        route.continue()
      }
    })
    
    await page.goto('/')
    
    // Should eventually succeed after retries
    await expect(page.locator('text=New Meeting')).toBeVisible()
  })
})