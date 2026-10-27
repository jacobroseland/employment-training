import { expect, test } from '@playwright/test'

test('generates a practice draft and applies it to a new application form', async ({
  page,
}) => {
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
  ).toHaveValue('Example Company')
  await expect(
    page.getByRole('textbox', { name: 'Role title', exact: true }),
  ).toHaveValue('Senior Software Engineer')
  await expect(page.getByLabel('Work arrangement')).toHaveValue('hybrid')
  await expect(page.getByLabel('Job listing URL')).toHaveValue(
    'https://example.com/jobs/frontend-engineer',
  )
})
