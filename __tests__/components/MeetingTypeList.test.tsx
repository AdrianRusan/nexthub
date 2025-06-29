import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import MeetingTypeList from '@/components/MeetingTypeList'

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}))

const mockPush = jest.fn()
const mockToast = jest.fn()
const mockCall = {
  id: 'test-call-id',
  getOrCreate: jest.fn().mockResolvedValue({}),
}
const mockClient = {
  call: jest.fn().mockReturnValue(mockCall),
}

// Setup mocks
;(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
})

;(useToast as jest.Mock).mockReturnValue({
  toast: mockToast,
})

;(useStreamVideoClient as jest.Mock).mockReturnValue(mockClient)

;(useUser as jest.Mock).mockReturnValue({
  user: {
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
  },
})

describe('MeetingTypeList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock crypto.randomUUID for consistent testing
    global.crypto.randomUUID = jest.fn().mockReturnValue('test-uuid-123')
  })

  it('renders all meeting type cards', () => {
    render(<MeetingTypeList />)
    
    expect(screen.getByText('New Meeting')).toBeInTheDocument()
    expect(screen.getByText('Start a new meeting')).toBeInTheDocument()
    
    expect(screen.getByText('Schedule Meeting')).toBeInTheDocument()
    expect(screen.getByText('Schedule a meeting')).toBeInTheDocument()
    
    expect(screen.getByText('Recordings')).toBeInTheDocument()
    expect(screen.getByText('Watch previous recordings')).toBeInTheDocument()
    
    expect(screen.getByText('Join Meeting')).toBeInTheDocument()
    expect(screen.getByText('via an invitation link')).toBeInTheDocument()
  })

  describe('New Meeting functionality', () => {
    it('opens instant meeting modal when New Meeting is clicked', async () => {
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      await waitFor(() => {
        expect(screen.getByText('Start an Instant Meeting')).toBeInTheDocument()
        expect(screen.getByText('Start Meeting')).toBeInTheDocument()
      })
    })

    it('creates instant meeting and navigates to meeting room', async () => {
      render(<MeetingTypeList />)
      
      // Click New Meeting card
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      // Click Start Meeting button
      const startButton = await screen.findByText('Start Meeting')
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(mockClient.call).toHaveBeenCalledWith('default', 'test-uuid-123')
        expect(mockCall.getOrCreate).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/meeting/test-call-id')
      })
    })

    it('shows success toast when instant meeting is created', async () => {
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      const startButton = await screen.findByText('Start Meeting')
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Success',
          description: 'The meeting was created successfully',
          duration: 5000
        })
      })
    })

    it('shows error toast when meeting creation fails', async () => {
      mockCall.getOrCreate.mockRejectedValueOnce(new Error('Network error'))
      
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      const startButton = await screen.findByText('Start Meeting')
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'I could not create the meeting. Please try again later.',
          duration: 5000
        })
      })
    })
  })

  describe('Schedule Meeting functionality', () => {
    it('opens schedule meeting modal when Schedule Meeting is clicked', async () => {
      render(<MeetingTypeList />)
      
      const scheduleMeetingCard = screen.getByText('Schedule Meeting').closest('div')
      fireEvent.click(scheduleMeetingCard!)
      
      await waitFor(() => {
        expect(screen.getByText('Schedule a Meeting')).toBeInTheDocument()
        expect(screen.getByText('Add a description')).toBeInTheDocument()
        expect(screen.getByText('Select a date and time')).toBeInTheDocument()
      })
    })

    it('allows entering meeting description', async () => {
      const user = userEvent.setup()
      render(<MeetingTypeList />)
      
      const scheduleMeetingCard = screen.getByText('Schedule Meeting').closest('div')
      fireEvent.click(scheduleMeetingCard!)
      
      const textArea = await screen.findByRole('textbox')
      await user.type(textArea, 'Team standup meeting')
      
      expect(textArea).toHaveValue('Team standup meeting')
    })

    it('shows success modal after scheduling meeting', async () => {
      render(<MeetingTypeList />)
      
      const scheduleMeetingCard = screen.getByText('Schedule Meeting').closest('div')
      fireEvent.click(scheduleMeetingCard!)
      
      // Find the Schedule Meeting button in the modal
      const scheduleButton = await screen.findByRole('button', { name: /schedule meeting/i })
      fireEvent.click(scheduleButton)
      
      await waitFor(() => {
        expect(screen.getByText('Meeting Scheduled Successfully!')).toBeInTheDocument()
        expect(screen.getByText('Copy the Invitation Link')).toBeInTheDocument()
      })
    })

    it('copies invitation link to clipboard', async () => {
      render(<MeetingTypeList />)
      
      const scheduleMeetingCard = screen.getByText('Schedule Meeting').closest('div')
      fireEvent.click(scheduleMeetingCard!)
      
      const scheduleButton = await screen.findByRole('button', { name: /schedule meeting/i })
      fireEvent.click(scheduleButton)
      
      const copyButton = await screen.findByText('Copy the Invitation Link')
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'http://localhost:3000/meeting/test-call-id'
        )
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Link copied',
          duration: 5000
        })
      })
    })
  })

  describe('Join Meeting functionality', () => {
    it('opens join meeting modal when Join Meeting is clicked', async () => {
      render(<MeetingTypeList />)
      
      const joinMeetingCard = screen.getByText('Join Meeting').closest('div')
      fireEvent.click(joinMeetingCard!)
      
      await waitFor(() => {
        expect(screen.getByText('Paste the Invitation Link')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Invitation Link')).toBeInTheDocument()
      })
    })

    it('allows entering invitation link and joining meeting', async () => {
      const user = userEvent.setup()
      render(<MeetingTypeList />)
      
      const joinMeetingCard = screen.getByText('Join Meeting').closest('div')
      fireEvent.click(joinMeetingCard!)
      
      const linkInput = await screen.findByPlaceholderText('Invitation Link')
      await user.type(linkInput, 'http://localhost:3000/meeting/123')
      
      const joinButton = screen.getByText('Join Meeting')
      fireEvent.click(joinButton)
      
      expect(mockPush).toHaveBeenCalledWith('http://localhost:3000/meeting/123')
    })
  })

  describe('Recordings functionality', () => {
    it('navigates to recordings page when Recordings is clicked', () => {
      render(<MeetingTypeList />)
      
      const recordingsCard = screen.getByText('Recordings').closest('div')
      fireEvent.click(recordingsCard!)
      
      expect(mockPush).toHaveBeenCalledWith('/recordings')
    })
  })

  describe('Error states', () => {
    it('shows error when no client is available', async () => {
      ;(useStreamVideoClient as jest.Mock).mockReturnValueOnce(null)
      
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      const startButton = await screen.findByText('Start Meeting')
      fireEvent.click(startButton)
      
      // Should not navigate or call client methods
      expect(mockClient.call).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('shows error when no user is available', async () => {
      ;(useUser as jest.Mock).mockReturnValueOnce({ user: null })
      
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      const startButton = await screen.findByText('Start Meeting')
      fireEvent.click(startButton)
      
      // Should not navigate or call client methods
      expect(mockClient.call).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Modal interactions', () => {
    it('closes modal when clicking outside or close button', async () => {
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      // Modal should be open
      expect(screen.getByText('Start an Instant Meeting')).toBeInTheDocument()
      
      // Simulate ESC key press to close modal
      fireEvent.keyDown(document, { key: 'Escape' })
      
      await waitFor(() => {
        expect(screen.queryByText('Start an Instant Meeting')).not.toBeInTheDocument()
      })
    })
  })
})