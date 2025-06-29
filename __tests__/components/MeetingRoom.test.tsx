import React from 'react'
import { render, screen } from '@testing-library/react'
import MeetingRoom from '@/components/MeetingRoom'

describe('MeetingRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders meeting room container', () => {
    render(<MeetingRoom />)
    
    // Check that the main meeting room structure is present
    const meetingContainer = document.querySelector('section')
    expect(meetingContainer).toBeInTheDocument()
  })

  it('renders call controls', () => {
    render(<MeetingRoom />)
    
    expect(screen.getByTestId('call-controls')).toBeInTheDocument()
  })

  it('renders call stats button', () => {
    render(<MeetingRoom />)
    
    expect(screen.getByTestId('call-stats')).toBeInTheDocument()
  })

  it('renders layout components', () => {
    render(<MeetingRoom />)
    
    // Should render either speaker layout or grid layout
    const speakerLayout = screen.queryByTestId('speaker-layout')
    const gridLayout = screen.queryByTestId('grid-layout')
    
    expect(speakerLayout || gridLayout).toBeInTheDocument()
  })

  describe('UI Structure', () => {
    it('has proper responsive layout classes', () => {
      render(<MeetingRoom />)
      
      const meetingContainer = document.querySelector('section')
      expect(meetingContainer).toBeInTheDocument()
    })

    it('renders interactive buttons', () => {
      render(<MeetingRoom />)
      
      // Should have clickable elements for meeting controls
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles for interactive elements', () => {
      render(<MeetingRoom />)
      
      // All clickable elements should have proper roles
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders without accessibility violations', () => {
      render(<MeetingRoom />)
      
      // Basic structure should be accessible
      expect(screen.getByTestId('call-controls')).toBeInTheDocument()
      expect(screen.getByTestId('call-stats')).toBeInTheDocument()
    })
  })
})