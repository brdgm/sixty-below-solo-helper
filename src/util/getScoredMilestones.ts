import { State } from '@/store/state'
import MilestoneCard from '@/services/MilestoneCard'
import MilestoneCards from '@/services/MilestoneCards'
import { MILESTONE_ROUNDS } from './getMilestoneIndex'
import getMilestoneVP from './getMilestoneVP'

/**
 * Get Arka's Milestones scored before the given round, in scoring order.
 * @param state State
 * @param beforeRound Only Milestones scored at the end of rounds before this round are returned
 * @returns Scored Milestones
 */
export default function getScoredMilestones(state : State, beforeRound : number) : ScoredMilestone[] {
  const milestoneCardIds = state.setup.arkaMilestoneCards ?? []
  const result : ScoredMilestone[] = []
  MILESTONE_ROUNDS.forEach((round, milestoneIndex) => {
    const overfulfilled = state.rounds.find(item => item.round == round)?.milestoneOverfulfilled
    const milestoneCardId = milestoneCardIds[milestoneIndex]
    if (round < beforeRound && overfulfilled != undefined && milestoneCardId) {
      result.push({
        milestoneIndex,
        milestoneCard: MilestoneCards.get(milestoneCardId),
        overfulfilled,
        victoryPoints: getMilestoneVP(milestoneIndex, overfulfilled)
      })
    }
  })
  return result
}

export interface ScoredMilestone {
  /** 0 = Milestone Tile I., ... */
  milestoneIndex: number
  milestoneCard: MilestoneCard
  overfulfilled: boolean
  victoryPoints: number
}
