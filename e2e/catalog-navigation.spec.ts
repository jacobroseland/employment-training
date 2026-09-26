import { expect, test } from '@playwright/test'

test('opens the Hello World exercise and returns to the catalog', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Exercise Catalog' }),
  ).toBeVisible()

  await page
    .getByRole('button', { name: 'Open Hello, World! exercise' })
    .click()

  await expect(page).toHaveURL('/exercises/hello-world')

  await expect(
    page.getByRole('heading', { level: 2, name: 'Hello, World!' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Back to catalog' }).click()

  await expect(page).toHaveURL('/')

  await expect(
    page.getByRole('heading', { name: 'Exercise Catalog' }),
  ).toBeVisible()
})

test('opens learning materials and returns to the catalog', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Learning docs' }).click()

  await expect(page).toHaveURL('/learning')

  await expect(
    page.getByRole('heading', { name: 'Learning materials' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Back to catalog' }).click()

  await expect(page).toHaveURL('/')

  await expect(
    page.getByRole('heading', { name: 'Exercise Catalog' }),
  ).toBeVisible()
})
