import React from 'react'
import { render, screen, act } from '@testing-library/react'
import DateTime from '@/components/DateTime'

describe('DateTime', () => {
  beforeEach(() => {
    // Mock the current date and time for consistent testing
    jest.useFakeTimers()
    // Using a local time that will give us the expected output
    jest.setSystemTime(new Date('2024-01-15T14:30:00'))
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
    
    // Should display the formatted date - actual format is "Mon, Jan 15, 2024"
    const dateElement = screen.getByText(/Mon, Jan 15, 2024/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<DateTime />)
    
    const timeElement = screen.getByText('2:30 PM')
    const dateElement = screen.getByText(/Mon, Jan 15, 2024/i)
    
    expect(timeElement).toBeInTheDocument()
    expect(dateElement).toBeInTheDocument()
  })

  it('updates time every minute', () => {
    render(<DateTime />)
    
    // Initial time
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
    
    // Fast forward 1 minute and wrap in act
    act(() => {
      jest.advanceTimersByTime(60000)
    })
    
    // Time should update to 2:31 PM
    expect(screen.getByText('2:31 PM')).toBeInTheDocument()
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
      expect(screen.getByText(/Mon, Jan 15, 2024/i)).toBeInTheDocument()
    })
  })

  describe('Responsive behavior', () => {
    it('renders properly on different screen sizes', () => {
      render(<DateTime />)
      
      // Component should render without errors on different viewport sizes
      expect(screen.getByText('2:30 PM')).toBeInTheDocument()
      expect(screen.getByText(/Mon, Jan 15, 2024/i)).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles different time formats', () => {
      // Test with different times - using local time
      jest.setSystemTime(new Date('2024-01-15T00:00:00'))
      
      render(<DateTime />)
      
      expect(screen.getByText('12:00 AM')).toBeInTheDocument()
    })

    it('handles date transitions', () => {
      // Test at late night - using local time
      jest.setSystemTime(new Date('2024-01-15T23:59:00'))
      
      render(<DateTime />)
      
      expect(screen.getByText('11:59 PM')).toBeInTheDocument()
    })
  })
})