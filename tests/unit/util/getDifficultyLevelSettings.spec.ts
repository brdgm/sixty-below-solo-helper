import { expect } from 'chai'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import getDifficultyLevelSettings from '@/util/getDifficultyLevelSettings'
import DifficultyLevel from '@/services/enum/DifficultyLevel'
import DifficultyMode from '@/services/enum/DifficultyMode'

describe('util/getDifficultyLevelSettings', () => {
  it('actionCardsWithoutStar', () => {
    expect(getAllEnumValues(DifficultyLevel).map(level => getDifficultyLevelSettings(level).actionCardsWithoutStar))
        .to.eql([0, 1, 2, 3, 4])
  })

  it('mode', () => {
    expect(getAllEnumValues(DifficultyLevel).map(level => getDifficultyLevelSettings(level).mode))
        .to.eql([DifficultyMode.STANDARD, DifficultyMode.STANDARD, DifficultyMode.LEGENDARY, DifficultyMode.LEGENDARY, DifficultyMode.EPIC])
  })

  it('invalid', () => {
    expect(() => getDifficultyLevelSettings(99 as DifficultyLevel)).to.throw('Invalid difficulty level: 99')
  })
})
