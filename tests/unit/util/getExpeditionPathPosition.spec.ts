import { expect } from 'chai'
import getExpeditionPathPosition from '@/util/getExpeditionPathPosition'

describe('util/getExpeditionPathPosition', () => {
  it('getExpeditionPathPosition', () => {
    expect(getExpeditionPathPosition(0)).to.eq(0)
    expect(getExpeditionPathPosition(4)).to.eq(0)
    expect(getExpeditionPathPosition(5)).to.eq(1)
    expect(getExpeditionPathPosition(14)).to.eq(2)
    expect(getExpeditionPathPosition(30)).to.eq(6)
    expect(getExpeditionPathPosition(34)).to.eq(6)
  })

  it('max', () => {
    expect(getExpeditionPathPosition(35)).to.eq(6)
    expect(getExpeditionPathPosition(100)).to.eq(6)
  })
})
