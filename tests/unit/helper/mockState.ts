import { Round, State } from '@/store/state'

export default function mockState(params?: MockStateParams) : State {
  return {
    language: 'en',
    baseFontSize: 1,
    setup: {
      debugMode: params?.debugMode
    },
    rounds: params?.rounds ?? []
  }
}

export interface MockStateParams {
  debugMode?: boolean
  rounds?: Round[]
}
