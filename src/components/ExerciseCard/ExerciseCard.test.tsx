import type { Exercise } from '../../exercises/exerciseCatalog'
import ExerciseCard from './ExerciseCard'
import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const availableExercise: Exercise = {
  id: 'test-exercise',
  title: 'Test Exercise',
  description: 'A test description.',
  status: 'available',
  Component: () => null,
}

const comingSoonExercise: Exercise = {
  id: 'future-exercise',
  title: 'Future Exercise',
  description: 'A future test description.',
  status: 'coming-soon',
}

describe('ExerciseCard', () => {
  test('renders an available exercise and opens it', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()

    render(<ExerciseCard exercise={availableExercise} onOpen={onOpen} />)

    expect(
      screen.getByRole('heading', { name: 'Test Exercise' }),
    ).toBeInTheDocument()

    expect(screen.getByText('Available')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Open Test Exercise exercise' }),
    )

    expect(onOpen).toHaveBeenCalledWith('test-exercise')
  })

  test('does not render an open button for a coming-soon exercise', () => {
    const onOpen = jest.fn()

    render(<ExerciseCard exercise={comingSoonExercise} onOpen={onOpen} />)

    expect(screen.getByText('Coming soon')).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Open Future Exercise exercise' }),
    ).not.toBeInTheDocument()

    expect(onOpen).not.toHaveBeenCalled()
  })
})
