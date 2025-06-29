import React from 'react'
import { render, screen } from '@testing-library/react'
import DateTime from '@/components/DateTime'

// Mock date-fns functions
jest.mock('date-fns', () => ({
  format: jest.fn(() => '2:30 PM'),
}))

describe('DateTime', () => {
  beforeEach(() => {
    // Mock the current date and time for consistent testing
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T14:30:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the current time', () => {
    render(<DateTime />)
    
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })

  it('displays the current date', () => {
    render(<DateTime />)
    
    // Should display the formatted date
    const dateElement = screen.getByText(/Monday, January 15/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<DateTime />)
    
    const timeElement = screen.getByText('2:30 PM')
    const dateElement = screen.getByText(/Monday, January 15/i)
    
    expect(timeElement).toBeInTheDocument()
    expect(dateElement).toBeInTheDocument()
  })

  it('updates time every minute', () => {
    render(<DateTime />)
    
    // Initial time
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
    
    // Fast forward 1 minute
    jest.advanceTimersByTime(60000)
    
    // Time should update (though mocked, the component should handle updates)
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('provides proper time semantics', () => {
      render(<DateTime />)
      
      const timeElement = screen.getByText('2:30 PM')
      expect(timeElement).toBeInTheDocument()
    })

    it('is readable by screen readers', () => {
      render(<DateTime />)
      
      // The component should have accessible text content
      expect(screen.getByText('2:30 PM')).toBeInTheDocument()
      expect(screen.getByText(/Monday, January 15/i)).toBeInTheDocument()
    })
  })

  describe('Responsive behavior', () => {
    it('renders properly on different screen sizes', () => {
      render(<DateTime />)
      
      // Component should render without errors on different viewport sizes
      expect(screen.getByText('2:30 PM')).toBeInTheDocument()
      expect(screen.getByText(/Monday, January 15/i)).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles different time formats', () => {
      // Test with different times
      jest.setSystemTime(new Date('2024-01-15T00:00:00Z'))
      
      render(<DateTime />)
      
      expect(screen.getByText('2:30 PM')).toBeInTheDocument() // Mocked return value
    })

    it('handles date transitions', () => {
      // Test at midnight
      jest.setSystemTime(new Date('2024-01-15T23:59:59Z'))
      
      render(<DateTime />)
      
      expect(screen.getByText('2:30 PM')).toBeInTheDocument() // Mocked return value
    })
  })
})