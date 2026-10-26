import { BotPersistence, State } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import Player from '@/services/enum/Player'
import CardDeck from '@/services/CardDeck'
import BotState from '@/services/BotState'
import getStartPlayer from './getStartPlayer'

/** Turn number used to look up the state at the end of a round */
const MAX_TURN = 999

/**
 * Navigation state of the current view, derived from the route parameters and the persisted state.
 * Restores Arka's state from the persisted turns and, on Arka's turn, either draws the next Action Card or passes.
 */
export default class NavigationState {

  readonly round : number
  readonly turn : number
  /** Player of the current turn (only on turn routes) */
  readonly player? : Player
  readonly startPlayer : Player
  readonly cardDeck : CardDeck
  readonly botState : BotState
  /** Arka passes in this turn because she has already played as many stars as her Expedition Level */
  readonly botPass : boolean

  constructor(route: RouteLocation, state: State) {
    this.round = getIntRouteParam(route, 'round')
    this.turn = getIntRouteParam(route, 'turn')
    this.player = getPlayer(route)
    this.startPlayer = getStartPlayer(this.round)

    const lookupTurn = route.name == 'RoundEnd' ? MAX_TURN : this.turn
    const botPersistence = getBotPersistence(state, this.round, lookupTurn)
    this.cardDeck = CardDeck.fromPersistence(botPersistence.cardDeck)
    this.botState = BotState.fromPersistence(botPersistence.botState)

    this.botPass = false
    if (this.player == Player.BOT) {
      if (this.cardDeck.starsPlayed >= this.botState.starLimit) {
        this.botPass = true
      }
      else {
        this.cardDeck.draw()
      }
    }
  }

}

function getPlayer(route: RouteLocation) : Player|undefined {
  switch (route.name) {
    case 'RoundTurnPlayer':
      return Player.PLAYER
    case 'RoundTurnBot':
      return Player.BOT
    default:
      return undefined
  }
}

/**
 * Get Arka's state from her last turn before the given turn, or from the start of the round.
 */
function getBotPersistence(state: State, round: number, turn: number) : BotPersistence {
  const roundData = state.rounds.find(item => item.round == round)

  const lastBotTurn = roundData?.turns
      .filter(item => item.turn < turn)
      .toSorted((item1, item2) => item1.turn - item2.turn)
      .findLast(item => item.botPersistence != undefined)
  if (lastBotTurn?.botPersistence) {
    return lastBotTurn.botPersistence
  }

  if (roundData) {
    return roundData.initialBotPersistence
  }

  // no round data (should not happen within the game flow): fresh state
  return {
    cardDeck: CardDeck.new(state.setup.difficultyLevel).toPersistence(),
    botState: BotState.new().toPersistence()
  }
}
