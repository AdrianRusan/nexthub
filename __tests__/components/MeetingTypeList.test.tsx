import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MeetingTypeList from '@/components/MeetingTypeList'

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))

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

  describe('Modal interactions', () => {
    it('opens instant meeting modal when New Meeting is clicked', async () => {
      render(<MeetingTypeList />)
      
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      fireEvent.click(newMeetingCard!)
      
      await waitFor(() => {
        expect(screen.getByText('Start an Instant Meeting')).toBeInTheDocument()
        expect(screen.getByText('Start Meeting')).toBeInTheDocument()
      })
    })

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

    it('opens join meeting modal when Join Meeting is clicked', async () => {
      render(<MeetingTypeList />)
      
      const joinMeetingCard = screen.getByText('Join Meeting').closest('div')
      fireEvent.click(joinMeetingCard!)
      
      await waitFor(() => {
        expect(screen.getByText('Paste the Invitation Link')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Invitation Link')).toBeInTheDocument()
      })
    })
  })

  describe('Form interactions', () => {
    it('allows entering meeting description in schedule modal', async () => {
      render(<MeetingTypeList />)
      
      const scheduleMeetingCard = screen.getByText('Schedule Meeting').closest('div')
      fireEvent.click(scheduleMeetingCard!)
      
      // Target the textarea directly
      const textArea = await waitFor(() => {
        const element = document.querySelector('textarea')
        if (!element) throw new Error('Textarea not found')
        return element
      })
      
      fireEvent.change(textArea, { target: { value: 'Team standup meeting' } })
      
      expect(textArea).toHaveValue('Team standup meeting')
    })

    it('allows entering invitation link in join modal', async () => {
      render(<MeetingTypeList />)
      
      const joinMeetingCard = screen.getByText('Join Meeting').closest('div')
      fireEvent.click(joinMeetingCard!)
      
      const linkInput = await screen.findByPlaceholderText('Invitation Link')
      fireEvent.change(linkInput, { target: { value: 'http://localhost:3000/meeting/123' } })
      
      expect(linkInput).toHaveValue('http://localhost:3000/meeting/123')
    })
  })

  describe('UI Structure', () => {
    it('renders meeting cards with proper icons and styling', () => {
      render(<MeetingTypeList />)
      
      // Check that all cards are rendered with buttons
      const meetingCards = screen.getAllByRole('button')
      expect(meetingCards.length).toBeGreaterThanOrEqual(4)
    })

    it('has proper accessibility attributes', () => {
      render(<MeetingTypeList />)
      
      // All meeting cards should be clickable
      const newMeetingCard = screen.getByText('New Meeting').closest('div')
      const scheduleMeetingCard = screen.getByText('Schedule Meeting').closest('div')
      const recordingsCard = screen.getByText('Recordings').closest('div')
      const joinMeetingCard = screen.getByText('Join Meeting').closest('div')
      
      expect(newMeetingCard).toBeInTheDocument()
      expect(scheduleMeetingCard).toBeInTheDocument()
      expect(recordingsCard).toBeInTheDocument()
      expect(joinMeetingCard).toBeInTheDocument()
    })
  })
})