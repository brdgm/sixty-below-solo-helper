import { BotActionDecision, BotPersistence, BotStatePersistence, State, Turn } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import Player from '@/services/enum/Player'
import CardDeck from '@/services/CardDeck'
import BotState from '@/services/BotState'
import BotActions, { BotActionScreen } from '@/services/BotActions'
import MilestoneCard from '@/services/MilestoneCard'
import MilestoneCards from '@/services/MilestoneCards'
import getStartPlayer from './getStartPlayer'
import getNextMilestoneIndex from './getNextMilestoneIndex'

/** Turn number used to look up the state at the end of a round */
const MAX_TURN = 999

/**
 * Navigation state of the current view, derived from the route parameters and the persisted state.
 * Restores Arka's state from the persisted turns. On Arka's turn, she either passes or reveals the next Action Card,
 * which is resolved into action steps with the player decisions made so far.
 */
export default class NavigationState {

  readonly round : number
  readonly turn : number
  /** Screen index within Arka's turn (one action per screen) */
  readonly action : number
  /** Player of the current turn (only on turn routes) */
  readonly player? : Player
  readonly startPlayer : Player
  readonly cardDeck : CardDeck
  /** Arka's state - on Arka's turn as of the current screen */
  readonly botState : BotState
  /** Arka passes in this turn because she has already played as many stars as her Expedition Level */
  readonly botPass : boolean
  /** Arka's Milestone Cards that are not scored yet, in scoring order */
  readonly milestoneCards : readonly MilestoneCard[]
  /** Player decisions made on the screens before the current screen */
  readonly botActionDecisions : readonly BotActionDecision[]
  /** Arka's resolved actions with the decisions before the current screen (only on Arka's turn when she does not pass) */
  readonly botActions? : BotActions
  /** Current screen of Arka's turn */
  readonly botActionScreen? : BotActionScreen

  private readonly botStateBeforeTurn : BotStatePersistence

  constructor(route: RouteLocation, state: State) {
    this.round = getIntRouteParam(route, 'round')
    this.turn = getIntRouteParam(route, 'turn')
    this.action = getIntRouteParam(route, 'action')
    this.player = getPlayer(route)
    this.startPlayer = getStartPlayer(this.round)
    this.milestoneCards = (state.setup.arkaMilestoneCards ?? [])
        .slice(getNextMilestoneIndex(this.round))
        .map(id => MilestoneCards.get(id))

    const lookupTurn = route.name == 'RoundEnd' ? MAX_TURN : this.turn
    const botPersistence = getBotPersistence(state, this.round, lookupTurn)
    this.botStateBeforeTurn = botPersistence.botState
    let cardDeck = CardDeck.fromPersistence(botPersistence.cardDeck)
    let botPass = false
    let storedDecisions : BotActionDecision[] = []

    if (this.player == Player.BOT) {
      const storedTurn = getStoredTurn(state, this.round, this.turn)
      if (storedTurn?.player == Player.BOT && storedTurn.botPersistence) {
        // reuse the card revealed when the turn was stored first (drawing again after a reshuffle would be random)
        cardDeck = CardDeck.fromPersistence(storedTurn.botPersistence.cardDeck)
        botPass = storedTurn.pass ?? false
        storedDecisions = storedTurn.botActionDecisions ?? []
      }
      else if (cardDeck.starsPlayed >= BotState.fromPersistence(this.botStateBeforeTurn).starLimit) {
        botPass = true
      }
      else {
        cardDeck.draw()
      }
    }
    this.cardDeck = cardDeck
    this.botPass = botPass

    if (this.player == Player.BOT && !this.botPass) {
      // only the decisions of the screens before the current one - the current screen's decision can be taken (again)
      const decisionCount = this.getBotActions(storedDecisions).getDecisionCountBefore(this.action)
      this.botActionDecisions = storedDecisions.slice(0, decisionCount)
      this.botActions = this.getBotActions(this.botActionDecisions)
      const screens = this.botActions.screens
      this.botActionScreen = screens[Math.min(this.action, screens.length - 1)]
      this.botState = BotState.fromPersistence(this.botActionScreen.botState)
    }
    else {
      this.botActionDecisions = []
      this.botState = BotState.fromPersistence(this.botStateBeforeTurn)
    }
  }

  /**
   * Resolve Arka's current Action Card with the given player decisions, starting from her state before this turn.
   * @param decisions Player decisions
   */
  public getBotActions(decisions : readonly BotActionDecision[]) : BotActions {
    const card = this.cardDeck.currentCard
    if (!card) {
      throw new Error('No current Action Card.')
    }
    return new BotActions(card, BotState.fromPersistence(this.botStateBeforeTurn), this.milestoneCards, decisions)
  }

}

function getPlayer(route: RouteLocation) : Player|undefined {
  switch (route.name) {
    case 'RoundTurnPlayer':
      return Player.PLAYER
    case 'RoundTurnBot':
    case 'RoundTurnBotAction':
      return Player.BOT
    default:
      return undefined
  }
}

function getStoredTurn(state: State, round: number, turn: number) : Turn|undefined {
  return state.rounds.find(item => item.round == round)?.turns.find(item => item.turn == turn)
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
