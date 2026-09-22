import App from './App'
import { describe, expect, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  test('opens the learning materials from the exercise catalog', async () => {
    const user = userEvent.setup()

    renderApp()

    expect(
      screen.getByRole('heading', { name: 'Exercise Catalog' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Learning docs' }))

    expect(
      screen.getByRole('heading', { name: 'Learning materials' }),
    ).toBeInTheDocument()
  })

  test('returns to the exercise catalog from learning materials', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.click(screen.getByRole('link', { name: 'Learning docs' }))

    expect(
      screen.getByRole('heading', { name: 'Learning materials' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Back to catalog' }))

    expect(
      screen.getByRole('heading', { name: 'Exercise Catalog' }),
    ).toBeInTheDocument()
  })

  test('opens a learning document and returns to learning materials', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.click(screen.getByRole('link', { name: 'Learning docs' }))

    await user.click(
      screen.getByRole('button', { name: /React component patterns/ }),
    )

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'React component patterns',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', { name: 'Back to learning docs' }),
    )

    expect(
      screen.getByRole('heading', { name: 'Learning materials' }),
    ).toBeInTheDocument()
  })

  test('opens the Hello World exercise and returns to the catalog', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.click(
      screen.getByRole('button', { name: 'Open Hello, World! exercise' }),
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Hello, World!' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Back to catalog' }))

    expect(
      screen.getByRole('heading', { name: 'Exercise Catalog' }),
    ).toBeInTheDocument()
  })

  test('redirects an unknown exercise URL to the catalog', () => {
    renderApp(['/exercises/not-real'])

    expect(
      screen.getByRole('heading', { name: 'Exercise Catalog' }),
    ).toBeInTheDocument()
  })

  test('redirects an unavailable exercise URL to the catalog', () => {
    renderApp(['/exercises/personal-greeting'])

    expect(
      screen.getByRole('heading', { name: 'Exercise Catalog' }),
    ).toBeInTheDocument()
  })

  test('redirects an unknown learning-document URL to learning materials', () => {
    renderApp(['/learning/not-real'])

    expect(
      screen.getByRole('heading', { name: 'Learning materials' }),
    ).toBeInTheDocument()
  })
})
