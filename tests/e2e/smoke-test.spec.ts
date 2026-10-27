import { test, expect, Page } from '@playwright/test'

/**
 * Play all screens of Arka's turns until another view is shown: confirm each action step
 * ("Executed", first Expert offered, first column offered) or continue with "Next".
 * @returns URL of the last screen of Arka's turn
 */
async function playArkaTurns(page: Page) : Promise<string> {
  let lastUrl = page.url()
  while (await page.locator('h1').textContent() == 'Arka') {
    lastUrl = page.url()
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
  return lastUrl
}

/**
 * Play the game until the view with the given heading is shown: the player passes immediately,
 * Arka plays her turns, round start/end continue with "Next", Arka's Milestones are overfulfilled ("Yes").
 */
async function playUntil(page: Page, targetHeading: string) : Promise<void> {
  let heading = await page.locator('h1').textContent()
  while (heading != targetHeading) {
    if (heading == 'Arka') {
      await playArkaTurns(page)
    }
    else {
      const headingElement = await page.locator('h1').elementHandle()
      const milestoneYes = page.getByRole('button', { name: /^Yes: / })
      if (heading == 'Your Turn') {
        await page.getByRole('button', { name: 'Pass' }).click()
        await page.locator('#passModal').getByRole('button', { name: 'Pass' }).click()
      }
      else if (await milestoneYes.count() > 0) {
        await milestoneYes.click()
      }
      else {
        await page.getByRole('button', { name: 'Next', exact: true }).click()
      }
      await headingElement?.waitForElementState('hidden')
    }
    heading = await page.locator('h1').textContent()
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
  await expect(page.locator('.action-box, .alert').first()).toBeVisible()
  const lastArkaUrl = await playArkaTurns(page)

  // back from the player turn: Arka's last screen again, before its decision (buttons available)
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.locator('h1')).toHaveText('Arka')
  await expect(page).toHaveURL(lastArkaUrl)
  await expect(page.locator('.decision button, button:text-is("Next")').first()).toBeVisible()
  await playArkaTurns(page)

  // player passes
  await expect(page.locator('h1')).toHaveText('Your Turn')
  await page.getByRole('button', { name: 'Pass' }).click()
  await page.locator('#passModal').getByRole('button', { name: 'Pass' }).click()

  // Arka continues alone until she has played 3 stars and passes
  await expect(page.locator('h1')).toHaveText('Arka')
  await playArkaTurns(page)

  // round 1 end - back: Arka passes after her last turn, no extra turn for passing
  await expect(page.locator('h1')).toHaveText('End of Round 1')
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.locator('h1')).toHaveText('Arka')
  await expect(page.getByText('so she passes after this turn')).toBeVisible()
  await playArkaTurns(page)

  // round 1 end
  await expect(page.locator('h1')).toHaveText('End of Round 1')
  await page.getByRole('button', { name: 'Next', exact: true }).click()

  // round 2: Arka starts
  await expect(page.locator('h1')).toHaveText('Round 2')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Arka')

  // play until the end of round 3: Arka's first Milestone; back from the next round shows the question again
  await playUntil(page, 'End of Round 3')
  await expect(page.getByRole('heading', { name: "Arka's Milestone" })).toBeVisible()
  await page.getByRole('button', { name: 'Yes: 6 VP' }).click()
  await expect(page.locator('h1')).toHaveText('Round 4')
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.locator('h1')).toHaveText('End of Round 3')
  await page.getByRole('button', { name: 'No: 4 VP' }).click()
  await expect(page.locator('h1')).toHaveText('Round 4')

  // play rounds 4-6 (Milestones at the end of rounds 5 and 6 overfulfilled)
  await playUntil(page, 'End of the Game')

  // game end: Arka's Milestones (4 + 8 + 12 VP) are scored
  await expect(page.getByRole('heading', { name: 'Final Scoring' })).toBeVisible()
  await expect(page.locator('tr', { hasText: 'Milestones' }).locator('td').last()).toHaveText('24')
  await expect(page.locator('.tie')).toHaveCount(0)

  // end game
  await page.getByRole('button', { name: 'End Game' }).click()
  await page.locator('#endGameModal').getByRole('button', { name: 'End Game' }).click()

  // app home
  await expect(page.locator('h1')).toHaveText('-60° Solo Helper')
})
