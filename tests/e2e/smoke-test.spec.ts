import { test, expect } from '@playwright/test'

test('smoke test', async ({ page }) => {
  await page.goto('/')

  // app home
  await expect(page.locator('h1')).toHaveText('-60° Solo Helper')
  await page.getByRole('link', { name: 'Play Game' }).click()

  // setup game
  await expect(page.locator('h1')).toHaveText('Setup')
  await page.getByRole('button', { name: 'Setup Arka' }).click()

  // setup Arka
  await expect(page.locator('h1')).toHaveText('Setup Arka')
  await page.getByRole('button', { name: 'Start Game' }).click()

  // round 1 start
  await expect(page.locator('h1')).toHaveText('Round 1')
  await page.getByRole('button', { name: 'Next' }).click()

  // round 1: player starts, then Arka
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('button', { name: 'Next' }).click()
  await expect(page.locator('h1')).toHaveText('Arka')
  await page.getByRole('button', { name: 'Next' }).click()

  // player passes
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('button', { name: 'Pass' }).click()
  await page.locator('#passModal').getByRole('button', { name: 'Pass' }).click()

  // Arka continues alone until she has played 3 stars (difficulty level 1: only cards with a star) and passes
  for (let i = 0; i < 3; i++) {
    await expect(page.locator('h1')).toHaveText('Arka')
    await page.getByRole('button', { name: 'Next' }).click()
  }

  // round 1 end
  await expect(page.locator('h1')).toHaveText('End of Round 1')
  await page.getByRole('button', { name: 'Next' }).click()

  // round 2: Arka starts
  await expect(page.locator('h1')).toHaveText('Round 2')
  await page.getByRole('button', { name: 'Next' }).click()
  await expect(page.locator('h1')).toHaveText('Arka')

  // abort game
  await page.getByRole('button', { name: 'Abort Game' }).click()
  await page.locator('#endGameModal').getByRole('button', { name: 'Abort Game' }).click()

  // app home
  await expect(page.locator('h1')).toHaveText('-60° Solo Helper')
})
