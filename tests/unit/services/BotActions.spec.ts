import { expect } from 'chai'
import BotActions from '@/services/BotActions'
import Cards from '@/services/Cards'
import MilestoneCards from '@/services/MilestoneCards'
import Action from '@/services/enum/Action'
import BotActionStatus from '@/services/enum/BotActionStatus'
import ExpertColumn from '@/services/enum/ExpertColumn'
import ExpertType from '@/services/enum/ExpertType'
import NotPossibleReason from '@/services/enum/NotPossibleReason'
import RondelAction from '@/services/enum/RondelAction'
import { EXPLORER_COUNT, STATION_COUNT } from '@/services/BotState'
import { BotActionDecision } from '@/store/state'
import mockBotState, { MockBotStateParams } from '../helper/mockBotState'

const milestoneCards = ['sm1', 'sm6', 'sm3'].map(MilestoneCards.get)

describe('services/BotActions', () => {
  it('explore-landscape-no-decision', () => {
    const botActions = resolve('saa4', {})

    expect(botActions.steps).to.eql([{ action: Action.EXPLORE_LANDSCAPE, status: BotActionStatus.TODO }])
    expect(botActions.pendingStep).to.be.undefined
    expect(botActions.decisionCount).to.eq(0)
    expect(botActions.botState.rondelPosition).to.eq(1)
    expect(botActions.botState.expeditionSteps).to.eq(1)
    expect(botActions.botState.explorersLandscape).to.eq(1)
  })

  it('build-station-pending', () => {
    const botActions = resolve('saa1', { engineer: [ExpertType.ENGINEER] })

    expect(botActions.steps).to.have.lengthOf(1)
    expect(botActions.pendingStep?.action).to.eq(Action.BUILD_STATION)
    expect(botActions.pendingStep?.stationSiteValue).to.eq(3)
    expect(botActions.pendingStep?.decisionIndex).to.eq(0)
    expect(botActions.botState.stationsBuilt).to.eq(0)
  })

  it('build-station-executed', () => {
    const botActions = resolve('saa1', {}, [{ executed: true }])

    expect(botActions.steps[0].status).to.eq(BotActionStatus.EXECUTED)
    expect(botActions.pendingStep).to.be.undefined
    expect(botActions.decisionCount).to.eq(1)
    expect(botActions.botState.stationsBuilt).to.eq(1)
  })

  it('build-station-not-possible-rondel-draw-cards', () => {
    const botActions = resolve('saa1', { rondelPosition: 1, investor: [ExpertType.INVESTOR] }, [{ executed: false }])

    expect(botActions.steps).to.eql([
      { action: Action.BUILD_STATION, status: BotActionStatus.NOT_POSSIBLE, stationSiteValue: 2, decisionIndex: 0, notPossibleReason: undefined },
      { action: RondelAction.DRAW_CARDS, status: BotActionStatus.TODO, cardCount: 2 }
    ])
    expect(botActions.botState.rondelPosition).to.eq(3)
    expect(botActions.botState.cardsDrawn).to.eq(2)
    expect(botActions.botState.stationsBuilt).to.eq(0)
    expect(botActions.hasStepsAfterDecision(0)).to.be.true
  })

  it('build-station-no-station-left', () => {
    const botActions = resolve('saa1', { stationsBuilt: STATION_COUNT })

    expect(botActions.steps[0].status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.steps[0].notPossibleReason).to.eq(NotPossibleReason.NO_STATION)
    expect(botActions.pendingStep).to.be.undefined
    expect(botActions.botState.rondelPosition).to.eq(2)
  })

  it('build-station-if-3-engineers-fulfilled', () => {
    const botActions = resolve('saa2', { engineer: [ExpertType.ENGINEER, ExpertType.MISSION_COORDINATOR] })

    expect(botActions.pendingStep?.action).to.eq(Action.BUILD_STATION)
    expect(botActions.pendingStep?.sourceAction).to.eq(Action.BUILD_STATION_IF_3_ENGINEERS)
    expect(botActions.pendingStep?.stationSiteValue).to.eq(4)
  })

  it('build-station-if-3-engineers-otherwise-take-expert', () => {
    const botActions = resolve('saa2', { engineer: [ExpertType.ENGINEER, ExpertType.PILOT] })

    expect(botActions.pendingStep?.action).to.eq(Action.TAKE_EXPERT)
    expect(botActions.pendingStep?.sourceAction).to.eq(Action.BUILD_STATION_IF_3_ENGINEERS)
  })

  it('take-expert-own-column', () => {
    const botActions = resolve('saa2', {}, [{ executed: true, expertType: ExpertType.RADIO_OPERATOR }])

    expect(botActions.steps[0].status).to.eq(BotActionStatus.EXECUTED)
    expect(botActions.steps[0].expertColumn).to.eq(ExpertColumn.RADIO_OPERATOR)
    expect(botActions.botState.getExperts(ExpertColumn.RADIO_OPERATOR)).to.eql([ExpertType.RADIO_OPERATOR])
  })

  it('take-expert-pilot-column-with-most-experts', () => {
    const botActions = resolve('saa2', { investor: [ExpertType.INVESTOR] }, [{ executed: true, expertType: ExpertType.PILOT }])

    expect(botActions.steps[0].pilotMechanicColumns).to.eql([ExpertColumn.INVESTOR])
    expect(botActions.botState.getExperts(ExpertColumn.INVESTOR)).to.eql([ExpertType.INVESTOR, ExpertType.PILOT])
  })

  it('take-expert-mechanic-tie-chosen-column', () => {
    const botActions = resolve('saa2', {}, [{ executed: true, expertType: ExpertType.MECHANIC, expertColumn: ExpertColumn.ENGINEER }])

    expect(botActions.steps[0].pilotMechanicColumns).to.eql([ExpertColumn.INVESTOR, ExpertColumn.RADIO_OPERATOR, ExpertColumn.ENGINEER])
    expect(botActions.botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.MECHANIC])
  })

  it('take-expert-column-full', () => {
    const fullColumn = [ExpertType.RADIO_OPERATOR, ExpertType.RADIO_OPERATOR, ExpertType.PILOT, ExpertType.MECHANIC]
    const botActions = resolve('saa2', { radioOperator: fullColumn }, [{ executed: true, expertType: ExpertType.RADIO_OPERATOR }])

    expect(botActions.steps[0].status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.steps[0].notPossibleReason).to.eq(NotPossibleReason.COLUMN_FULL)
    expect(botActions.botState.getExperts(ExpertColumn.RADIO_OPERATOR)).to.eql(fullColumn)
    expect(botActions.botState.rondelPosition).to.eq(2)
  })

  it('take-expert-not-possible', () => {
    const botActions = resolve('saa2', {}, [{ executed: false }])

    expect(botActions.steps[0].status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.steps[0].notPossibleReason).to.be.undefined
    expect(botActions.botState.rondelPosition).to.eq(2)
  })

  it('milestone-special-action-take-upgrade-automated', () => {
    const botActions = resolve('sab11', {}, [{ executed: true, expertType: ExpertType.MISSION_COORDINATOR }], ['sm2', 'sm1'])

    expect(botActions.steps).to.have.lengthOf(1)
    expect(botActions.steps[0].action).to.eq(Action.TAKE_ENGINEER)
    expect(botActions.steps[0].expertType).to.eq(ExpertType.MISSION_COORDINATOR)
    expect(botActions.botState.upgrades).to.eq(1)
    expect(botActions.botState.getIcons(ExpertColumn.ENGINEER)).to.eq(2)
  })

  it('milestone-special-action-all-pending-and-upcoming', () => {
    const botActions = resolve('sab10', {})

    expect(botActions.steps.map(step => [step.action, step.status, step.milestoneCard?.id])).to.eql([
      [Action.TAKE_ENGINEER, BotActionStatus.PENDING, 'sm1'],
      [Action.PLACE_EXPLORER_LANDSCAPE, BotActionStatus.UPCOMING, 'sm6'],
      [Action.TAKE_EXPERT, BotActionStatus.UPCOMING, 'sm3']
    ])
    expect(botActions.steps[0].sourceAction).to.eq(Action.MILESTONE_SPECIAL_ACTION_ALL)
  })

  it('milestone-special-action-all-resolved', () => {
    const decisions : BotActionDecision[] = [
      { executed: true, expertType: ExpertType.ENGINEER },
      { executed: true },
      { executed: true, expertType: ExpertType.INVESTOR }
    ]
    const botActions = resolve('sab10', {}, decisions)

    expect(botActions.steps.map(step => step.status)).to.eql([BotActionStatus.EXECUTED, BotActionStatus.EXECUTED, BotActionStatus.EXECUTED])
    expect(botActions.decisionCount).to.eq(3)
    expect(botActions.botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.ENGINEER])
    expect(botActions.botState.getExperts(ExpertColumn.INVESTOR)).to.eql([ExpertType.INVESTOR])
    expect(botActions.botState.explorersLandscape).to.eq(1)
    expect(botActions.hasStepsAfterDecision(2)).to.be.false
  })

  it('milestone-special-action-no-milestone-left', () => {
    const botActions = resolve('sab13', {}, [], [])

    expect(botActions.steps).to.eql([
      { action: RondelAction.DRAW_CARDS, status: BotActionStatus.TODO, cardCount: 1 }
    ])
    expect(botActions.botState.rondelPosition).to.eq(3)
  })

  it('take-column-expert-column-full', () => {
    const fullColumn = [ExpertType.INVESTOR, ExpertType.INVESTOR, ExpertType.INVESTOR, ExpertType.INVESTOR]
    const botActions = resolve('sab12', { investor: fullColumn }, [], ['sm2'])

    expect(botActions.steps[0].action).to.eq(Action.TAKE_INVESTOR)
    expect(botActions.steps[0].status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.steps[0].notPossibleReason).to.eq(NotPossibleReason.COLUMN_FULL)
    expect(botActions.pendingStep).to.be.undefined
  })

  it('place-explorer-no-explorer-left', () => {
    const botActions = resolve('saa5', { explorersLandscape: EXPLORER_COUNT })

    expect(botActions.steps[0].status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.steps[0].notPossibleReason).to.eq(NotPossibleReason.NO_EXPLORER)
    expect(botActions.decisionCount).to.eq(0)
  })

  it('place-explorer-expert-action-tile-executed', () => {
    const botActions = resolve('saa3', {}, [{ executed: true }])

    expect(botActions.botState.explorersExpertActionTile).to.eq(1)
    expect(botActions.botState.explorersLeft).to.eq(EXPLORER_COUNT - 1)
  })
})

function resolve(cardId : string, botState : MockBotStateParams, decisions : BotActionDecision[] = [], milestoneCardIds? : string[]) : BotActions {
  const cards = milestoneCardIds ? milestoneCardIds.map(MilestoneCards.get) : milestoneCards
  return new BotActions(Cards.get(cardId), mockBotState(botState), cards, decisions)
}
