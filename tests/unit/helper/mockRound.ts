import { Round, Turn } from '@/store/state'

export default function mockRound(params?: MockRoundParams) : Round {
  return {
    round: params?.round ?? 1,
    turns: params?.turns ?? []
  }
}

export interface MockRoundParams {
  round?: number
  turns?: Turn[]
}
