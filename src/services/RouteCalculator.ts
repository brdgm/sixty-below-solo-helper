import { State, Turn } from '@/store/state'
import Player from './enum/Player'
import getStartPlayer from '@/util/getStartPlayer'
import { MAX_ROUND } from '@/util/getMilestoneIndex'

/**
 * Calculates the routes for next/back within a round:
 * the player and Arka alternate, starting with the start player of the round,
 * until both have passed. Whoever has not passed yet continues alone.
 */
export default class RouteCalculator {

  readonly round : number
  readonly turn : number
  readonly player? : Player

  constructor(params:{round: number, turn?: number, player?: Player}) {
    this.round = params.round
    this.turn = params.turn ?? 0
    this.player = params.player
  }

  /**
   * Get route to the next turn, or to the round end if both have passed.
   * Expects the current turn to be stored already.
   */
  public getNextRouteTo(state: State) : string {
    if (!this.player) {
      throw new Error('Player of current turn is not set.')
    }
    const passedPlayers = getTurns(state, this.round)
        .filter(item => item.turn <= this.turn && item.pass)
        .map(item => item.player)
    const otherPlayer = this.player == Player.PLAYER ? Player.BOT : Player.PLAYER
    if (passedPlayers.includes(this.player) && passedPlayers.includes(otherPlayer)) {
      return `/round/${this.round}/end`
    }
    const nextPlayer = passedPlayers.includes(otherPlayer) ? this.player : otherPlayer
    return routeTo(this.round, this.turn + 1, nextPlayer)
  }

  /**
   * Get route to the previous turn, or to the round start if this is the first turn.
   */
  public getBackRouteTo(state: State) : string {
    const previousTurn = getTurns(state, this.round).find(item => item.turn == this.turn - 1)
    if (previousTurn) {
      return routeTo(this.round, previousTurn.turn, previousTurn.player)
    }
    return `/round/${this.round}/start`
  }

  /**
   * Get route to the first turn of the round.
   */
  public getFirstTurnRouteTo() : string {
    return routeTo(this.round, 1, getStartPlayer(this.round))
  }

  /**
   * Get route to the last stored turn of the round, or to the round start if no turn exists.
   */
  public getLastTurnRouteTo(state: State) : string {
    const lastTurn = getTurns(state, this.round).toSorted((item1, item2) => item1.turn - item2.turn).at(-1)
    if (lastTurn) {
      return routeTo(this.round, lastTurn.turn, lastTurn.player)
    }
    return `/round/${this.round}/start`
  }

  /**
   * Get route after the end of the round: start of the next round, or game end after the last round.
   */
  public getNextRoundRouteTo() : string {
    if (this.round >= MAX_ROUND) {
      return '/gameEnd'
    }
    return `/round/${this.round + 1}/start`
  }

}

function getTurns(state: State, round: number) : Turn[] {
  return state.rounds.find(item => item.round == round)?.turns ?? []
}

function routeTo(round: number, turn: number, player: Player) : string {
  return `/round/${round}/turn/${turn}/${player}`
}
