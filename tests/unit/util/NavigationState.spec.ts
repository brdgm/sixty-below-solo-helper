import { expect } from 'chai'
import { RouteParams } from 'vue-router'
import mockRouteLocation from '../helper/mockRouteLocation'
import mockState from '../helper/mockState'
import mockRound from '../helper/mockRound'
import mockTurn from '../helper/mockTurn'
import mockBotPersistence from '../helper/mockBotPersistence'
import mockCardDeck from '../helper/mockCardDeck'
import mockBotState from '../helper/mockBotState'
import NavigationState from '@/util/NavigationState'
import Player from '@/services/enum/Player'
import Action from '@/services/enum/Action'
import ExpertColumn from '@/services/enum/ExpertColumn'
import ExpertType from '@/services/enum/ExpertType'
import { State } from '@/store/state'

const state = mockState({rounds:[
  mockRound({round:1,
    initialBotPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa1','sab10','saa2','saa3','saa4']})}),
    turns:[
      mockTurn({round:1, turn:1, player:Player.PLAYER}),
      mockTurn({round:1, turn:2, player:Player.BOT,
        botPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['sab10','saa2','saa3','saa4'], played:['saa1']})})}),
      mockTurn({round:1, turn:3, player:Player.PLAYER, pass:true}),
      mockTurn({round:1, turn:4, player:Player.BOT,
        botPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa2','saa3','saa4'], played:['saa1','sab10']})})}),
      mockTurn({round:1, turn:5, player:Player.BOT,
        botPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa3','saa4'], played:['saa1','sab10','saa2']})})})
    ]
  }),
  mockRound({round:2,
    initialBotPersistence: mockBotPersistence({
      cardDeck: mockCardDeck({pile:['saa5','saa6','saa7','saa8'], discard:['saa1','saa2','saa3']}),
      botState: mockBotState({expeditionSteps:10})
    })
  })
]})

