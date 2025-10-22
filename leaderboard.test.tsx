import { render, screen } from '@testing-library/react'
import { Leaderboard } from '../Leaderboard'

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: [],
    isLoading: false,
  }),
}))

describe('Leaderboard', () => {
  it('renders the leaderboard component', () => {
    render(<Leaderboard />)
    expect(screen.getByText('Live Results')).toBeInTheDocument()
  })
})
