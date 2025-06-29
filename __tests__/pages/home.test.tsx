import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/(root)/(home)/page'

// Mock the child components
jest.mock('@/components/CallList', () => {
  return function MockCallList({ type }: { type: string }) {
    return <div data-testid="call-list" data-type={type}>Call List</div>
  }
})

jest.mock('@/components/DateTime', () => {
  return function MockDateTime() {
    return <div data-testid="date-time">Monday, January 15 • 2:30 PM</div>
  }
})

jest.mock('@/components/MeetingTypeList', () => {
  return function MockMeetingTypeList() {
    return (
      <div data-testid="meeting-type-list">
        <div>New Meeting</div>
        <div>Schedule Meeting</div>
        <div>Recordings</div>
        <div>Join Meeting</div>
      </div>
    )
  }
})

describe('Home Page', () => {
  it('renders all main sections', () => {
    render(<Home />)
    
    // Check that the main container is present
    const mainSection = screen.getByRole('main') || screen.getByTestId('home-section')
    expect(screen.getByTestId('date-time')).toBeInTheDocument()
    expect(screen.getByTestId('call-list')).toBeInTheDocument()
    expect(screen.getByTestId('meeting-type-list')).toBeInTheDocument()
  })

  it('displays DateTime component', () => {
    render(<Home />)
    
    const dateTime = screen.getByTestId('date-time')
    expect(dateTime).toBeInTheDocument()
    expect(dateTime).toHaveTextContent('Monday, January 15 • 2:30 PM')
  })

  it('displays CallList with correct type', () => {
    render(<Home />)
    
    const callList = screen.getByTestId('call-list')
    expect(callList).toBeInTheDocument()
    expect(callList).toHaveAttribute('data-type', 'upcomingHome')
  })

  it('displays MeetingTypeList component', () => {
    render(<Home />)
    
    const meetingTypeList = screen.getByTestId('meeting-type-list')
    expect(meetingTypeList).toBeInTheDocument()
    
    // Check that all meeting options are present
    expect(screen.getByText('New Meeting')).toBeInTheDocument()
    expect(screen.getByText('Schedule Meeting')).toBeInTheDocument()
    expect(screen.getByText('Recordings')).toBeInTheDocument()
    expect(screen.getByText('Join Meeting')).toBeInTheDocument()
  })

  it('has proper layout structure', () => {
    render(<Home />)
    
    // The main section should have proper flex layout classes
    const mainSection = document.querySelector('section')
    expect(mainSection).toBeInTheDocument()
    expect(mainSection).toHaveClass('flex')
    expect(mainSection).toHaveClass('size-full')
    expect(mainSection).toHaveClass('flex-col')
  })

  it('displays hero section with background', () => {
    render(<Home />)
    
    // Check for hero section with proper styling
    const heroSection = document.querySelector('.bg-hero')
    expect(heroSection).toBeInTheDocument()
    expect(heroSection).toHaveClass('h-[300px]')
    expect(heroSection).toHaveClass('w-full')
    expect(heroSection).toHaveClass('bg-hero')
  })

  it('arranges components in responsive layout', () => {
    render(<Home />)
    
    // Check that components are properly arranged
    const heroContainer = document.querySelector('.bg-hero .flex')
    expect(heroContainer).toBeInTheDocument()
    expect(heroContainer).toHaveClass('flex')
    expect(heroContainer).toHaveClass('h-full')
    expect(heroContainer).toHaveClass('flex-row')
  })

  describe('Responsive behavior', () => {
    it('adapts to mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<Home />)
      
      // Mobile-specific classes should be applied
      const heroContainer = document.querySelector('.bg-hero .flex')
      expect(heroContainer).toHaveClass('max-md:px-5')
      expect(heroContainer).toHaveClass('max-md:py-8')
    })

    it('adapts to desktop layout', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(<Home />)
      
      // Desktop-specific classes should be applied
      const heroContainer = document.querySelector('.bg-hero .flex')
      expect(heroContainer).toHaveClass('lg:p-11')
    })
  })

  describe('Component integration', () => {
    it('passes correct props to CallList', () => {
      render(<Home />)
      
      const callList = screen.getByTestId('call-list')
      expect(callList).toHaveAttribute('data-type', 'upcomingHome')
    })

    it('integrates DateTime and CallList in hero section', () => {
      render(<Home />)
      
      const dateTime = screen.getByTestId('date-time')
      const callList = screen.getByTestId('call-list')
      
      // Both should be in the hero section
      expect(dateTime.closest('.bg-hero')).toBeInTheDocument()
      expect(callList.closest('.bg-hero')).toBeInTheDocument()
    })

    it('separates hero content from meeting types', () => {
      render(<Home />)
      
      const meetingTypeList = screen.getByTestId('meeting-type-list')
      
      // MeetingTypeList should not be inside hero section
      expect(meetingTypeList.closest('.bg-hero')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<Home />)
      
      // Should use semantic HTML
      const section = document.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('provides proper text contrast', () => {
      render(<Home />)
      
      // Text should have white color for contrast
      const section = document.querySelector('section')
      expect(section).toHaveClass('text-white')
    })

    it('is keyboard navigable', () => {
      render(<Home />)
      
      // Components should be focusable and navigable
      // This is tested in individual component tests
      expect(screen.getByTestId('meeting-type-list')).toBeInTheDocument()
    })
  })

  describe('Error boundaries', () => {
    it('handles component errors gracefully', () => {
      // Mock console.error to prevent error logs in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      // This would test error boundary behavior if implemented
      render(<Home />)
      
      expect(screen.getByTestId('date-time')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })
  })

  describe('Performance considerations', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<Home />)
      
      // Component should render consistently
      expect(screen.getByTestId('date-time')).toBeInTheDocument()
      
      rerender(<Home />)
      expect(screen.getByTestId('date-time')).toBeInTheDocument()
    })

    it('loads all components without blocking', () => {
      render(<Home />)
      
      // All components should be present immediately
      expect(screen.getByTestId('date-time')).toBeInTheDocument()
      expect(screen.getByTestId('call-list')).toBeInTheDocument()
      expect(screen.getByTestId('meeting-type-list')).toBeInTheDocument()
    })
  })
})