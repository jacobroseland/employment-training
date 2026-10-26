import JobSearchPipeline from './JobSearchPipeline'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function getRenderedApplicationNames() {
  return within(screen.getByRole('list'))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent ?? '')
}

describe('JobSearchPipeline', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders its labelled exercise region and seeded applications', () => {
    render(<JobSearchPipeline />)

    expect(
      screen.getByRole('region', { name: 'Job Search Pipeline' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Job Search Pipeline' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: 'Assured' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: 'NexHealth' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: 'Owner' }),
    ).toBeInTheDocument()
  })

  test('filters applications by the selected status', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.selectOptions(
      screen.getByLabelText('Filter by status'),
      'interviewing',
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Owner' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { level: 3, name: 'Assured' }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { level: 3, name: 'NexHealth' }),
    ).not.toBeInTheDocument()
  })

  test('loads valid saved applications instead of sample applications', () => {
    localStorage.setItem(
      'job-search-pipeline-applications',
      JSON.stringify([
        {
          id: 'saved-application',
          companyName: 'Saved Company',
          roleTitle: 'Saved Role',
          status: 'saved',
          workArrangement: 'remote',
          location: null,
          jobUrl: null,
          dateApplied: null,
          nextFollowUpDate: null,
          notes: null,
          createdAt: '2026-10-26T12:00:00.000Z',
        },
      ]),
    )

    render(<JobSearchPipeline />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Saved Company' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: 'Assured' }),
    ).not.toBeInTheDocument()
  })

  test('uses sample applications when saved data is malformed', () => {
    localStorage.setItem('job-search-pipeline-applications', 'not valid JSON')

    render(<JobSearchPipeline />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Assured' }),
    ).toBeInTheDocument()
  })

  test('shows an empty state when no applications match the selected status', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.selectOptions(screen.getByLabelText('Filter by status'), 'offer')

    expect(
      screen.getByText('No applications match the selected status.'),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { level: 3, name: 'Assured' }),
    ).not.toBeInTheDocument()
  })

  test('sorts applications by most recently added first by default', () => {
    render(<JobSearchPipeline />)

    expect(getRenderedApplicationNames()).toEqual([
      'NexHealth',
      'Assured',
      'Owner',
    ])
  })

  test('sorts applications alphabetically by company name', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.selectOptions(screen.getByLabelText('Sort by'), 'company-name')

    expect(getRenderedApplicationNames()).toEqual([
      'Assured',
      'NexHealth',
      'Owner',
    ])
  })

  test('sorts applications without a follow-up date last', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.selectOptions(screen.getByLabelText('Sort by'), 'next-follow-up')

    expect(getRenderedApplicationNames()).toEqual([
      'Assured',
      'Owner',
      'NexHealth',
    ])
  })

  test('shows accessible validation errors for missing required form values', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.click(screen.getByRole('button', { name: 'Add an application' }))

    await user.click(screen.getByRole('button', { name: 'Save application' }))

    expect(screen.getByText('Enter a company name.')).toBeInTheDocument()
    expect(screen.getByText('Enter a role title.')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: /company name/i }),
    ).toHaveAttribute('aria-invalid', 'true')
  })

  test('adds a validated application and clears the form', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.click(screen.getByRole('button', { name: 'Add an application' }))

    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Example Labs',
    )
    await user.type(
      screen.getByRole('textbox', { name: /role title/i }),
      'Frontend Engineer',
    )
    await user.selectOptions(screen.getByLabelText('Status'), 'applied')
    await user.selectOptions(
      screen.getByLabelText('Work arrangement'),
      'hybrid',
    )
    await user.type(screen.getByLabelText('Location'), 'Remote')
    await user.type(
      screen.getByLabelText('Job listing URL'),
      'https://example.com/jobs/frontend-engineer',
    )
    await user.type(screen.getByLabelText('Notes'), 'A promising role.')

    await user.click(screen.getByRole('button', { name: 'Save application' }))

    const exampleApplication = screen
      .getByRole('heading', { level: 3, name: 'Example Labs' })
      .closest('article')

    expect(exampleApplication).not.toBeNull()

    const exampleApplicationDetails = within(exampleApplication as HTMLElement)

    expect(
      exampleApplicationDetails.getByText('Frontend Engineer'),
    ).toBeInTheDocument()
    expect(exampleApplicationDetails.getByText('Hybrid')).toBeInTheDocument()
    expect(
      exampleApplicationDetails.getByText('A promising role.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add an application' }),
    ).toHaveAttribute('aria-expanded', 'false')

    await user.click(screen.getByRole('button', { name: 'Add an application' }))

    expect(screen.getByRole('textbox', { name: /company name/i })).toHaveValue(
      '',
    )
    expect(screen.getByRole('textbox', { name: /role title/i })).toHaveValue('')

    expect(
      JSON.parse(
        localStorage.getItem('job-search-pipeline-applications') ?? '[]',
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          companyName: 'Example Labs',
          roleTitle: 'Frontend Engineer',
          status: 'applied',
          workArrangement: 'hybrid',
        }),
      ]),
    )
  })

  test('hides and reopens the form without losing in-progress input', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    const formToggle = screen.getByRole('button', {
      name: 'Add an application',
    })

    expect(formToggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(formToggle)
    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Partial application',
    )
    await user.click(
      screen.getByRole('button', { name: 'Hide application form' }),
    )

    expect(
      screen.queryByRole('textbox', { name: /company name/i }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add an application' }))

    expect(screen.getByRole('textbox', { name: /company name/i })).toHaveValue(
      'Partial application',
    )
  })

  test('clears current form values and validation errors', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    await user.click(screen.getByRole('button', { name: 'Add an application' }))
    await user.click(screen.getByRole('button', { name: 'Save application' }))

    expect(screen.getByText('Enter a company name.')).toBeInTheDocument()

    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Example Labs',
    )
    await user.click(screen.getByRole('button', { name: 'Clear form' }))

    expect(screen.getByRole('textbox', { name: /company name/i })).toHaveValue(
      '',
    )
    expect(screen.queryByText('Enter a company name.')).not.toBeInTheDocument()
  })

  test('edits an existing application without creating a duplicate', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    const ownerApplication = screen
      .getByRole('heading', { level: 3, name: 'Owner' })
      .closest('article')

    expect(ownerApplication).not.toBeNull()

    await user.click(
      within(ownerApplication as HTMLElement).getByRole('button', {
        name: 'Edit Owner',
      }),
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Edit application' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /company name/i })).toHaveValue(
      'Owner',
    )
    expect(screen.getByLabelText('Status')).toHaveValue('interviewing')

    await user.clear(screen.getByRole('textbox', { name: /company name/i }))
    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Owner Labs',
    )
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      screen.getByRole('heading', { level: 3, name: 'Owner Labs' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: 'Owner' }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  test('scrolls the populated form into view when editing begins', async () => {
    const user = userEvent.setup()
    const scrollIntoView = jest.fn()

    render(<JobSearchPipeline />)

    const formSection = document.getElementById('application-form-panel')

    expect(formSection).not.toBeNull()

    Object.defineProperty(formSection, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })

    const ownerApplication = screen
      .getByRole('heading', { level: 3, name: 'Owner' })
      .closest('article')

    expect(ownerApplication).not.toBeNull()

    await user.click(
      within(ownerApplication as HTMLElement).getByRole('button', {
        name: 'Edit Owner',
      }),
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  test('confirms deletion before removing an application', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    const ownerApplication = screen
      .getByRole('heading', { level: 3, name: 'Owner' })
      .closest('article')

    expect(ownerApplication).not.toBeNull()

    await user.click(
      within(ownerApplication as HTMLElement).getByRole('button', {
        name: 'Delete Owner',
      }),
    )

    expect(
      screen.getByRole('group', { name: 'Delete Owner confirmation' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Owner' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirm delete' }))

    expect(
      screen.queryByRole('heading', { level: 3, name: 'Owner' }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(
      localStorage.getItem('job-search-pipeline-applications'),
    ).not.toContain('owner-senior-software-engineer')
  })

  test('cancels a pending deletion without changing the application', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    const assuredApplication = screen
      .getByRole('heading', { level: 3, name: 'Assured' })
      .closest('article')

    expect(assuredApplication).not.toBeNull()

    await user.click(
      within(assuredApplication as HTMLElement).getByRole('button', {
        name: 'Delete Assured',
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Keep application' }))

    expect(
      screen.getByRole('heading', { level: 3, name: 'Assured' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Delete Assured' }),
    ).toBeInTheDocument()
  })

  test('cancels an edit without changing the application', async () => {
    const user = userEvent.setup()

    render(<JobSearchPipeline />)

    const assuredApplication = screen
      .getByRole('heading', { level: 3, name: 'Assured' })
      .closest('article')

    expect(assuredApplication).not.toBeNull()

    await user.click(
      within(assuredApplication as HTMLElement).getByRole('button', {
        name: 'Edit Assured',
      }),
    )
    await user.clear(screen.getByRole('textbox', { name: /company name/i }))
    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Changed name',
    )
    await user.click(screen.getByRole('button', { name: 'Cancel edit' }))

    expect(
      screen.getByRole('heading', { level: 3, name: 'Assured' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: 'Changed name' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add an application' }),
    ).toHaveAttribute('aria-expanded', 'false')
  })
})
