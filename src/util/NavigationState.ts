import { State } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'

/**
 * Navigation state of the current view, derived from the route parameters and the persisted state.
 */
export default class NavigationState {

  readonly round : number
  readonly turn : number

  // state is used to restore the bot state from the persisted turns once the game flow is implemented
  constructor(route: RouteLocation, _state: State) {
    this.round = getIntRouteParam(route, 'round')
    this.turn = getIntRouteParam(route, 'turn')
  }

}
