import Action from './enum/Action'

/**
 * Arka's Action Card.
 */
export default interface Card {
  /** Printed identifier: saa1-saa9 (with star), sab10-sab14 (without star) */
  id: string
  /** Card shows one star (counts towards Arka's Expedition Level) */
  star: boolean
  /** Steps to move the Rondel Explorer, carried out before the card actions */
  rondelSteps: number
  /** Card actions, carried out from top to bottom */
  actions: CardAction[]
}

export interface CardAction {
  action: Action
  /** Action carried out instead if the condition of the action is not met (saa2: take an Expert if Arka has less than 3 Engineer icons) */
  otherwise?: Action
}
