import { expect, test } from '@playwright/test'

test('generates an API draft and applies it to a new application form', async ({
  page,
}) => {
  await page.route('**/api/application-draft', async (route) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        draft: {
          companyName: 'Example Labs',
          roleTitle: 'Senior Frontend Engineer',
          workArrangement: 'hybrid',
          location: 'Austin, Texas',
          salaryRange: '$160,000–$190,000 annually',
          jobUrl: 'https://example.com/jobs/frontend-engineer',
          notes: '',
        },
      }),
    })
  })

  await page.goto('/exercises/job-search-pipeline')

  await page.getByRole('button', { name: 'Add an application' }).click()

  await expect(
    page.getByRole('heading', { level: 3, name: 'New application' }),
  ).toBeVisible()

  await page.getByText('Draft from a job description', { exact: true }).click()

  await page
    .getByLabel('Job description')
    .fill('Hybrid role: https://example.com/jobs/frontend-engineer')

  await page.getByRole('button', { name: 'Generate draft' }).click()

  await expect(page.getByRole('status')).toHaveText(
    'Reviewing the job description…',
  )
  await expect(
    page.getByRole('button', { name: 'Generating draft…' }),
  ).toBeDisabled()

  await expect(
    page.getByRole('heading', { level: 4, name: 'Suggested details' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Use this draft' }).click()

  await expect(
    page.getByRole('textbox', { name: 'Company name', exact: true }),
  ).toHaveValue('Example Labs')
  await expect(
    page.getByRole('textbox', { name: 'Role title', exact: true }),
  ).toHaveValue('Senior Frontend Engineer')
  await expect(page.getByLabel('Work arrangement')).toHaveValue('hybrid')
  await expect(page.getByLabel('Salary range')).toHaveValue(
    '$160,000–$190,000 annually',
  )
  await expect(page.getByLabel('Job listing URL')).toHaveValue(
    'https://example.com/jobs/frontend-engineer',
  )
})
