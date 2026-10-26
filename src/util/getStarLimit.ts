import getExpeditionPathPosition from './getExpeditionPathPosition'

/** Stars marked on the Expedition Path spaces (spaces 5-7 have no marking: 5 stars, D3) */
const STARS_PER_PATH_SPACE = [3, 3, 4, 5, 5, 5, 5]

/**
 * Get Arka's Expedition Level: the number of stars Arka plays per round.
 * @param expeditionSteps Steps on the Expedition Track (= victory points)
 * @returns Number of stars
 */
export default function getStarLimit(expeditionSteps : number) : number {
  return STARS_PER_PATH_SPACE[getExpeditionPathPosition(expeditionSteps)]
}
