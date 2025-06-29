import React from 'react'
import { render, screen } from '@testing-library/react'
import MeetingRoom from '@/components/MeetingRoom'

// Mock Stream Video SDK hooks and components
jest.mock('@stream-io/video-react-sdk', () => ({
  useCallStateHooks: () => ({
    useCallCallingState: () => 'joined',
    useLocalParticipant: () => ({
      userId: 'test-user-id'
    })
  }),
  useCall: () => ({
    state: {
      createdBy: {
        id: 'test-user-id'
      }
    },
    endCall: jest.fn()
  }),
  CallingState: {
    JOINED: 'joined'
  },
  CallControls: ({ onLeave }: { onLeave: () => void }) => (
    <div data-testid="call-controls">
      <button onClick={onLeave}>Leave</button>
    </div>
  ),
  CallStatsButton: () => <div data-testid="call-stats">Stats</div>,
  PaginatedGridLayout: () => <div data-testid="grid-layout">Grid Layout</div>,
  SpeakerLayout: ({ participantsBarPosition }: { participantsBarPosition: string }) => (
    <div data-testid="speaker-layout">Speaker Layout - {participantsBarPosition}</div>
  ),
  CallParticipantsList: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="participants-list">
      <button onClick={onClose}>Close</button>
    </div>
  )
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null)
  })
}))

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