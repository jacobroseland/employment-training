import {
  type ApplicationFormValues,
  emptyApplicationFormValues,
} from '../JobSearchPipeline.types'
import ApplicationForm from './ApplicationForm'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { userEvent, within } from 'storybook/test'

type ApplicationFormStoryProps = {
  initialValues: ApplicationFormValues
  secondaryActionLabel: string
  submitLabel: string
}

function ApplicationFormStory({
  initialValues,
  secondaryActionLabel,
  submitLabel,
}: ApplicationFormStoryProps) {
  const [values, setValues] = useState(initialValues)

  return (
    <ApplicationForm
      values={values}
      secondaryActionLabel={secondaryActionLabel}
      submitLabel={submitLabel}
      onClear={() => setValues(emptyApplicationFormValues)}
      onSubmit={(nextValues) => setValues(nextValues)}
      onValueChange={(field, value) =>
        setValues((currentValues) => ({
          ...currentValues,
          [field]: value,
        }))
      }
    />
  )
}

const meta = {
  title: 'Exercises/Job Search Pipeline/Components/ApplicationForm',
  component: ApplicationFormStory,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ApplicationFormStory>

export default meta
type Story = StoryObj<typeof meta>

export const NewApplication: Story = {
  args: {
    initialValues: emptyApplicationFormValues,
    secondaryActionLabel: 'Clear form',
    submitLabel: 'Add application',
  },
}

export const EditingApplication: Story = {
  args: {
    initialValues: {
      companyName: 'Pomelo Care',
      roleTitle: 'Staff Software Engineer, Patient Experience',
      status: 'interviewing',
      workArrangement: 'remote',
      location: 'Remote - United States',
      salaryRange: '$220,000–$260,000, plus equity',
      jobUrl: 'https://www.pomelocare.com/',
      dateApplied: '2026-10-30',
      nextFollowUpDate: '2026-11-07',
      notes: 'Drafted a concise cover letter focused on patient experience.',
    },
    secondaryActionLabel: 'Cancel edit',
    submitLabel: 'Save changes',
  },
}

export const ValidationErrors: Story = {
  args: {
    initialValues: emptyApplicationFormValues,
    secondaryActionLabel: 'Clear form',
    submitLabel: 'Add application',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Add application' }),
    )
    await canvas.findByRole('alert')
  },
}
