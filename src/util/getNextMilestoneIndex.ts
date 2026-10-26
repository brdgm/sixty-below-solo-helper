import { MILESTONE_ROUNDS } from './getMilestoneIndex'

/**
 * Get the index of the next Milestone that is not scored yet at the given round.
 * @param round Round
 * @returns Index of the Milestone (0 = first scoring at the end of round 3, ...), 3 if all are scored
 */
export default function getNextMilestoneIndex(round : number) : number {
  const index = MILESTONE_ROUNDS.findIndex(milestoneRound => milestoneRound >= round)
  return index >= 0 ? index : MILESTONE_ROUNDS.length
}
