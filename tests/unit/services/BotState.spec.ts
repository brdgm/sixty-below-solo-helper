import { expect } from 'chai'
import BotState, { EXPLORER_COUNT, MAX_UPGRADES, STATION_COUNT } from '@/services/BotState'
import ExpertColumn from '@/services/enum/ExpertColumn'
import ExpertType from '@/services/enum/ExpertType'
import RondelAction from '@/services/enum/RondelAction'
import mockBotState from '../helper/mockBotState'

describe('services/BotState', () => {
  it('new', () => {
    const botState = BotState.new()

    expect(botState.rondelPosition).to.eq(0)
    expect(botState.expeditionSteps).to.eq(0)
    expect(botState.expeditionPathPosition).to.eq(0)
    expect(botState.starLimit).to.eq(3)
    expect(botState.upgrades).to.eq(0)
    expect(botState.cardsDrawn).to.eq(0)
    expect(botState.explorersLeft).to.eq(EXPLORER_COUNT)
    expect(botState.stationsLeft).to.eq(STATION_COUNT)
    expect(botState.presenceLandscapes).to.eq(0)
    expect(botState.getIcons(ExpertColumn.INVESTOR)).to.eq(1)
    expect(botState.getIcons(ExpertColumn.RADIO_OPERATOR)).to.eq(1)
    expect(botState.getIcons(ExpertColumn.ENGINEER)).to.eq(1)
    expect(botState.stationSiteValue).to.eq(2)
    expect(botState.columnsWithMostExperts).to.eql([ExpertColumn.INVESTOR, ExpertColumn.RADIO_OPERATOR, ExpertColumn.ENGINEER])
  })

  it('experts-icons', () => {
    const botState = mockBotState({
      investor: [ExpertType.INVESTOR, ExpertType.PILOT],
      radioOperator: [ExpertType.MISSION_COORDINATOR, ExpertType.RADIO_OPERATOR, ExpertType.MECHANIC],
      engineer: [ExpertType.ENGINEER, ExpertType.MISSION_COORDINATOR]
    })

    expect(botState.getIcons(ExpertColumn.INVESTOR)).to.eq(2)
    expect(botState.getIcons(ExpertColumn.RADIO_OPERATOR)).to.eq(3)
    expect(botState.getIcons(ExpertColumn.ENGINEER)).to.eq(3)
    expect(botState.stationSiteValue).to.eq(4)
    expect(botState.getColumnTotal(ExpertColumn.INVESTOR)).to.eq(3)
    expect(botState.getColumnTotal(ExpertColumn.RADIO_OPERATOR)).to.eq(4)
    expect(botState.columnsWithMostExperts).to.eql([ExpertColumn.RADIO_OPERATOR])
  })

  it('experts-scoring-counts', () => {
    const botState = mockBotState({
      investor: [ExpertType.INVESTOR, ExpertType.PILOT],
      radioOperator: [ExpertType.MISSION_COORDINATOR, ExpertType.RADIO_OPERATOR, ExpertType.MECHANIC, ExpertType.PILOT],
      engineer: [ExpertType.ENGINEER, ExpertType.MISSION_COORDINATOR, ExpertType.ENGINEER]
    })

    // column totals: 3, 5, 4
    expect(botState.expertsRow4And5Count).to.eq(3)
    expect(botState.missionCoordinatorCount).to.eq(2)
    expect(botState.pilotMechanicCount).to.eq(3)
  })

  it('addExpert', () => {
    const botState = BotState.new()

    botState.addExpert(ExpertColumn.ENGINEER, ExpertType.ENGINEER)
    botState.addExpert(ExpertColumn.ENGINEER, ExpertType.MISSION_COORDINATOR)
    botState.addExpert(ExpertColumn.ENGINEER, ExpertType.PILOT)

    expect(botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.ENGINEER, ExpertType.MISSION_COORDINATOR, ExpertType.PILOT])
    expect(botState.getIcons(ExpertColumn.ENGINEER)).to.eq(3)
    expect(botState.isColumnFull(ExpertColumn.ENGINEER)).to.false

    botState.addExpert(ExpertColumn.ENGINEER, ExpertType.MECHANIC)
    expect(botState.isColumnFull(ExpertColumn.ENGINEER)).to.true
    expect(() => botState.addExpert(ExpertColumn.ENGINEER, ExpertType.ENGINEER)).to.throw()
  })

  it('addExpert-wrong-column', () => {
    const botState = BotState.new()

    expect(() => botState.addExpert(ExpertColumn.INVESTOR, ExpertType.ENGINEER)).to.throw()
  })

  it('getExpertColumn', () => {
    expect(BotState.getExpertColumn(ExpertType.INVESTOR)).to.eq(ExpertColumn.INVESTOR)
    expect(BotState.getExpertColumn(ExpertType.RADIO_OPERATOR)).to.eq(ExpertColumn.RADIO_OPERATOR)
    expect(BotState.getExpertColumn(ExpertType.ENGINEER)).to.eq(ExpertColumn.ENGINEER)
    expect(BotState.getExpertColumn(ExpertType.MISSION_COORDINATOR)).to.undefined
    expect(BotState.getExpertColumn(ExpertType.PILOT)).to.undefined
    expect(BotState.getExpertColumn(ExpertType.MECHANIC)).to.undefined
  })

  it('moveRondel', () => {
    const botState = mockBotState({
      rondelPosition: 7,
      investor: [ExpertType.INVESTOR],
      radioOperator: [ExpertType.RADIO_OPERATOR, ExpertType.MISSION_COORDINATOR]
    })

    expect(botState.moveRondel(1)).to.eql([])
    expect(botState.rondelPosition).to.eq(0)

    expect(botState.moveRondel(3)).to.eql([
      { action: RondelAction.EXPEDITION, amount: 3 },
      { action: RondelAction.DRAW_CARDS, amount: 2 }
    ])
    expect(botState.rondelPosition).to.eq(3)
    expect(botState.expeditionSteps).to.eq(3)
    expect(botState.cardsDrawn).to.eq(2)

    expect(botState.moveRondel(4)).to.eql([
      { action: RondelAction.UPGRADE, amount: 1 },
      { action: RondelAction.UPGRADE, amount: 1 }
    ])
    expect(botState.rondelPosition).to.eq(7)
    expect(botState.upgrades).to.eq(2)
  })

  it('moveRondel-expedition-path', () => {
    const botState = mockBotState({
      expeditionSteps: 8,
      radioOperator: [ExpertType.RADIO_OPERATOR]
    })
    expect(botState.expeditionPathPosition).to.eq(1)
    expect(botState.starLimit).to.eq(3)

    botState.moveRondel(1)

    expect(botState.expeditionSteps).to.eq(10)
    expect(botState.expeditionPathPosition).to.eq(2)
    expect(botState.starLimit).to.eq(4)
  })

  it('takeUpgrade-max', () => {
    const botState = mockBotState({rondelPosition: 4, upgrades: MAX_UPGRADES - 1})

    expect(botState.takeUpgrade()).to.true
    expect(botState.takeUpgrade()).to.false
    expect(botState.moveRondel(1)).to.eql([{ action: RondelAction.UPGRADE, amount: 0 }])
    expect(botState.upgrades).to.eq(MAX_UPGRADES)
  })

  it('explorers-stations', () => {
    const botState = mockBotState({explorersLandscape: 10, explorersExpertActionTile: 2, stationsBuilt: 4})
    expect(botState.explorersLeft).to.eq(1)
    expect(botState.stationsLeft).to.eq(1)
    expect(botState.presenceLandscapes).to.eq(14)

    botState.placeExplorerLandscape()
    botState.buildStation()

    expect(botState.explorersLeft).to.eq(0)
    expect(botState.stationsLeft).to.eq(0)
    expect(botState.presenceLandscapes).to.eq(16)
    expect(() => botState.placeExplorerLandscape()).to.throw()
    expect(() => botState.placeExplorerExpertActionTile()).to.throw()
    expect(() => botState.buildStation()).to.throw()
  })

  it('placeExplorerExpertActionTile', () => {
    const botState = BotState.new()

    botState.placeExplorerExpertActionTile()

    expect(botState.explorersExpertActionTile).to.eq(1)
    expect(botState.explorersLandscape).to.eq(0)
    expect(botState.presenceLandscapes).to.eq(0)
  })

  it('persistence', () => {
    const botState = mockBotState({rondelPosition: 5, expeditionSteps: 12, engineer: [ExpertType.ENGINEER],
        upgrades: 3, cardsDrawn: 4, explorersLandscape: 5, explorersExpertActionTile: 1, stationsBuilt: 2})
    const persistence = botState.toPersistence()

    expect(BotState.fromPersistence(persistence).toPersistence()).to.eql(persistence)

    // persistence is a copy, not affected by changes
    botState.addExpert(ExpertColumn.ENGINEER, ExpertType.ENGINEER)
    expect(persistence.experts[ExpertColumn.ENGINEER]).to.eql([ExpertType.ENGINEER])
  })
})
