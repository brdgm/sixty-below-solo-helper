import { expect } from 'chai'
import getArkaStationSitesVP from '@/util/getArkaStationSitesVP'

describe('util/getArkaStationSitesVP', () => {
  it('getArkaStationSitesVP-single', () => {
    const expectedVP = [
      { value: 1, vp: 0 },
      { value: 2, vp: 0 },
      { value: 3, vp: 1 },
      { value: 4, vp: 2 },
      { value: 5, vp: 4 },
      { value: 6, vp: 5 },
      { value: 7, vp: 6 }
    ]
    for (const { value, vp } of expectedVP) {
      expect(getArkaStationSitesVP([value]), `value ${value}`).to.eq(vp)
    }
  })

  it('getArkaStationSitesVP-sum', () => {
    expect(getArkaStationSitesVP([])).to.eq(0)
    expect(getArkaStationSitesVP([2, 3, 3, 5, 7])).to.eq(12)
  })
})