describe('util/NavigationState', () => {
  it('round-start', () => {
    const navigationState = getNavigationState('RoundStart', {round:'1'})
    expect(navigationState.round).to.eq(1)
    expect(navigationState.turn).to.eq(0)
    expect(navigationState.player).to.be.undefined
    expect(navigationState.startPlayer).to.eq(Player.PLAYER)
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.pile.map(card => card.id)).to.eql(['saa1','sab10','saa2','saa3','saa4'])
    expect(navigationState.cardDeck.played).to.have.lengthOf(0)
  })

  it('player-turn', () => {
    const navigationState = getNavigationState('RoundTurnPlayer', {round:'1', turn:'3'})
    expect(navigationState.turn).to.eq(3)
    expect(navigationState.player).to.eq(Player.PLAYER)
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.played.map(card => card.id)).to.eql(['saa1'])
  })

  it('bot-turn-first-draws-card', () => {
    const navigationState = getNavigationState('RoundTurnBot', {round:'1', turn:'2'})
    expect(navigationState.player).to.eq(Player.BOT)
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.currentCard?.id).to.eq('saa1')
    expect(navigationState.cardDeck.pile).to.have.lengthOf(4)
  })

  it('bot-turn-draws-card-without-star', () => {
    const navigationState = getNavigationState('RoundTurnBot', {round:'1', turn:'4'})
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.currentCard?.id).to.eq('sab10')
    expect(navigationState.cardDeck.starsPlayed).to.eq(1)
  })

  it('bot-turn-draws-third-star', () => {
    const navigationState = getNavigationState('RoundTurnBot', {round:'1', turn:'6'})
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.currentCard?.id).to.eq('saa3')
    expect(navigationState.cardDeck.starsPlayed).to.eq(3)
  })

  it('bot-turn-passes-at-star-limit', () => {
    const passState = mockState({rounds:[
      mockRound({round:1, turns:[
        mockTurn({round:1, turn:1, player:Player.BOT,
          botPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa4'], played:['saa1','saa2','saa3']})})})
      ]})
    ]})
    const navigationState = getNavigationState('RoundTurnBot', {round:'1', turn:'2'}, passState)
    expect(navigationState.botPass).to.be.true
    expect(navigationState.cardDeck.currentCard?.id).to.eq('saa3')
    expect(navigationState.cardDeck.pile).to.have.lengthOf(1)
  })

  it('bot-turn-stored-pass-after-card', () => {
    const passState = mockState({rounds:[
      mockRound({round:1,
        initialBotPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa3','saa4'], played:['saa1','saa2']})}),
        turns:[
          mockTurn({round:1, turn:1, player:Player.BOT, pass:true,
            botPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa4'], played:['saa1','saa2','saa3']})})})
        ]
      })
    ]})
    const navigationState = getNavigationState('RoundTurnBot', {round:'1', turn:'1'}, passState)
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.currentCard?.id).to.eq('saa3')
    expect(navigationState.botActions?.pendingStep?.action).to.eq(Action.PLACE_EXPLORER_EXPERT_ACTION_TILE)
    expect(navigationState.botActionScreen?.pass).to.be.true
  })

  it('bot-turn-star-limit-from-expedition-path', () => {
    const navigationState = getNavigationState('RoundTurnBot', {round:'2', turn:'1'})
    expect(navigationState.startPlayer).to.eq(Player.BOT)
    expect(navigationState.botState.starLimit).to.eq(4)
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.currentCard?.id).to.eq('saa5')
  })

  it('round-end', () => {
    const navigationState = getNavigationState('RoundEnd', {round:'1'})
    expect(navigationState.player).to.be.undefined
    expect(navigationState.botPass).to.be.false
    expect(navigationState.cardDeck.played.map(card => card.id)).to.eql(['saa1','sab10','saa2'])
  })

  it('no-route-params', () => {
    const navigationState = getNavigationState('SetupGame', {})
    expect(navigationState.round).to.eq(0)
    expect(navigationState.turn).to.eq(0)
    expect(navigationState.cardDeck.pile).to.have.lengthOf(9)
    expect(navigationState.botState.expeditionSteps).to.eq(0)
    expect(navigationState.botActions).to.be.undefined
  })

  it('bot-turn-resolves-actions', () => {
    const navigationState = getNavigationState('RoundTurnBot', {round:'1', turn:'6'})
    expect(navigationState.action).to.eq(0)
    expect(navigationState.botActionDecisions).to.eql([])
    expect(navigationState.botActions?.pendingStep?.action).to.eq(Action.PLACE_EXPLORER_EXPERT_ACTION_TILE)
    expect(navigationState.botState.rondelPosition).to.eq(1)
    expect(navigationState.botState.expeditionSteps).to.eq(1)
  })

  it('bot-turn-action-step-uses-stored-decisions', () => {
    const actionState = mockState({arkaMilestoneCards:['sm1','sm6','sm3'], rounds:[
      mockRound({round:1, turns:[
        mockTurn({round:1, turn:1, player:Player.BOT,
          botPersistence: mockBotPersistence({cardDeck: mockCardDeck({pile:['saa1'], played:['sab10']})}),
          botActionDecisions: [{executed:true, expertType:ExpertType.ENGINEER}, {executed:false}]})
      ]})
    ]})

    const step0 = getNavigationState('RoundTurnBot', {round:'1', turn:'1'}, actionState)
    expect(step0.cardDeck.currentCard?.id).to.eq('sab10')
    expect(step0.botActionDecisions).to.eql([])
    expect(step0.botActions?.pendingStep?.action).to.eq(Action.TAKE_ENGINEER)

    const step1 = getNavigationState('RoundTurnBotAction', {round:'1', turn:'1', action:'1'}, actionState)
    expect(step1.action).to.eq(1)
    expect(step1.cardDeck.currentCard?.id).to.eq('sab10')
    expect(step1.botActionDecisions).to.eql([{executed:true, expertType:ExpertType.ENGINEER}])
    expect(step1.botActions?.pendingStep?.action).to.eq(Action.PLACE_EXPLORER_LANDSCAPE)
    expect(step1.botActionScreen?.step?.action).to.eq(Action.PLACE_EXPLORER_LANDSCAPE)
    expect(step1.botState.getExperts(ExpertColumn.ENGINEER)).to.eql([ExpertType.ENGINEER])

    const step2 = getNavigationState('RoundTurnBotAction', {round:'1', turn:'1', action:'2'}, actionState)
    expect(step2.botActions?.pendingStep?.action).to.eq(Action.TAKE_EXPERT)
    expect(step2.botState.rondelPosition).to.eq(2)
  })

  it('game-end', () => {
    const gameEndState = mockState({arkaMilestoneCards:['sm1','sm6','sm3'], rounds:[
      mockRound({round:3, milestoneOverfulfilled:true}),
      mockRound({round:5, milestoneOverfulfilled:false}),
      mockRound({round:6, milestoneOverfulfilled:true, turns:[
        mockTurn({round:6, turn:1, player:Player.BOT,
          botPersistence: mockBotPersistence({botState: mockBotState({expeditionSteps:23, upgrades:2})})}),
        mockTurn({round:6, turn:2, player:Player.PLAYER, pass:true})
      ]})
    ]})
    const navigationState = getNavigationState('GameEnd', {}, gameEndState)
    expect(navigationState.round).to.eq(6)
    expect(navigationState.botState.expeditionSteps).to.eq(23)
    expect(navigationState.botState.upgrades).to.eq(2)
    expect(navigationState.scoredMilestones.map(item => item.victoryPoints)).to.eql([6, 5, 12])
  })

  it('round-end-own-milestone-not-scored', () => {
    const roundEndState = mockState({rounds:[mockRound({round:3, milestoneOverfulfilled:true})]})
    expect(getNavigationState('RoundEnd', {round:'3'}, roundEndState).scoredMilestones).to.have.lengthOf(0)
    expect(getNavigationState('RoundStart', {round:'4'}, roundEndState).scoredMilestones).to.have.lengthOf(1)
  })

  it('milestone-cards-not-scored-yet', () => {
    const milestoneState = mockState({arkaMilestoneCards:['sm1','sm6','sm3']})
    const milestoneCardIds = (round : string) => getNavigationState('RoundStart', {round}, milestoneState).milestoneCards.map(card => card.id)
    expect(milestoneCardIds('3')).to.eql(['sm1','sm6','sm3'])
    expect(milestoneCardIds('4')).to.eql(['sm6','sm3'])
    expect(milestoneCardIds('6')).to.eql(['sm3'])
  })
})

function getNavigationState(routeName:string, params:RouteParams, navigationTestState:State = state) : NavigationState {
  return new NavigationState(mockRouteLocation({name:routeName, params}), navigationTestState)
}
