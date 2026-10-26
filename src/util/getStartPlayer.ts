import Player from '@/services/enum/Player'

/**
 * Get the start player of a round: the player starts round 1, then the Starting Indicator alternates (D6).
 * @param round Round
 * @returns Start player
 */
export default function getStartPlayer(round : number) : Player {
  return round % 2 == 1 ? Player.PLAYER : Player.BOT
}
