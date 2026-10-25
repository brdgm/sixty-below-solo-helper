import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import Player from '@/services/enum/Player'

export const useStateStore = defineStore(`${name}.state`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1,
      setup: {},
      rounds: []
    } as State
  },
  actions: {
    resetGame() : void {
      this.rounds = []
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
  debugMode?: boolean
}

export interface Round {
  round: number
  turns: Turn[]
}
export interface Turn {
  round: number
  turn: number
  player: Player
  pass?: boolean
}
