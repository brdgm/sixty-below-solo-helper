import { expect } from 'chai'
import mockState from '../helper/mockState'
import mockRound from '../helper/mockRound'
import mockTurn from '../helper/mockTurn'
import RouteCalculator from '@/services/RouteCalculator'
import Player from '@/services/enum/Player'

describe('services/RouteCalculator', () => {
  it('getNextRouteTo-alternating', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:1, player:Player.PLAYER})
    ]})]})
    const routeCalculator = new RouteCalculator({round:1, turn:1, player:Player.PLAYER})
    expect(routeCalculator.getNextRouteTo(state)).to.eq('/round/1/turn/2/bot')
  })

  it('getNextRouteTo-player-passed', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:1, player:Player.PLAYER}),
      mockTurn({round:1, turn:2, player:Player.BOT}),
      mockTurn({round:1, turn:3, player:Player.PLAYER, pass:true}),
      mockTurn({round:1, turn:4, player:Player.BOT})
    ]})]})
    expect(new RouteCalculator({round:1, turn:3, player:Player.PLAYER}).getNextRouteTo(state)).to.eq('/round/1/turn/4/bot')
    expect(new RouteCalculator({round:1, turn:4, player:Player.BOT}).getNextRouteTo(state)).to.eq('/round/1/turn/5/bot')
  })

  it('getNextRouteTo-bot-passed', () => {
    const state = mockState({rounds:[mockRound({round:2, turns:[
      mockTurn({round:2, turn:1, player:Player.BOT, pass:true}),
      mockTurn({round:2, turn:2, player:Player.PLAYER})
    ]})]})
    expect(new RouteCalculator({round:2, turn:1, player:Player.BOT}).getNextRouteTo(state)).to.eq('/round/2/turn/2/player')
    expect(new RouteCalculator({round:2, turn:2, player:Player.PLAYER}).getNextRouteTo(state)).to.eq('/round/2/turn/3/player')
  })

  it('getNextRouteTo-both-passed', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:1, player:Player.PLAYER, pass:true}),
      mockTurn({round:1, turn:2, player:Player.BOT, pass:true})
    ]})]})
    expect(new RouteCalculator({round:1, turn:2, player:Player.BOT}).getNextRouteTo(state)).to.eq('/round/1/end')
  })

  it('getNextRouteTo-ignores-later-turns', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:1, player:Player.PLAYER}),
      mockTurn({round:1, turn:2, player:Player.BOT, pass:true})
    ]})]})
    expect(new RouteCalculator({round:1, turn:1, player:Player.PLAYER}).getNextRouteTo(state)).to.eq('/round/1/turn/2/bot')
  })

  it('getNextRouteTo-no-player', () => {
    const routeCalculator = new RouteCalculator({round:1})
    expect(() => routeCalculator.getNextRouteTo(mockState())).to.throw('Player of current turn is not set.')
  })

  it('getBackRouteTo', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:1, player:Player.PLAYER, pass:true}),
      mockTurn({round:1, turn:2, player:Player.BOT}),
      mockTurn({round:1, turn:3, player:Player.BOT})
    ]})]})
    expect(new RouteCalculator({round:1, turn:1, player:Player.PLAYER}).getBackRouteTo(state)).to.eq('/round/1/start')
    expect(new RouteCalculator({round:1, turn:2, player:Player.BOT}).getBackRouteTo(state)).to.eq('/round/1/turn/1/player')
    expect(new RouteCalculator({round:1, turn:3, player:Player.BOT}).getBackRouteTo(state)).to.eq('/round/1/turn/2/bot')
  })

  it('getBackRouteTo-bot-action-steps', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:1, player:Player.BOT, botActionDecisions:[{executed:true}, {executed:false}]}),
      mockTurn({round:1, turn:2, player:Player.PLAYER})
    ]})]})
    expect(new RouteCalculator({round:1, turn:1, player:Player.BOT, action:2}).getBackRouteTo(state)).to.eq('/round/1/turn/1/bot/action/1')
    expect(new RouteCalculator({round:1, turn:1, player:Player.BOT, action:1}).getBackRouteTo(state)).to.eq('/round/1/turn/1/bot')
    expect(new RouteCalculator({round:1, turn:1, player:Player.BOT}).getBackRouteTo(state)).to.eq('/round/1/start')
    expect(new RouteCalculator({round:1, turn:2, player:Player.PLAYER}).getBackRouteTo(state)).to.eq('/round/1/turn/1/bot/action/2')
  })

  it('getBotActionRouteTo', () => {
    const routeCalculator = new RouteCalculator({round:2, turn:3, player:Player.BOT})
    expect(routeCalculator.getBotActionRouteTo(0)).to.eq('/round/2/turn/3/bot')
    expect(routeCalculator.getBotActionRouteTo(2)).to.eq('/round/2/turn/3/bot/action/2')
  })

  it('getFirstTurnRouteTo', () => {
    expect(new RouteCalculator({round:1}).getFirstTurnRouteTo()).to.eq('/round/1/turn/1/player')
    expect(new RouteCalculator({round:2}).getFirstTurnRouteTo()).to.eq('/round/2/turn/1/bot')
  })

  it('getLastTurnRouteTo', () => {
    const state = mockState({rounds:[mockRound({round:1, turns:[
      mockTurn({round:1, turn:2, player:Player.BOT, pass:true}),
      mockTurn({round:1, turn:1, player:Player.PLAYER, pass:true})
    ]})]})
    expect(new RouteCalculator({round:1}).getLastTurnRouteTo(state)).to.eq('/round/1/turn/2/bot')
    expect(new RouteCalculator({round:2}).getLastTurnRouteTo(state)).to.eq('/round/2/start')
  })

  it('getNextRoundRouteTo', () => {
    expect(new RouteCalculator({round:1}).getNextRoundRouteTo()).to.eq('/round/2/start')
    expect(new RouteCalculator({round:5}).getNextRoundRouteTo()).to.eq('/round/6/start')
    expect(new RouteCalculator({round:6}).getNextRoundRouteTo()).to.eq('/gameEnd')
  })
})

