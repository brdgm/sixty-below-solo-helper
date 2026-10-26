import { expect } from 'chai'
import getNextMilestoneIndex from '@/util/getNextMilestoneIndex'

describe('util/getNextMilestoneIndex', () => {
  it('getNextMilestoneIndex', () => {
    const expected = [[1, 0], [2, 0], [3, 0], [4, 1], [5, 1], [6, 2], [7, 3]]
    for (const [round, index] of expected) {
      expect(getNextMilestoneIndex(round), `round ${round}`).to.eq(index)
    }
  })
})
