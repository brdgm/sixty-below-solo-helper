import BotState from '@/services/BotState'
import CardDeck from '@/services/CardDeck'
import { BotPersistence } from '@/store/state'
import mockBotState from './mockBotState'
import mockCardDeck from './mockCardDeck'

export default function mockBotPersistence(params?: MockBotPersistenceParams) : BotPersistence {
  return {
    cardDeck: (params?.cardDeck ?? mockCardDeck()).toPersistence(),
    botState: (params?.botState ?? mockBotState()).toPersistence()
  }
}

export interface MockBotPersistenceParams {
  cardDeck?: CardDeck
  botState?: BotState
}
