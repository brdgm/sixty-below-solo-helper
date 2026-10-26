import BotState from '@/services/BotState'
import ExpertColumn from '@/services/enum/ExpertColumn'
import ExpertType from '@/services/enum/ExpertType'

export default function mockBotState(params?: MockBotStateParams) : BotState {
  return BotState.fromPersistence({
    rondelPosition: params?.rondelPosition ?? 0,
    expeditionSteps: params?.expeditionSteps ?? 0,
    experts: {
      [ExpertColumn.INVESTOR]: params?.investor ?? [],
      [ExpertColumn.RADIO_OPERATOR]: params?.radioOperator ?? [],
      [ExpertColumn.ENGINEER]: params?.engineer ?? []
    },
    upgrades: params?.upgrades ?? 0,
    cardsDrawn: params?.cardsDrawn ?? 0,
    explorersLandscape: params?.explorersLandscape ?? 0,
    explorersExpertActionTile: params?.explorersExpertActionTile ?? 0,
    stationsBuilt: params?.stationsBuilt ?? 0
  })
}

export interface MockBotStateParams {
  rondelPosition?: number
  expeditionSteps?: number
  /** Experts in the investor column (without the printed one) */
  investor?: ExpertType[]
  /** Experts in the radio operator column (without the printed one) */
  radioOperator?: ExpertType[]
  /** Experts in the engineer column (without the printed one) */
  engineer?: ExpertType[]
  upgrades?: number
  cardsDrawn?: number
  explorersLandscape?: number
  explorersExpertActionTile?: number
  stationsBuilt?: number
}
