import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import Card from './Card'
import Action from './enum/Action'

/**
 * Arka's Action Cards (ids as printed on the cards).
 */
const cards : Card[] = [
  {
    id: 'saa1',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.BUILD_STATION }
    ]
  },
  {
    id: 'saa2',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.BUILD_STATION_IF_3_ENGINEERS, otherwise: Action.TAKE_EXPERT }
    ]
  },
  {
    id: 'saa3',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.PLACE_EXPLORER_EXPERT_ACTION_TILE }
    ]
  },
  {
    id: 'saa4',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.EXPLORE_LANDSCAPE }
    ]
  },
  {
    id: 'saa5',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.PLACE_EXPLORER_LANDSCAPE }
    ]
  },
  {
    id: 'saa6',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.PLACE_EXPLORER_LANDSCAPE }
    ]
  },
  {
    id: 'saa7',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.PLACE_EXPLORER_LANDSCAPE }
    ]
  },
  {
    id: 'saa8',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.PLACE_EXPLORER_LANDSCAPE }
    ]
  },
  {
    id: 'saa9',
    star: true,
    rondelSteps: 1,
    actions: [
      { action: Action.PLACE_EXPLORER_LANDSCAPE }
    ]
  },
  {
    id: 'sab10',
    star: false,
    rondelSteps: 1,
    actions: [
      { action: Action.MILESTONE_SPECIAL_ACTION_ALL }
    ]
  },
  {
    id: 'sab11',
    star: false,
    rondelSteps: 1,
    actions: [
      { action: Action.MILESTONE_SPECIAL_ACTION },
      { action: Action.TAKE_ENGINEER }
    ]
  },
  {
    id: 'sab12',
    star: false,
    rondelSteps: 1,
    actions: [
      { action: Action.MILESTONE_SPECIAL_ACTION },
      { action: Action.TAKE_INVESTOR }
    ]
  },
  {
    id: 'sab13',
    star: false,
    rondelSteps: 3,
    actions: [
      { action: Action.MILESTONE_SPECIAL_ACTION }
    ]
  },
  {
    id: 'sab14',
    star: false,
    rondelSteps: 1,
    actions: [
      { action: Action.MILESTONE_SPECIAL_ACTION },
      { action: Action.TAKE_RADIO_OPERATOR }
    ]
  }
]

const cardsMap = new Map<string,Card>()
for (const card of cards) {
  cardsMap.set(card.id, card)
}

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns Card
   */
  get(id: string) : Card {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @param star If set, return only cards with (true) or without (false) star
   * @returns Cards
   */
  getAll(star?: boolean) : readonly Card[] {
    if (star == undefined) {
      return cards
    }
    return cards.filter(card => card.star == star)
  }

}
