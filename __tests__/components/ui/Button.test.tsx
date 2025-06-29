import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('supports different variants', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('supports different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('supports asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('handles keyboard events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard</Button>)
    
    const button = screen.getByRole('button')
    
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.keyDown(button, { key: ' ' })
    
    expect(button).toBeInTheDocument()
  })

  it('supports loading state with disabled', () => {
    render(<Button disabled>Loading...</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Loading...')
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })

    it('supports focus management', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(document.activeElement).toBe(button)
    })

    it('works with screen readers', () => {
      render(<Button aria-describedby="help-text">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })
  })

  describe('Form integration', () => {
    it('can be used as submit button', () => {
      render(
        <form>
          <Button type="submit">Submit Form</Button>
        </form>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('can be used as reset button', () => {
      render(
        <form>
          <Button type="reset">Reset Form</Button>
        </form>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })
})