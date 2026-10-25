import { expect } from 'chai'
import { RouteParams } from 'vue-router'
import mockRouteLocation from '../helper/mockRouteLocation'
import mockState from '../helper/mockState'
import mockRound from '../helper/mockRound'
import mockTurn from '../helper/mockTurn'
import NavigationState from '@/util/NavigationState'
import Player from '@/services/enum/Player'

const state = mockState({rounds:[
  mockRound({round:1, turns:[
    mockTurn({round:1, turn:1, player:Player.PLAYER}),
    mockTurn({round:1, turn:2, player:Player.BOT})
  ]})
]})

describe('util/NavigationState', () => {
  it('round-turn', () => {
    const navigationState = getNavigationState('RoundTurnPlayer', {round:'2', turn:'3'})
    expect(navigationState.round).to.eq(2)
    expect(navigationState.turn).to.eq(3)
  })

  it('no-route-params', () => {
    const navigationState = getNavigationState('SetupGame', {})
    expect(navigationState.round).to.eq(0)
    expect(navigationState.turn).to.eq(0)
  })
})

function getNavigationState(routeName:string, params:RouteParams) : NavigationState {
  return new NavigationState(mockRouteLocation({name:routeName, params}), state)
}
