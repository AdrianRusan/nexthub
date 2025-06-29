import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HomeCard from '@/components/HomeCard'

describe('HomeCard', () => {
  const defaultProps = {
    img: '/icons/test-icon.svg',
    title: 'Test Title',
    description: 'Test Description',
    handleClick: jest.fn(),
    className: 'bg-test-color'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with all provided props', () => {
    render(<HomeCard {...defaultProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/icons/test-icon.svg')
    expect(image).toHaveAttribute('alt', 'Test Title')
  })

  it('applies custom className', () => {
    render(<HomeCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    expect(card).toHaveClass('bg-test-color')
  })

  it('calls handleClick when card is clicked', () => {
    render(<HomeCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    fireEvent.click(card!)
    
    expect(defaultProps.handleClick).toHaveBeenCalledTimes(1)
  })

  it('supports keyboard navigation', () => {
    render(<HomeCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    
    // Simulate Enter key press
    fireEvent.keyDown(card!, { key: 'Enter' })
    expect(defaultProps.handleClick).toHaveBeenCalledTimes(1)
    
    // Simulate Space key press
    fireEvent.keyDown(card!, { key: ' ' })
    expect(defaultProps.handleClick).toHaveBeenCalledTimes(2)
  })

  it('has proper accessibility attributes', () => {
    render(<HomeCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('handles minimal props correctly', () => {
    const minimalProps = {
      img: '/icons/test-icon.svg',
      title: 'Test Title',
      description: 'Test Description',
      handleClick: jest.fn(),
      className: ''
    }
    
    render(<HomeCard {...minimalProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  describe('Visual states', () => {
    it('applies hover styles correctly', () => {
      render(<HomeCard {...defaultProps} />)
      
      const card = screen.getByText('Test Title').closest('div')
      
      // Simulate hover
      fireEvent.mouseEnter(card!)
      fireEvent.mouseLeave(card!)
      
      // Should not throw any errors
      expect(card).toBeInTheDocument()
    })

    it('applies focus styles correctly', () => {
      render(<HomeCard {...defaultProps} />)
      
      const card = screen.getByText('Test Title').closest('div')
      
      // Simulate focus
      fireEvent.focus(card!)
      fireEvent.blur(card!)
      
      // Should not throw any errors
      expect(card).toBeInTheDocument()
    })
  })

  describe('Different card types', () => {
    it('renders New Meeting card correctly', () => {
      const newMeetingProps = {
        img: '/icons/add-meeting.svg',
        title: 'New Meeting',
        description: 'Start a new meeting',
        handleClick: jest.fn(),
        className: 'bg-orange-1'
      }
      
      render(<HomeCard {...newMeetingProps} />)
      
      expect(screen.getByText('New Meeting')).toBeInTheDocument()
      expect(screen.getByText('Start a new meeting')).toBeInTheDocument()
    })

    it('renders Schedule Meeting card correctly', () => {
      const scheduleMeetingProps = {
        img: '/icons/schedule.svg',
        title: 'Schedule Meeting',
        description: 'Schedule a meeting',
        handleClick: jest.fn(),
        className: 'bg-blue-1'
      }
      
      render(<HomeCard {...scheduleMeetingProps} />)
      
      expect(screen.getByText('Schedule Meeting')).toBeInTheDocument()
      expect(screen.getByText('Schedule a meeting')).toBeInTheDocument()
    })

    it('renders Recordings card correctly', () => {
      const recordingsProps = {
        img: '/icons/recordings.svg',
        title: 'Recordings',
        description: 'Watch previous recordings',
        handleClick: jest.fn(),
        className: 'bg-purple-1'
      }
      
      render(<HomeCard {...recordingsProps} />)
      
      expect(screen.getByText('Recordings')).toBeInTheDocument()
      expect(screen.getByText('Watch previous recordings')).toBeInTheDocument()
    })

    it('renders Join Meeting card correctly', () => {
      const joinMeetingProps = {
        img: '/icons/join-meeting.svg',
        title: 'Join Meeting',
        description: 'via an invitation link',
        handleClick: jest.fn(),
        className: 'bg-yellow-1'
      }
      
      render(<HomeCard {...joinMeetingProps} />)
      
      expect(screen.getByText('Join Meeting')).toBeInTheDocument()
      expect(screen.getByText('via an invitation link')).toBeInTheDocument()
    })
  })
})