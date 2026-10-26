import BotState from '@/services/BotState'
import ExpertColumn from '@/services/enum/ExpertColumn'
import MilestoneCondition from '@/services/enum/MilestoneCondition'

/**
 * Get Arka's tracked value for the overfulfill condition of her Milestone Card, as a hint for the player.
 * @param condition Overfulfill condition
 * @param botState Arka's state
 * @returns Value: Engineers/Radio Operators (incl. Mission Coordinators in the column), Upgrades,
 *   Experts (incl. the three printed ones), face-down Cards (D5: only the Project Cards among them count),
 *   Presence on Landscapes (C16)
 */
export default function getMilestoneConditionValue(condition : MilestoneCondition, botState : BotState) : number {
  switch (condition) {
    case MilestoneCondition.TWICE_AS_MANY_ENGINEERS:
      return botState.getIcons(ExpertColumn.ENGINEER)
    case MilestoneCondition.TWICE_AS_MANY_RADIO_OPERATORS:
      return botState.getIcons(ExpertColumn.RADIO_OPERATOR)
    case MilestoneCondition.TWO_UPGRADES_MORE:
      return botState.upgrades
    case MilestoneCondition.TWO_EXPERTS_MORE:
      return botState.expertCount
    case MilestoneCondition.THREE_PROJECT_CARDS_MORE:
      return botState.cardsDrawn
    case MilestoneCondition.ONE_PRESENCE_MORE_LANDSCAPES:
      return botState.presenceLandscapes
    default:
      throw new Error(`Invalid milestone condition: ${condition}`)
  }
}
