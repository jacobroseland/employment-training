import ApplicationDraftPanel from './ApplicationDraftPanel'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, http, HttpResponse } from 'msw'
import { fn, userEvent, within } from 'storybook/test'

const applicationDraftEndpoint = '/api/application-draft'

const jobDescription =
  'Company: Pomelo Care\nRole: Staff Software Engineer, Patient Experience\n\nRemote healthcare software role focused on React, TypeScript, and patient engagement.'

const draft = {
  companyName: 'Pomelo Care',
  roleTitle: 'Staff Software Engineer, Patient Experience',
  workArrangement: 'remote' as const,
  location: 'Remote - United States',
  salaryRange: '$220,000–$260,000, plus equity',
  jobUrl: '',
  notes: 'Healthcare software focused on patient experience and engagement.',
}

const meta = {
  title: 'Exercises/Job Search Pipeline/Components/ApplicationDraftPanel',
  component: ApplicationDraftPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MSW supplies deterministic API responses for the loading, generated-draft, and request-error states.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onUseDraft: fn(),
  },
} satisfies Meta<typeof ApplicationDraftPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const GeneratedDraft: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(applicationDraftEndpoint, () => {
          return HttpResponse.json({ draft })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByText('Draft from a job description', { selector: 'summary' }),
    )
    await userEvent.type(
      canvas.getByLabelText('Job description'),
      jobDescription,
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Generate draft' }),
    )
    await canvas.findByRole('heading', { name: 'Suggested details' })
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(applicationDraftEndpoint, async () => {
          await delay('infinite')
          return HttpResponse.json({ draft })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByText('Draft from a job description', { selector: 'summary' }),
    )
    await userEvent.type(
      canvas.getByLabelText('Job description'),
      jobDescription,
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Generate draft' }),
    )
    await canvas.findByRole('status')
  },
}

export const RequestError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(applicationDraftEndpoint, () => {
          return new HttpResponse(null, { status: 500 })
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByText('Draft from a job description', { selector: 'summary' }),
    )
    await userEvent.type(
      canvas.getByLabelText('Job description'),
      jobDescription,
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Generate draft' }),
    )
    await canvas.findByRole('alert')
  },
}
