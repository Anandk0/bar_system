import { render, screen } from '@testing-library/react'
import { Navigation } from '../Navigation'
import { vi, describe, it, expect } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}))

describe('Navigation Component', () => {
  it('renders the correct brand name', () => {
    render(<Navigation />)
    expect(screen.getByText('Amtrana Bar')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navigation />)
    expect(screen.getByText('Godown')).toBeInTheDocument()
    expect(screen.getByText('Counter')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
