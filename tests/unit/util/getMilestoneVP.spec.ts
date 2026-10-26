import { expect } from 'chai'
import getMilestoneVP from '@/util/getMilestoneVP'

describe('util/getMilestoneVP', () => {
  it('getMilestoneVP', () => {
    const expected = [[0, 4, 6], [1, 5, 8], [2, 6, 12]]
    for (const [milestoneIndex, lower, higher] of expected) {
      expect(getMilestoneVP(milestoneIndex, false), `tile ${milestoneIndex} lower`).to.eq(lower)
      expect(getMilestoneVP(milestoneIndex, true), `tile ${milestoneIndex} higher`).to.eq(higher)
    }
  })

  it('invalid', () => {
    expect(() => getMilestoneVP(3, true)).to.throw('Invalid milestone index: 3')
  })
})
