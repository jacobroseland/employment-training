import HelloWorld from './HelloWorld'
import { describe, expect, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

describe('HelloWorld', () => {
  test('renders its labelled exercise region and greeting', () => {
    render(<HelloWorld />)

    expect(
      screen.getByRole('region', { name: 'Hello, World!' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Hello, World!' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Hello!' }),
    ).toBeInTheDocument()
  })
})
