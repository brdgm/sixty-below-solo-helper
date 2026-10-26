import { isEqual, shuffle } from 'lodash'
import MilestoneCards from '@/services/MilestoneCards'

/** Number of Arka's Milestone Cards used in a game */
export const ARKA_MILESTONE_CARD_COUNT = 3

/**
 * Draw Arka's Milestone Cards at random.
 * @param previous Previous selection - if given, the new selection is guaranteed to differ from it
 * @returns Ids of the Milestone Cards, in scoring order (left to right)
 */
export default function getRandomArkaMilestoneCards(previous? : readonly string[]) : string[] {
  let result : string[]
  do {
    result = shuffle(MilestoneCards.getAll())
        .slice(0, ARKA_MILESTONE_CARD_COUNT)
        .map(card => card.id)
  } while (previous && isEqual(result, previous))
  return result
}
