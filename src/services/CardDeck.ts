import { shuffle } from 'lodash'
import { ref } from 'vue'
import Card from './Card'
import Cards from './Cards'
import { CardDeckPersistence } from '@/store/state'
import DifficultyLevel from './enum/DifficultyLevel'
import getDifficultyLevelSettings from '@/util/getDifficultyLevelSettings'

/**
 * Manages Arka's Action Card deck: face-down pile, cards played face-up this round, and the discard pile.
 */
export default class CardDeck {

  private readonly _pile
  private readonly _discard
  private readonly _played

  private constructor(pile : Card[], discard : Card[], played : Card[]) {
    this._pile = ref(pile)
    this._discard = ref(discard)
    this._played = ref(played)
  }

  public get pile() : readonly Card[] {
    return this._pile.value
  }

  public get discard() : readonly Card[] {
    return this._discard.value
  }

  /**
   * Action Cards played this round, in the order played.
   */
  public get played() : readonly Card[] {
    return this._played.value
  }

  /**
   * Action Card played last in this round.
   */
  public get currentCard() : Card|undefined {
    return this._played.value.at(-1)
  }

  /**
   * Number of stars on the Action Cards played this round.
   */
  public get starsPlayed() : number {
    return this._played.value.filter(card => card.star).length
  }

  /**
   * Draws the next card and places it face up to the played cards of this round.
   * If the pile is empty, the discard pile is shuffled to form a new pile first.
   * @returns Drawn card
   */
  public draw() : Card {
    if (this._pile.value.length == 0) {
      this._pile.value = shuffle(this._discard.value)
      this._discard.value = []
    }
    const card = this._pile.value.shift()
    if (!card) {
      throw new Error('Pile and discard pile are empty.')
    }
    this._played.value.push(card)
    return card
  }

  /**
   * End of round: put the played cards on the discard pile.
   */
  public endRound() : void {
    this._discard.value = [...this._discard.value, ...this._played.value]
    this._played.value = []
  }

  /**
   * Gets persistence view of card deck.
   */
  public toPersistence() : CardDeckPersistence {
    return {
      pile: this._pile.value.map(card => card.id),
      discard: this._discard.value.map(card => card.id),
      played: this._played.value.map(card => card.id)
    }
  }

  /**
   * Creates a new shuffled deck: all Action Cards with a star, plus random Action Cards without a star depending on the difficulty level.
   * @param difficultyLevel Difficulty level
   */
  public static new(difficultyLevel : DifficultyLevel) : CardDeck {
    const { actionCardsWithoutStar } = getDifficultyLevelSettings(difficultyLevel)
    const starCards = Cards.getAll(true)
    const noStarCards = shuffle(Cards.getAll(false)).slice(0, actionCardsWithoutStar)
    return new CardDeck(shuffle([...starCards, ...noStarCards]), [], [])
  }

  /**
   * Re-creates card deck from persistence.
   */
  public static fromPersistence(persistence : CardDeckPersistence) : CardDeck {
    return new CardDeck(
      persistence.pile.map(Cards.get),
      persistence.discard.map(Cards.get),
      persistence.played.map(Cards.get)
    )
  }

}
