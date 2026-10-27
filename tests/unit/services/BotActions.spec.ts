import { expect } from 'chai'
import BotActions from '@/services/BotActions'
import Cards from '@/services/Cards'
import MilestoneCards from '@/services/MilestoneCards'
import Action from '@/services/enum/Action'
import BotActionNoticeType from '@/services/enum/BotActionNoticeType'
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

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step?.action).to.eq(Action.EXPLORE_LANDSCAPE)
    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.TODO)
    expect(botActions.screens[0].notices).to.eql([])
    expect(botActions.screens[0].botState.explorersLandscape).to.eq(0)
    expect(botActions.pendingStep).to.be.undefined
    expect(botActions.botState.rondelPosition).to.eq(1)
    expect(botActions.botState.expeditionSteps).to.eq(1)
    expect(botActions.botState.explorersLandscape).to.eq(1)
  })

  it('build-station-pending', () => {
    const botActions = resolve('saa1', { engineer: [ExpertType.ENGINEER] })

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.pendingStep?.action).to.eq(Action.BUILD_STATION)
    expect(botActions.pendingStep?.stationSiteValue).to.eq(3)
    expect(botActions.pendingStep?.decisionIndex).to.eq(0)
    expect(botActions.botState.stationsBuilt).to.eq(0)
  })

  it('build-station-executed', () => {
    const botActions = resolve('saa1', {}, [{ executed: true }])

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.EXECUTED)
    expect(botActions.decisionCount).to.eq(1)
    expect(botActions.botState.stationsBuilt).to.eq(1)
  })

  it('build-station-not-possible-rondel-draw-cards', () => {
    const botActions = resolve('saa1', { rondelPosition: 1, investor: [ExpertType.INVESTOR] }, [{ executed: false }])

    expect(botActions.screens.map(screen => screen.step?.action)).to.eql([Action.BUILD_STATION, RondelAction.DRAW_CARDS])
    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.screens[1].step?.cardCount).to.eq(2)
    expect(botActions.screens[1].notices).to.eql([])
    expect(botActions.botState.rondelPosition).to.eq(3)
    expect(botActions.botState.cardsDrawn).to.eq(2)
    expect(botActions.botState.stationsBuilt).to.eq(0)
  })

  it('build-station-no-station-left-notice', () => {
    const botActions = resolve('saa1', { stationsBuilt: STATION_COUNT })

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step).to.be.undefined
    expect(botActions.screens[0].notices).to.eql([
      { type: BotActionNoticeType.NOT_POSSIBLE, action: Action.BUILD_STATION, reason: NotPossibleReason.NO_STATION }
    ])
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

    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.EXECUTED)
    expect(botActions.screens[0].step?.expertColumn).to.eq(ExpertColumn.RADIO_OPERATOR)
    expect(botActions.botState.getExperts(ExpertColumn.RADIO_OPERATOR)).to.eql([ExpertType.RADIO_OPERATOR])
  })

  it('take-expert-pilot-column-with-most-experts', () => {
    const botActions = resolve('saa2', { investor: [ExpertType.INVESTOR] }, [{ executed: true, expertType: ExpertType.PILOT }])

    expect(botActions.screens[0].step?.pilotMechanicColumns).to.eql([ExpertColumn.INVESTOR])
    expect(botActions.botState.getExperts(ExpertColumn.INVESTOR)).to.eql([ExpertType.INVESTOR, ExpertType.PILOT])
  })

  it('take-expert-pilot-most-full-column-full', () => {
    const fullColumn = [ExpertType.INVESTOR, ExpertType.INVESTOR, ExpertType.INVESTOR, ExpertType.INVESTOR]
    const botState = { investor: fullColumn, engineer: [ExpertType.ENGINEER] }
    const botActions = resolve('saa2', botState, [{ executed: true, expertType: ExpertType.PILOT }])

    expect(botActions.screens[0].step?.pilotMechanicColumns).to.eql([ExpertColumn.ENGINEER])
    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.EXECUTED)
    expect(botActions.botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.ENGINEER, ExpertType.PILOT])
    expect(botActions.botState.getExperts(ExpertColumn.INVESTOR)).to.eql(fullColumn)
  })

  it('take-expert-mechanic-all-columns-full', () => {
    const fullColumn = [ExpertType.PILOT, ExpertType.PILOT, ExpertType.MECHANIC, ExpertType.MECHANIC]
    const botState = { investor: fullColumn, radioOperator: fullColumn, engineer: fullColumn }
    const botActions = resolve('saa2', botState, [{ executed: true, expertType: ExpertType.MECHANIC }])

    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.screens[0].step?.notPossibleReason).to.eq(NotPossibleReason.COLUMN_FULL)
    expect(botActions.botState.rondelPosition).to.eq(2)
  })

  it('take-expert-mechanic-tie-chosen-column', () => {
    const botActions = resolve('saa2', {}, [{ executed: true, expertType: ExpertType.MECHANIC, expertColumn: ExpertColumn.ENGINEER }])

    expect(botActions.screens[0].step?.pilotMechanicColumns).to.eql([ExpertColumn.INVESTOR, ExpertColumn.RADIO_OPERATOR, ExpertColumn.ENGINEER])
    expect(botActions.botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.MECHANIC])
  })

  it('take-expert-column-full-notice', () => {
    const fullColumn = [ExpertType.RADIO_OPERATOR, ExpertType.RADIO_OPERATOR, ExpertType.PILOT, ExpertType.MECHANIC]
    const botActions = resolve('saa2', { radioOperator: fullColumn }, [{ executed: true, expertType: ExpertType.RADIO_OPERATOR }])

    expect(botActions.screens).to.have.lengthOf(2)
    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.screens[1].notices).to.eql([
      { type: BotActionNoticeType.NOT_POSSIBLE, action: Action.TAKE_EXPERT, reason: NotPossibleReason.COLUMN_FULL }
    ])
    expect(botActions.botState.getExperts(ExpertColumn.RADIO_OPERATOR)).to.eql(fullColumn)
    expect(botActions.botState.rondelPosition).to.eq(2)
  })

  it('take-expert-not-possible-by-player', () => {
    const botActions = resolve('saa2', {}, [{ executed: false }])

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step?.status).to.eq(BotActionStatus.NOT_POSSIBLE)
    expect(botActions.botState.rondelPosition).to.eq(2)
  })

  it('milestone-special-action-take-upgrade-notice', () => {
    const botActions = resolve('sab11', {}, [{ executed: true, expertType: ExpertType.MISSION_COORDINATOR }], ['sm2', 'sm1'])

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step?.action).to.eq(Action.TAKE_ENGINEER)
    expect(botActions.screens[0].notices).to.eql([{ type: BotActionNoticeType.UPGRADE }])
    expect(botActions.screens[0].step?.expertType).to.eq(ExpertType.MISSION_COORDINATOR)
    expect(botActions.botState.upgrades).to.eq(1)
    expect(botActions.botState.getIcons(ExpertColumn.ENGINEER)).to.eq(2)
  })

  it('rondel-upgrade-notice', () => {
    const botActions = resolve('saa4', { rondelPosition: 4 })

    expect(botActions.screens[0].step?.action).to.eq(Action.EXPLORE_LANDSCAPE)
    expect(botActions.screens[0].notices).to.eql([{ type: BotActionNoticeType.UPGRADE }])
    expect(botActions.botState.upgrades).to.eq(1)
  })

  it('rondel-expedition-level-notice', () => {
    const botActions = resolve('saa4', { expeditionSteps: 9 })

    expect(botActions.screens[0].notices).to.eql([{ type: BotActionNoticeType.EXPEDITION_LEVEL, starLimit: 4 }])
    expect(botActions.botState.starLimit).to.eq(4)
  })

  it('milestone-special-action-all-pending', () => {
    const botActions = resolve('sab10', {})

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step?.action).to.eq(Action.TAKE_ENGINEER)
    expect(botActions.screens[0].step?.milestoneCard?.id).to.eq('sm1')
    expect(botActions.screens[0].step?.sourceAction).to.eq(Action.MILESTONE_SPECIAL_ACTION_ALL)
    expect(botActions.steps.map(step => step.status)).to.eql([BotActionStatus.PENDING, BotActionStatus.UPCOMING, BotActionStatus.UPCOMING])
  })

  it('milestone-special-action-all-resolved', () => {
    const decisions : BotActionDecision[] = [
      { executed: true, expertType: ExpertType.ENGINEER },
      { executed: true },
      { executed: true, expertType: ExpertType.INVESTOR }
    ]
    const botActions = resolve('sab10', {}, decisions)

    expect(botActions.screens.map(screen => screen.step?.action)).to.eql([Action.TAKE_ENGINEER, Action.PLACE_EXPLORER_LANDSCAPE, Action.TAKE_EXPERT])
    expect(botActions.decisionCount).to.eq(3)
    expect(botActions.getDecisionCountBefore(0)).to.eq(0)
    expect(botActions.getDecisionCountBefore(2)).to.eq(2)
    expect(botActions.screens[2].botState.explorersLandscape).to.eq(1)
    expect(botActions.botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.ENGINEER])
    expect(botActions.botState.getExperts(ExpertColumn.INVESTOR)).to.eql([ExpertType.INVESTOR])
    expect(botActions.botState.explorersLandscape).to.eq(1)
  })

  it('draw-cards-only', () => {
    const botActions = resolve('sab13', {}, [], [])

    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step).to.eql({ action: RondelAction.DRAW_CARDS, status: BotActionStatus.TODO, cardCount: 1 })
    expect(botActions.botState.rondelPosition).to.eq(3)
  })

  it('nothing-to-do', () => {
    const botActions = resolve('sab13', { rondelPosition: 7 }, [], [])

    expect(botActions.screens).to.eql([{ notices: [], botState: botActions.botState.toPersistence() }])
  })

  it('take-column-expert-column-full-notice', () => {
    const fullColumn = [ExpertType.INVESTOR, ExpertType.INVESTOR, ExpertType.INVESTOR, ExpertType.INVESTOR]
    const botActions = resolve('sab12', { investor: fullColumn }, [{ executed: true, expertType: ExpertType.ENGINEER }], ['sm1'])

    expect(botActions.screens.map(screen => screen.step?.action)).to.eql([Action.TAKE_ENGINEER, undefined])
    expect(botActions.screens[1].notices).to.eql([
      { type: BotActionNoticeType.NOT_POSSIBLE, action: Action.TAKE_INVESTOR, reason: NotPossibleReason.COLUMN_FULL }
    ])
    expect(botActions.getDecisionCountBefore(1)).to.eq(1)
  })

  it('place-explorer-no-explorer-left-notice', () => {
    const botActions = resolve('saa5', { explorersLandscape: EXPLORER_COUNT })

    expect(botActions.screens[0].notices).to.eql([
      { type: BotActionNoticeType.NOT_POSSIBLE, action: Action.PLACE_EXPLORER_LANDSCAPE, reason: NotPossibleReason.NO_EXPLORER }
    ])
    expect(botActions.decisionCount).to.eq(0)
  })

  it('place-explorer-expert-action-tile-executed', () => {
    const botActions = resolve('saa3', {}, [{ executed: true }])

    expect(botActions.botState.explorersExpertActionTile).to.eq(1)
    expect(botActions.botState.explorersLeft).to.eq(EXPLORER_COUNT - 1)
  })

  it('no-pass-below-star-limit', () => {
    const botActions = resolve('saa4', {}, [], undefined, 2)

    expect(botActions.pass).to.be.false
    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].pass).to.be.undefined
  })

  it('pass-on-last-screen-without-decision', () => {
    const botActions = resolve('saa4', {}, [], undefined, 3)

    expect(botActions.pass).to.be.true
    expect(botActions.screens).to.have.lengthOf(1)
    expect(botActions.screens[0].step?.action).to.eq(Action.EXPLORE_LANDSCAPE)
    expect(botActions.screens[0].pass).to.be.true
  })

  it('pass-nothing-to-do', () => {
    const botActions = resolve('sab13', { rondelPosition: 7 }, [], [], 3)

    expect(botActions.pass).to.be.true
    expect(botActions.screens).to.eql([{ notices: [], botState: botActions.botState.toPersistence(), pass: true }])
  })

  it('pass-known-before-last-decision', () => {
    const pending = resolve('saa1', {}, [], undefined, 3)
    expect(pending.pass).to.be.false
    expect(pending.screens).to.have.lengthOf(1)
    expect(pending.screens[0].pass).to.be.true

    for (const executed of [true, false]) {
      const botActions = resolve('saa1', {}, [{ executed }], undefined, 3)
      expect(botActions.pass).to.be.true
      expect(botActions.screens).to.have.lengthOf(1)
      expect(botActions.screens[0].pass).to.be.true
    }
  })

  it('pass-not-known-before-decision-not-possible-raises-expedition-level', () => {
    const botState = { rondelPosition: 7, expeditionSteps: 9 }
    const pending = resolve('saa1', botState, [], undefined, 3)
    expect(pending.screens).to.have.lengthOf(1)
    expect(pending.screens[0].pass).to.be.undefined

    const executed = resolve('saa1', botState, [{ executed: true }], undefined, 3)
    expect(executed.pass).to.be.true
    expect(executed.screens).to.have.lengthOf(2)
    expect(executed.screens[0].pass).to.be.undefined
    expect(executed.screens[1]).to.eql({ notices: [], botState: executed.botState.toPersistence(), pass: true })

    const notPossible = resolve('saa1', botState, [{ executed: false }], undefined, 3)
    expect(notPossible.pass).to.be.false
    expect(notPossible.botState.starLimit).to.eq(4)
    expect(notPossible.screens).to.have.lengthOf(2)
    expect(notPossible.screens[1].notices).to.eql([{ type: BotActionNoticeType.EXPEDITION_LEVEL, starLimit: 4 }])
    expect(notPossible.screens[1].pass).to.be.undefined
  })

  it('pass-not-known-before-decision-with-upcoming-actions', () => {
    const decisions : BotActionDecision[] = [
      { executed: true, expertType: ExpertType.ENGINEER },
      { executed: true },
      { executed: true, expertType: ExpertType.INVESTOR }
    ]
    expect(resolve('sab10', {}, [], undefined, 3).screens[0].pass).to.be.undefined
    expect(resolve('sab10', {}, decisions.slice(0, 2), undefined, 3).screens[2].pass).to.be.true

    const botActions = resolve('sab10', {}, decisions, undefined, 3)
    expect(botActions.pass).to.be.true
    expect(botActions.screens.map(screen => screen.pass)).to.eql([undefined, undefined, true])
  })
})

function resolve(cardId : string, botState : MockBotStateParams, decisions : BotActionDecision[] = [], milestoneCardIds? : string[],
    starsPlayed = 1) : BotActions {
  const cards = milestoneCardIds ? milestoneCardIds.map(MilestoneCards.get) : milestoneCards
  return new BotActions(Cards.get(cardId), mockBotState(botState), cards, decisions, starsPlayed)
}
