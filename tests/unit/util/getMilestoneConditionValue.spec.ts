import { expect } from 'chai'
import getMilestoneConditionValue from '@/util/getMilestoneConditionValue'
import MilestoneCondition from '@/services/enum/MilestoneCondition'
import ExpertType from '@/services/enum/ExpertType'
import mockBotState from '../helper/mockBotState'

const botState = mockBotState({
  engineer: [ExpertType.ENGINEER, ExpertType.MISSION_COORDINATOR, ExpertType.PILOT],
  radioOperator: [ExpertType.RADIO_OPERATOR],
  upgrades: 3,
  cardsDrawn: 7,
  explorersLandscape: 4,
  explorersExpertActionTile: 2,
  stationsBuilt: 2
})

describe('util/getMilestoneConditionValue', () => {
  it('getMilestoneConditionValue', () => {
    const expected : [MilestoneCondition, number][] = [
      [MilestoneCondition.TWICE_AS_MANY_ENGINEERS, 3],
      [MilestoneCondition.TWICE_AS_MANY_RADIO_OPERATORS, 2],
      [MilestoneCondition.TWO_UPGRADES_MORE, 3],
      [MilestoneCondition.TWO_EXPERTS_MORE, 7],
      [MilestoneCondition.THREE_PROJECT_CARDS_MORE, 7],
      [MilestoneCondition.ONE_PRESENCE_MORE_LANDSCAPES, 6]
    ]
    for (const [condition, value] of expected) {
      expect(getMilestoneConditionValue(condition, botState), condition).to.eq(value)
    }
  })
})
