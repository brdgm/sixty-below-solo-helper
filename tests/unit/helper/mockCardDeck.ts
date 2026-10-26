import CardDeck from '@/services/CardDeck'

export default function mockCardDeck(params?: MockCardDeckParams) : CardDeck {
  return CardDeck.fromPersistence({
    pile: params?.pile ?? [],
    discard: params?.discard ?? [],
    played: params?.played ?? []
  })
}

export interface MockCardDeckParams {
  pile?: string[]
  discard?: string[]
  played?: string[]
}
