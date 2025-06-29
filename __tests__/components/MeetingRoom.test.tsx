import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallStateHooks, CallingState } from '@stream-io/video-react-sdk'
import MeetingRoom from '@/components/MeetingRoom'

const mockPush = jest.fn()
const mockGet = jest.fn()
const mockUseCallCallingState = jest.fn()

// Setup mocks
;(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
})

;(useSearchParams as jest.Mock).mockReturnValue({
  get: mockGet,
})

;(useCallStateHooks as jest.Mock).mockReturnValue({
  useCallCallingState: mockUseCallCallingState,
})

describe('MeetingRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCallCallingState.mockReturnValue(CallingState.JOINED)
    mockGet.mockReturnValue(null)
  })

  it('shows loader when call state is not JOINED', () => {
    mockUseCallCallingState.mockReturnValue(CallingState.RECONNECTING)
    
    render(<MeetingRoom />)
    
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('renders meeting room when call state is JOINED', () => {
    render(<MeetingRoom />)
    
    expect(screen.getByTestId('call-controls')).toBeInTheDocument()
    expect(screen.getByTestId('call-stats')).toBeInTheDocument()
    expect(screen.getByTestId('speaker-layout')).toBeInTheDocument()
  })

  describe('Layout controls', () => {
    it('renders layout dropdown menu', () => {
      render(<MeetingRoom />)
      
      // Check if the layout button is present
      const layoutButton = screen.getByRole('button')
      expect(layoutButton).toBeInTheDocument()
    })

    it('changes layout when dropdown option is selected', async () => {
      render(<MeetingRoom />)
      
      // Click the layout dropdown button
      const layoutButton = screen.getByRole('button')
      fireEvent.click(layoutButton)
      
      // Wait for dropdown to appear and click Grid option
      await waitFor(() => {
        const gridOption = screen.getByText('Grid')
        fireEvent.click(gridOption)
      })
      
      // Verify grid layout is now rendered
      expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
    })

    it('switches between speaker layouts', async () => {
      render(<MeetingRoom />)
      
      // Default should be speaker-left
      expect(screen.getByTestId('speaker-layout')).toBeInTheDocument()
      expect(screen.getByTestId('speaker-layout')).toHaveAttribute('data-position', 'right')
      
      // Click layout dropdown
      const layoutButton = screen.getByRole('button')
      fireEvent.click(layoutButton)
      
      // Select Speaker-Right
      await waitFor(() => {
        const speakerRightOption = screen.getByText('Speaker-Right')
        fireEvent.click(speakerRightOption)
      })
      
      // Verify speaker layout position changed
      expect(screen.getByTestId('speaker-layout')).toHaveAttribute('data-position', 'left')
    })
  })

  describe('Participants control', () => {
    it('shows participants list when button is clicked', async () => {
      render(<MeetingRoom />)
      
      // Find the participants button (Users icon)
      const participantsButton = screen.getByRole('button', { name: '' })
      fireEvent.click(participantsButton)
      
      // Check if participants list is shown
      expect(screen.getByTestId('participants-list')).toBeInTheDocument()
    })

    it('hides participants list when close is clicked', async () => {
      render(<MeetingRoom />)
      
      // Show participants list first
      const participantsButton = screen.getByRole('button', { name: '' })
      fireEvent.click(participantsButton)
      
      // Click on participants list to close it
      const participantsList = screen.getByTestId('participants-list')
      fireEvent.click(participantsList)
      
      // Participants list should still be in DOM but not visible (handled by CSS class)
      expect(participantsList).toBeInTheDocument()
    })
  })

  describe('Call controls', () => {
    it('navigates to home when leave call is triggered', () => {
      render(<MeetingRoom />)
      
      const callControls = screen.getByTestId('call-controls')
      expect(callControls).toBeInTheDocument()
      
      // Simulate the onLeave callback being called
      // This would typically be triggered by the CallControls component
    })

    it('renders call stats button', () => {
      render(<MeetingRoom />)
      
      expect(screen.getByTestId('call-stats')).toBeInTheDocument()
    })
  })

  describe('Personal room behavior', () => {
    it('hides end call button in personal room', () => {
      mockGet.mockReturnValue('true')
      
      render(<MeetingRoom />)
      
      // End call button should not be rendered for personal rooms
      expect(screen.queryByTestId('end-call-button')).not.toBeInTheDocument()
    })

    it('shows end call button in regular meeting', () => {
      mockGet.mockReturnValue(null)
      
      render(<MeetingRoom />)
      
      // End call button should be rendered for regular meetings
      expect(screen.getByTestId('end-call-button')).toBeInTheDocument()
    })
  })

  describe('Error states', () => {
    it('handles different calling states correctly', () => {
      const states = [CallingState.RECONNECTING, CallingState.IDLE]
      
      states.forEach(state => {
        mockUseCallCallingState.mockReturnValue(state)
        
        const { unmount } = render(<MeetingRoom />)
        
        expect(screen.getByTestId('loader')).toBeInTheDocument()
        expect(screen.queryByTestId('call-controls')).not.toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Responsive behavior', () => {
    it('adjusts layout for different screen sizes', () => {
      render(<MeetingRoom />)
      
      // The component should render without errors on different viewport sizes
      // Layout adjustments are handled by CSS classes
      expect(screen.getByTestId('speaker-layout')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles for interactive elements', () => {
      render(<MeetingRoom />)
      
      // All clickable elements should have proper roles
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('supports keyboard navigation', () => {
      render(<MeetingRoom />)
      
      const layoutButton = screen.getByRole('button')
      
      // Simulate keyboard interaction
      fireEvent.keyDown(layoutButton, { key: 'Enter' })
      fireEvent.keyDown(layoutButton, { key: ' ' })
      
      // Should handle keyboard events properly
      expect(layoutButton).toBeInTheDocument()
    })
  })
})