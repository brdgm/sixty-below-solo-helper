import { shuffle } from 'lodash'
import MilestoneCards from '@/services/MilestoneCards'

/** Number of Arka's Milestone Cards used in a game */
export const ARKA_MILESTONE_CARD_COUNT = 3

/**
 * Draw Arka's Milestone Cards at random.
 * @returns Ids of the Milestone Cards, in scoring order (left to right)
 */
export default function getRandomArkaMilestoneCards() : string[] {
  return shuffle(MilestoneCards.getAll())
      .slice(0, ARKA_MILESTONE_CARD_COUNT)
      .map(card => card.id)
}
