/** Number of rounds */
export const MAX_ROUND = 6
/** Rounds at the end of which a Milestone is scored */
export const MILESTONE_ROUNDS = [3, 5, 6]

/**
 * Get the index of the Milestone scored at the end of the round.
 * @param round Round
 * @returns Index of the Milestone (0 = first scoring, ..., 2 = third scoring), or undefined if no Milestone is scored
 */
export default function getMilestoneIndex(round : number) : number|undefined {
  const index = MILESTONE_ROUNDS.indexOf(round)
  return index >= 0 ? index : undefined
}
