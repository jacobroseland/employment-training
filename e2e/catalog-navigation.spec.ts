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

test('opens the technology map and architecture overview from learning materials', async ({
  page,
}) => {
  await page.goto('/learning')

  await page.getByRole('button', { name: /Exercise technology map/ }).click()

  await expect(page).toHaveURL('/learning/exercise-technology-map')
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Exercise technology map',
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Back to learning docs' }).click()

  await page.getByRole('button', { name: /Architecture overview/ }).click()

  await expect(page).toHaveURL('/learning/architecture-overview')
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Architecture overview',
    }),
  ).toBeVisible()

  await expect(
    page.getByRole('link', { name: 'Interactive FigJam architecture diagram' }),
  ).toHaveAttribute('href', expect.stringContaining('figma.com/board/'))
})
