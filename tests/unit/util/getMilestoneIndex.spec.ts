import { expect } from 'chai'
import getMilestoneIndex from '@/util/getMilestoneIndex'

describe('util/getMilestoneIndex', () => {
  it('getMilestoneIndex', () => {
    expect([1,2,3,4,5,6].map(getMilestoneIndex)).to.eql([undefined, undefined, 0, undefined, 1, 2])
  })
})
