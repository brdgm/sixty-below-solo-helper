import { expect } from 'chai'
import getArkaExpeditionVP from '@/util/getArkaExpeditionVP'

describe('util/getArkaExpeditionVP', () => {
  it('getArkaExpeditionVP', () => {
    expect(getArkaExpeditionVP(0)).to.eq(5)
    expect(getArkaExpeditionVP(4)).to.eq(9)
    expect(getArkaExpeditionVP(12)).to.eq(17)
  })
})
