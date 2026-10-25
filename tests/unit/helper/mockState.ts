import DifficultyLevel from '@/services/enum/DifficultyLevel'
import { Round, State } from '@/store/state'

export default function mockState(params?: MockStateParams) : State {
  return {
    language: 'en',
    baseFontSize: 1,
    setup: {
      difficultyLevel: params?.difficultyLevel ?? DifficultyLevel.LEVEL_1,
      arkaMilestoneCards: params?.arkaMilestoneCards ?? ['sm1','sm2','sm3'],
      debugMode: params?.debugMode
    },
    rounds: params?.rounds ?? []
  }
}

export interface MockStateParams {
  difficultyLevel?: DifficultyLevel
  arkaMilestoneCards?: string[]
  debugMode?: boolean
  rounds?: Round[]
}
