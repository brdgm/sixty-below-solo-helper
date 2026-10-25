import { expect } from 'chai'
import Cards from '@/services/Cards'
import Action from '@/services/enum/Action'

describe('services/Cards', () => {
  it('get', () => {
    const card = Cards.get('saa2')

    expect(card.id).to.eq('saa2')
    expect(card.star).to.true
    expect(card.rondelSteps).to.eq(1)
    expect(card.actions).to.eql([{ action: Action.BUILD_STATION_IF_3_ENGINEERS, otherwise: Action.TAKE_EXPERT }])
  })

  it('get-invalid', () => {
    expect(() => Cards.get('saa99')).to.throw()
  })

  it('getAll', () => {
    expect(Cards.getAll().length).to.eq(14)
    expect(Cards.getAll(true).map(card => card.id)).to.eql(['saa1','saa2','saa3','saa4','saa5','saa6','saa7','saa8','saa9'])
    expect(Cards.getAll(false).map(card => card.id)).to.eql(['sab10','sab11','sab12','sab13','sab14'])
  })

  it('rondelSteps', () => {
    expect(Cards.getAll().filter(card => card.rondelSteps != 1).map(card => card.id)).to.eql(['sab13'])
    expect(Cards.get('sab13').rondelSteps).to.eq(3)
  })

  it('actionCounts', () => {
    const actions = Cards.getAll().flatMap(card => card.actions.map(cardAction => cardAction.action))
    const count = (action: Action) => actions.filter(item => item == action).length
    expect(count(Action.BUILD_STATION)).to.eq(1)
    expect(count(Action.BUILD_STATION_IF_3_ENGINEERS)).to.eq(1)
    expect(count(Action.PLACE_EXPLORER_EXPERT_ACTION_TILE)).to.eq(1)
    expect(count(Action.EXPLORE_LANDSCAPE)).to.eq(1)
    expect(count(Action.PLACE_EXPLORER_LANDSCAPE)).to.eq(5)
    expect(count(Action.MILESTONE_SPECIAL_ACTION)).to.eq(4)
    expect(count(Action.MILESTONE_SPECIAL_ACTION_ALL)).to.eq(1)
    expect(count(Action.TAKE_ENGINEER)).to.eq(1)
    expect(count(Action.TAKE_INVESTOR)).to.eq(1)
    expect(count(Action.TAKE_RADIO_OPERATOR)).to.eq(1)
  })
})
