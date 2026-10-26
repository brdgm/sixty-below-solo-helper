import Player from '@/services/enum/Player'

/**
 * Get the winner of the game: Arka wins on equal victory points (C15).
 * @param playerVP Player's total victory points
 * @param botVP Arka's total victory points
 * @returns Winner
 */
export default function getWinner(playerVP : number, botVP : number) : Player {
  return playerVP > botVP ? Player.PLAYER : Player.BOT
}
