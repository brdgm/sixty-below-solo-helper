import { test, expect, Page } from '@playwright/test'

/**
 * Play all screens of Arka's turns until another view is shown: confirm each action step
 * ("Executed", first Expert offered, first column offered) or continue with "Next".
 */
async function playArkaTurns(page: Page) : Promise<void> {
  while (await page.locator('h1').textContent() == 'Arka') {
    // each navigation re-creates the view, wait until the old heading is gone
    const heading = await page.locator('h1').elementHandle()
    const decision = page.locator('.decision')
    if (await decision.count() > 0) {
      await decision.getByRole('button').first().click()
    }
    else {
      await page.getByRole('button', { name: 'Next', exact: true }).click()
    }
    await heading?.waitForElementState('hidden')
  }
}

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
  await page.getByRole('button', { name: 'Next', exact: true }).click()

  // round 1: player starts, then Arka
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Arka')
  await expect(page.locator('.action-box').first()).toBeVisible()
  await playArkaTurns(page)

  // back from the player turn: Arka's last screen shows the state before its decision again
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.locator('h1')).toHaveText('Arka')
  const decidedTiles = page.locator('.action-box.status-executed, .action-box.status-not-possible')
  const decidedBefore = await decidedTiles.count()
  await playArkaTurns(page)
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.locator('h1')).toHaveText('Arka')
  await expect(decidedTiles).toHaveCount(decidedBefore)
  await playArkaTurns(page)

  // player passes
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('button', { name: 'Pass' }).click()
  await page.locator('#passModal').getByRole('button', { name: 'Pass' }).click()

  // Arka continues alone until she has played 3 stars and passes
  await expect(page.locator('h1')).toHaveText('Arka')
  await playArkaTurns(page)

  // round 1 end
  await expect(page.locator('h1')).toHaveText('End of Round 1')
  await page.getByRole('button', { name: 'Next', exact: true }).click()

  // round 2: Arka starts
  await expect(page.locator('h1')).toHaveText('Round 2')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Arka')

  // abort game
  await page.getByRole('button', { name: 'Abort Game' }).click()
  await page.locator('#endGameModal').getByRole('button', { name: 'Abort Game' }).click()

  // app home
  await expect(page.locator('h1')).toHaveText('-60° Solo Helper')
})
