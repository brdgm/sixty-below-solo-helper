import { expect } from 'chai'
import CardDeck from '@/services/CardDeck'
import DifficultyLevel from '@/services/enum/DifficultyLevel'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import mockCardDeck from '../helper/mockCardDeck'

describe('services/CardDeck', () => {
  it('new', () => {
    for (const difficultyLevel of getAllEnumValues(DifficultyLevel)) {
      const deck = CardDeck.new(difficultyLevel)
      const pile = deck.toPersistence().pile

      expect(pile.length, `level ${difficultyLevel}`).to.eq(9 + difficultyLevel - 1)
      expect(pile.filter(id => id.startsWith('saa')).length, `level ${difficultyLevel} star`).to.eq(9)
      expect(new Set(pile).size, `level ${difficultyLevel} unique`).to.eq(pile.length)
      expect(deck.discard.length).to.eq(0)
      expect(deck.played.length).to.eq(0)
      expect(deck.currentCard).to.undefined
    }
  })

  it('draw', () => {
    const deck = mockCardDeck({pile:['saa1','sab10','saa2'], discard:['saa3']})

    expect(deck.draw().id).to.eq('saa1')
    expect(deck.draw().id).to.eq('sab10')

    expect(deck.currentCard?.id).to.eq('sab10')
    expect(deck.played.map(card => card.id)).to.eql(['saa1','sab10'])
    expect(deck.starsPlayed).to.eq(1)
    expect(deck.toPersistence()).to.eql({pile:['saa2'], discard:['saa3'], played:['saa1','sab10']})
  })

  it('endRound', () => {
    const deck = mockCardDeck({pile:['saa2'], discard:['saa3'], played:['saa1','sab10']})

    deck.endRound()

    expect(deck.currentCard).to.undefined
    expect(deck.starsPlayed).to.eq(0)
    expect(deck.toPersistence()).to.eql({pile:['saa2'], discard:['saa3','saa1','sab10'], played:[]})
  })

  it('draw-reshuffle', () => {
    const deck = mockCardDeck({pile:[], discard:['saa3','saa4'], played:['saa1']})

    const card = deck.draw()

    expect(['saa3','saa4']).to.include(card.id)
    expect(deck.pile.length).to.eq(1)
    expect(deck.discard.length).to.eq(0)
    expect(deck.played.map(item => item.id)).to.eql(['saa1', card.id])
  })

  it('draw-empty', () => {
    const deck = mockCardDeck({pile:[], discard:[], played:['saa1']})

    expect(() => deck.draw()).to.throw()
  })

  it('persistence', () => {
    const persistence = {pile:['saa5','sab13'], discard:['saa9'], played:['sab11','saa1']}

    expect(CardDeck.fromPersistence(persistence).toPersistence()).to.eql(persistence)
  })
})
