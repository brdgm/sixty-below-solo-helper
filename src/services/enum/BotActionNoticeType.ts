/**
 * Automated effect of Arka's turn that is worth noticing for the player.
 */
enum BotActionNoticeType {
  /** Arka takes an Upgrade (Rondel or Milestone special action) */
  UPGRADE = 'upgrade',
  /** Arka advances on the Expedition Path, her star limit increases */
  EXPEDITION_LEVEL = 'expedition-level',
  /** Action not possible, as known by the app */
  NOT_POSSIBLE = 'not-possible'
}
export default BotActionNoticeType
