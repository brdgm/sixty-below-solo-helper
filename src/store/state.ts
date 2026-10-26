import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import Player from '@/services/enum/Player'
import ExpertColumn from '@/services/enum/ExpertColumn'
import ExpertType from '@/services/enum/ExpertType'
import DifficultyLevel from '@/services/enum/DifficultyLevel'

export const useStateStore = defineStore(`${name}.state`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1,
      setup: {
        difficultyLevel: DifficultyLevel.LEVEL_1
      },
      rounds: []
    } as State
  },
  actions: {
    resetGame() : void {
      this.rounds = []
      this.setup.arkaMilestoneCards = undefined
    },
    storeRound(round : Round) : void {
      this.rounds = this.rounds.filter(item => item.round < round.round)
      this.rounds.push(round)
    },
    storeRoundTurn(turn : Turn) : void {
      const round = this.rounds.find(item => item.round == turn.round)
      if (!round) {
        throw new Error(`Round ${turn.round} not found.`)
      }
      round.turns = round.turns.filter(item => item.turn < turn.turn)
      round.turns.push(turn)
    }
  },
  persist: true
})

export interface State {
  language: string
  baseFontSize: number
  setup: Setup
  rounds: Round[]
}
export interface Setup {
  difficultyLevel: DifficultyLevel
  /** Ids of Arka's 3 Milestone Cards, in scoring order (left to right) */
  arkaMilestoneCards?: string[]
  debugMode?: boolean
}

export interface Round {
  round: number
  /** Arka's state at the start of the round */
  initialBotPersistence: BotPersistence
  turns: Turn[]
}
export interface Turn {
  round: number
  turn: number
  player: Player
  pass?: boolean
  /** Arka's state after her turn (only stored for Arka's turns) */
  botPersistence?: BotPersistence
  /** Player decisions for Arka's action steps, in order (only stored for Arka's turns) */
  botActionDecisions?: BotActionDecision[]
  /** Action step (route param) of the screen on which Arka's turn was completed - target of "Back" from the following turn */
  botActionLastStep?: number
}
export interface BotActionDecision {
  /** false if the action was not possible */
  executed: boolean
  /** Expert taken by Arka */
  expertType?: ExpertType
  /** Column chosen for a Pilot or Mechanic on a tie */
  expertColumn?: ExpertColumn
}

export interface BotPersistence {
  cardDeck: CardDeckPersistence
  botState: BotStatePersistence
}
export interface CardDeckPersistence {
  pile: string[]
  discard: string[]
  /** Action Cards played this round, in the order played */
  played: string[]
}
export interface BotStatePersistence {
  /** Position of the Rondel Explorer: 0..7, 0 = starting space directly before the Expedition action */
  rondelPosition: number
  /** Steps on the Expedition Track (= victory points), the Expedition Path position is derived */
  expeditionSteps: number
  /** Experts taken by Arka per column in the order taken (without the printed Expert) */
  experts: Record<ExpertColumn, ExpertType[]>
  upgrades: number
  /** Face-down cards drawn from the common deck (left of the Tableau) */
  cardsDrawn: number
  explorersLandscape: number
  explorersExpertActionTile: number
  stationsBuilt: number
}
