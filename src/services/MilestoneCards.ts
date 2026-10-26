import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import MilestoneCard from './MilestoneCard'
import Action from './enum/Action'
import MilestoneCondition from './enum/MilestoneCondition'

/**
 * Arka's Milestone Cards (ids as printed on the cards).
 */
const milestoneCards : MilestoneCard[] = [
  {
    id: 'sm1',
    overfulfill: MilestoneCondition.TWICE_AS_MANY_ENGINEERS,
    specialAction: Action.TAKE_ENGINEER
  },
  {
    id: 'sm2',
    overfulfill: MilestoneCondition.TWO_UPGRADES_MORE,
    specialAction: Action.TAKE_UPGRADE
  },
  {
    id: 'sm3',
    overfulfill: MilestoneCondition.TWO_EXPERTS_MORE,
    specialAction: Action.TAKE_EXPERT
  },
  {
    id: 'sm4',
    overfulfill: MilestoneCondition.THREE_PROJECT_CARDS_MORE,
    specialAction: Action.TAKE_INVESTOR
  },
  {
    id: 'sm5',
    overfulfill: MilestoneCondition.TWICE_AS_MANY_RADIO_OPERATORS,
    specialAction: Action.TAKE_RADIO_OPERATOR
  },
  {
    id: 'sm6',
    overfulfill: MilestoneCondition.ONE_PRESENCE_MORE_LANDSCAPES,
    specialAction: Action.PLACE_EXPLORER_LANDSCAPE
  }
]

const milestoneCardsMap = new Map<string,MilestoneCard>()
for (const milestoneCard of milestoneCards) {
  milestoneCardsMap.set(milestoneCard.id, milestoneCard)
}

export default {

  /**
   * Get milestone card by ID
   * @param id ID
   * @returns Milestone card
   */
  get(id: string) : MilestoneCard {
    return findMandatory(milestoneCardsMap, id)
  },

  /**
   * Get all milestone cards
   * @returns Milestone cards
   */
  getAll() : readonly MilestoneCard[] {
    return milestoneCards
  }

}
