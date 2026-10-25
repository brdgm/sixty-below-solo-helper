import { expect } from 'chai'
import MilestoneCards from '@/services/MilestoneCards'
import Action from '@/services/enum/Action'
import MilestoneCondition from '@/services/enum/MilestoneCondition'

describe('services/MilestoneCards', () => {
  it('get', () => {
    const milestoneCard = MilestoneCards.get('sm4')

    expect(milestoneCard.id).to.eq('sm4')
    expect(milestoneCard.overfulfill).to.eq(MilestoneCondition.THREE_PROJECT_CARDS_MORE)
    expect(milestoneCard.specialAction).to.eq(Action.TAKE_INVESTOR)
  })

  it('get-invalid', () => {
    expect(() => MilestoneCards.get('sm7')).to.throw()
  })

  it('getAll', () => {
    expect(MilestoneCards.getAll().map(card => card.id)).to.eql(['sm1','sm2','sm3','sm4','sm5','sm6'])
  })
})
