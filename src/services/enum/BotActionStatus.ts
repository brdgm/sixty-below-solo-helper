/**
 * Status of a step of Arka's turn.
 */
enum BotActionStatus {
  /** Carried out by the player without a decision */
  TODO = 'todo',
  /** Waiting for the player's decision */
  PENDING = 'pending',
  EXECUTED = 'executed',
  NOT_POSSIBLE = 'not-possible',
  /** After the pending step, not resolved yet */
  UPCOMING = 'upcoming'
}
export default BotActionStatus
