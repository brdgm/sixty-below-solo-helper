import { BotPersistence, Round, Turn } from '@/store/state'
import mockBotPersistence from './mockBotPersistence'

export default function mockRound(params?: MockRoundParams) : Round {
  return {
    round: params?.round ?? 1,
    initialBotPersistence: params?.initialBotPersistence ?? mockBotPersistence(),
    turns: params?.turns ?? [],
    milestoneOverfulfilled: params?.milestoneOverfulfilled
  }
}

export interface MockRoundParams {
  round?: number
  initialBotPersistence?: BotPersistence
  turns?: Turn[]
  milestoneOverfulfilled?: boolean
}
