import Player from '@/services/enum/Player'
import { BotPersistence, Turn } from '@/store/state'

export default function mockTurn(params?: MockTurnParams) : Turn {
  return {
    round: params?.round ?? 1,
    turn: params?.turn ?? 1,
    player: params?.player ?? Player.PLAYER,
    pass: params?.pass,
    botPersistence: params?.botPersistence
  }
}

export interface MockTurnParams {
  round?: number
  turn?: number
  player?: Player
  pass?: boolean
  botPersistence?: BotPersistence
}
