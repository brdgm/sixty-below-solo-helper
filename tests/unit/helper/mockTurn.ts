import Player from '@/services/enum/Player'
import { BotActionDecision, BotPersistence, Turn } from '@/store/state'

export default function mockTurn(params?: MockTurnParams) : Turn {
  return {
    round: params?.round ?? 1,
    turn: params?.turn ?? 1,
    player: params?.player ?? Player.PLAYER,
    pass: params?.pass,
    botPersistence: params?.botPersistence,
    botActionDecisions: params?.botActionDecisions,
    botActionLastStep: params?.botActionLastStep
  }
}

export interface MockTurnParams {
  round?: number
  turn?: number
  player?: Player
  pass?: boolean
  botPersistence?: BotPersistence
  botActionDecisions?: BotActionDecision[]
  botActionLastStep?: number
}
