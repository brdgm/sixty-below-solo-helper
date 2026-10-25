import { expect } from 'chai'
import getRandomArkaMilestoneCards from '@/util/getRandomArkaMilestoneCards'
import MilestoneCards from '@/services/MilestoneCards'

describe('util/getRandomArkaMilestoneCards', () => {
  it('getRandomArkaMilestoneCards', () => {
    for (let i = 0; i < 20; i++) {
      const ids = getRandomArkaMilestoneCards()
      expect(ids).to.have.lengthOf(3)
      expect(new Set(ids).size).to.eq(3)
      ids.forEach(id => expect(MilestoneCards.get(id).id).to.eq(id))
    }
  })
})
