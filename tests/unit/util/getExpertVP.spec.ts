import { expect } from 'chai'
import getExpertVP from '@/util/getExpertVP'

describe('util/getExpertVP', () => {
  it('getExpertVP', () => {
    expect(getExpertVP({ expertsRow4And5: 0, missionCoordinators: 0, pilotsMechanics: 0 })).to.eq(0)
    expect(getExpertVP({ expertsRow4And5: 3, missionCoordinators: 2, pilotsMechanics: 1 })).to.eq(10)
  })
})
