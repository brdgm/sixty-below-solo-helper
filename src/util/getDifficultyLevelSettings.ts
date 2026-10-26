import DifficultyLevel from '@/services/enum/DifficultyLevel'
import DifficultyMode from '@/services/enum/DifficultyMode'

/**
 * Get settings for difficulty level.
 * @param difficultyLevel Difficulty level
 * @returns Difficulty level settings
 */
export default function getDifficultyLevelSettings(difficultyLevel : DifficultyLevel) : DifficultyLevelSettings {
  switch (difficultyLevel) {
    case DifficultyLevel.LEVEL_1:
      return { mode: DifficultyMode.STANDARD, actionCardsWithoutStar: 0 }
    case DifficultyLevel.LEVEL_2:
      return { mode: DifficultyMode.STANDARD, actionCardsWithoutStar: 1 }
    case DifficultyLevel.LEVEL_3:
      return { mode: DifficultyMode.LEGENDARY, actionCardsWithoutStar: 2 }
    case DifficultyLevel.LEVEL_4:
      return { mode: DifficultyMode.LEGENDARY, actionCardsWithoutStar: 3 }
    case DifficultyLevel.LEVEL_5:
      return { mode: DifficultyMode.EPIC, actionCardsWithoutStar: 4 }
    default:
      throw new Error(`Invalid difficulty level: ${difficultyLevel}`)
  }
}

export interface DifficultyLevelSettings {
  mode: DifficultyMode
  /** Number of random Action Cards without a star added to Arka's deck */
  actionCardsWithoutStar: number
}
