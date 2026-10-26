import { expect } from 'chai'
import getArkaUpgradeVP from '@/util/getArkaUpgradeVP'

describe('util/getArkaUpgradeVP', () => {
  it('getArkaUpgradeVP', () => {
    expect(getArkaUpgradeVP(0)).to.eq(0)
    expect(getArkaUpgradeVP(3)).to.eq(12)
  })
})
