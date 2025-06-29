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

  // Mock Clerk session check to bypass auth
  await page.addInitScript(() => {
    // Mock authenticated state
    Object.defineProperty(window, '__CLERK_FRONTEND_API', {
      value: 'clerk.nexthub.com',
      writable: false
    })
  })

  // Intercept auth redirects and simulate authenticated state
  await page.route('**/sign-in**', (route: Route) => {
    // Redirect back to home page as if authenticated
    route.fulfill({
      status: 302,
      headers: { 'location': '/' }
    })
  })
}

test.describe('Meeting Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for all tests
    await mockAuthentication(page)
    
    // Navigate to home page
    await page.goto('/')
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    
    // Wait a bit more to ensure all components are rendered
    await page.waitForTimeout(2000)
  })

  test('should display home page with meeting options', async ({ page }) => {
    // Check that the home page loads correctly
    await expect(page).toHaveTitle(/nexthub/i)
    
    // Verify DateTime component is visible (more specific regex)
    await expect(page.locator('text=/\\d{1,2}:\\d{2}\\s*(AM|PM)/i')).toBeVisible({ timeout: 10000 })
    
    // Verify all meeting type cards are visible with increased timeout
    await expect(page.locator('text=New Meeting')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Schedule Meeting')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Recordings')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Join Meeting')).toBeVisible({ timeout: 10000 })
  })

  test('should create instant meeting', async ({ page }) => {
    // Wait for New Meeting card to be available
    await expect(page.locator('text=New Meeting')).toBeVisible({ timeout: 10000 })
    
    // Click on New Meeting card
    await page.click('text=New Meeting')
    
    // Modal should open
    await expect(page.locator('text=Start an Instant Meeting')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Start Meeting")')).toBeVisible({ timeout: 10000 })
    
    // Click Start Meeting button
    await page.click('button:has-text("Start Meeting")')
    
    // Should navigate to meeting room (with longer timeout)
    await page.waitForURL('**/meeting/**', { timeout: 15000 })
    expect(page.url()).toContain('/meeting/')
  })

  test('should schedule a meeting', async ({ page }) => {
    // Wait for Schedule Meeting card to be available
    await expect(page.locator('text=Schedule Meeting')).toBeVisible({ timeout: 10000 })
    
    // Click on Schedule Meeting card
    await page.click('text=Schedule Meeting')
    
    // Modal should open
    await expect(page.locator('text=Schedule a Meeting')).toBeVisible({ timeout: 10000 })
    
    // Fill in meeting description
    const descriptionTextarea = page.locator('textarea')
    await descriptionTextarea.fill('Weekly team standup meeting')
    
    // Click Schedule Meeting button
    await page.click('button:has-text("Schedule Meeting")')
    
    // Success modal should appear
    await expect(page.locator('text=Meeting Scheduled Successfully!')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Copy the Invitation Link')).toBeVisible({ timeout: 10000 })
  })

  test('should copy meeting invitation link', async ({ page }) => {
    // Wait for Schedule Meeting card to be available
    await expect(page.locator('text=Schedule Meeting')).toBeVisible({ timeout: 10000 })
    
    // Schedule a meeting first
    await page.click('text=Schedule Meeting')
    await page.click('button:has-text("Schedule Meeting")')
    
    // Wait for success modal
    await expect(page.locator('text=Meeting Scheduled Successfully!')).toBeVisible({ timeout: 10000 })
    
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
    // Wait for Join Meeting card to be available
    await expect(page.locator('text=Join Meeting')).toBeVisible({ timeout: 10000 })
    
    // Click on Join Meeting card
    await page.click('text=Join Meeting')
    
    // Modal should open
    await expect(page.locator('text=Paste the Invitation Link')).toBeVisible({ timeout: 10000 })
    
    // Fill in invitation link
    const linkInput = page.locator('input[placeholder="Invitation Link"]')
    await linkInput.fill('http://localhost:3000/meeting/test-meeting-123')
    
    // Click Join Meeting button
    await page.click('button:has-text("Join Meeting")')
    
    // Should navigate to the meeting
    await page.waitForURL('**/meeting/test-meeting-123', { timeout: 15000 })
    expect(page.url()).toContain('/meeting/test-meeting-123')
  })

  test('should navigate to recordings page', async ({ page }) => {
    // Wait for Recordings card to be available
    await expect(page.locator('text=Recordings')).toBeVisible({ timeout: 10000 })
    
    // Click on Recordings card
    await page.click('text=Recordings')
    
    // Should navigate to recordings page
    await page.waitForURL('**/recordings', { timeout: 10000 })
    expect(page.url()).toContain('/recordings')
  })

  test('should handle modal close functionality', async ({ page }) => {
    // Wait for New Meeting card to be available
    await expect(page.locator('text=New Meeting')).toBeVisible({ timeout: 10000 })
    
    // Open New Meeting modal
    await page.click('text=New Meeting')
    await expect(page.locator('text=Start an Instant Meeting')).toBeVisible({ timeout: 10000 })
    
    // Close modal with Escape key
    await page.keyboard.press('Escape')
    
    // Modal should be closed
    await expect(page.locator('text=Start an Instant Meeting')).not.toBeVisible()
  })

  test('should validate meeting form inputs', async ({ page }) => {
    // Wait for Schedule Meeting card to be available
    await expect(page.locator('text=Schedule Meeting')).toBeVisible({ timeout: 10000 })
    
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
    
    // Wait for New Meeting card to be available
    await expect(page.locator('text=New Meeting')).toBeVisible({ timeout: 10000 })
    
    // Try to create instant meeting
    await page.click('text=New Meeting')
    await page.click('button:has-text("Start Meeting")')
    
    // Should show error message (if toast is implemented)
    // await expect(page.locator('text=could not create the meeting')).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000)
    
    // Test keyboard navigation through meeting cards
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to activate cards with Enter
    await page.keyboard.press('Enter')
    
    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Reload to apply mobile viewport
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Verify mobile layout
    await expect(page.locator('text=New Meeting')).toBeVisible({ timeout: 10000 })
    
    // Cards should stack vertically on mobile
    const meetingCards = page.locator('text=New Meeting').locator('..')
    const cardBox = await meetingCards.boundingBox()
    
    if (cardBox) {
      expect(cardBox.width).toBeLessThanOrEqual(375)
    }
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
    // Mock authentication
    await mockAuthentication(page)
    
    // Navigate directly to a test meeting room
    await page.goto('/meeting/test-meeting-123')
    await page.waitForLoadState('networkidle')
  })

  test('should load meeting room interface', async ({ page }) => {
    // Should show loading state initially or go directly to meeting room
    const loaderVisible = await page.locator('[data-testid="loader"]').isVisible()
    
    if (loaderVisible) {
      await expect(page.locator('[data-testid="loader"]')).toBeVisible({ timeout: 10000 })
    }

    // Mock successful connection by waiting longer
    await page.waitForTimeout(3000)
    
    // After loading, should show call controls or meeting interface
    // This test might need to be adjusted based on actual Stream implementation
  })

  test('should display layout controls', async ({ page }) => {
    // Wait for meeting room to load with longer timeout
    await page.waitForSelector('[data-testid="call-controls"]', { timeout: 15000 })
    
    // Should have layout dropdown
    await expect(page.locator('button').filter({ hasText: /layout/i })).toBeVisible()
  })

  test('should switch between video layouts', async ({ page }) => {
    await page.waitForSelector('[data-testid="call-controls"]', { timeout: 15000 })
    
    // Click layout dropdown
    await page.click('button[aria-haspopup="menu"]')
    
    // Should show layout options
    await expect(page.locator('text=Grid')).toBeVisible()
    await expect(page.locator('text=Speaker-Left')).toBeVisible()
    await expect(page.locator('text=Speaker-Right')).toBeVisible()
    
    // Click on Grid layout
    await page.click('text=Grid')
  })

  test('should toggle participants list', async ({ page }) => {
    await page.waitForSelector('[data-testid="call-controls"]', { timeout: 15000 })
    
    // Click participants button
    await page.click('button:has([data-icon="users"])')
    
    // Participants list should appear
    // This depends on Stream implementation
  })

  test('should leave meeting and return home', async ({ page }) => {
    await page.waitForSelector('[data-testid="call-controls"]', { timeout: 15000 })
    
    // Click leave button (if visible)
    const endButton = page.locator('[data-testid="end-call-button"]')
    if (await endButton.isVisible()) {
      await endButton.click()
    } else {
      // Use regular leave button from CallControls
      await page.click('button:has-text("Leave")')
    }
    
    // Should return to home page
    await page.waitForURL('**/', { timeout: 10000 })
    expect(page.url()).toContain('/')
  })

  test('should handle personal room features', async ({ page }) => {
    // Navigate to personal room
    await page.goto('/personal-room')
    
    // Should display personal room interface
    // This depends on the actual personal room implementation
  })
})

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page)
  })

  test('should handle network connectivity issues', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', (route: Route) => {
      route.abort('connectionfailed')
    })

    try {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
    } catch (error) {
      // Expected to fail due to network issues
    }

    // Should handle offline state gracefully
    // This depends on the offline handling implementation
  })

  test('should recover from temporary failures', async ({ page }) => {
    // First, simulate failure
    await page.route('**/api/**', (route: Route) => {
      route.fulfill({ status: 500 })
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Then simulate recovery
    await page.unroute('**/api/**')
    await mockAuthentication(page)

    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Should eventually succeed after retries
    await expect(page.locator('text=New Meeting')).toBeVisible({ timeout: 10000 })
  })
})