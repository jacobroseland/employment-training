import type { JobApplication } from '../JobSearchPipeline.types'
import ApplicationCard from './ApplicationCard'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

const application: JobApplication = {
  id: 'pomelo-care-staff-software-engineer',
  companyName: 'Pomelo Care',
  roleTitle: 'Staff Software Engineer, Patient Experience',
  status: 'interviewing',
  workArrangement: 'remote',
  location: 'Remote - United States',
  salaryRange: '$220,000–$260,000, plus equity',
  jobUrl: 'https://www.pomelocare.com/',
  dateApplied: '2026-10-30',
  nextFollowUpDate: '2026-11-07',
  notes:
    'Patient-facing healthcare software with a focus on engagement, React Native, and AI-assisted development.',
  createdAt: '2026-10-30T15:00:00.000Z',
}

const meta = {
  title: 'Exercises/Job Search Pipeline/Components/ApplicationCard',
  component: ApplicationCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    application,
    isDeleteConfirmationVisible: false,
    onDeleteCancel: fn(),
    onDeleteConfirm: fn(),
    onDeleteRequest: fn(),
    onEdit: fn(),
  },
} satisfies Meta<typeof ApplicationCard>

export default meta
type Story = StoryObj<typeof meta>

export const Interviewing: Story = {}

export const Saved: Story = {
  args: {
    application: {
      ...application,
      status: 'saved',
      dateApplied: null,
      nextFollowUpDate: null,
    },
  },
}

export const ConfirmDelete: Story = {
  args: {
    isDeleteConfirmationVisible: true,
  },
}
