import { expect } from 'chai'
import getStarLimit from '@/util/getStarLimit'

describe('util/getStarLimit', () => {
  it('getStarLimit', () => {
    expect(getStarLimit(0)).to.eq(3)
    expect(getStarLimit(4)).to.eq(3)
    expect(getStarLimit(5)).to.eq(3)
    expect(getStarLimit(9)).to.eq(3)
    expect(getStarLimit(10)).to.eq(4)
    expect(getStarLimit(15)).to.eq(5)
    expect(getStarLimit(30)).to.eq(5)
    expect(getStarLimit(100)).to.eq(5)
  })
})
