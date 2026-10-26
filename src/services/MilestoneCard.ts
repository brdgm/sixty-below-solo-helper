import Action from './enum/Action'
import MilestoneCondition from './enum/MilestoneCondition'

/**
 * Arka's Milestone Card.
 */
export default interface MilestoneCard {
  /** Printed identifier: sm1-sm6 */
  id: string
  /** Condition Arka must meet compared to the player to score the higher victory point value */
  overfulfill: MilestoneCondition
  /** Special action, carried out for the Action Card actions "milestone special action (all)" */
  specialAction: Action
}
