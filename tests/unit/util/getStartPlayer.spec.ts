import { expect } from 'chai'
import getStartPlayer from '@/util/getStartPlayer'
import Player from '@/services/enum/Player'

describe('util/getStartPlayer', () => {
  it('getStartPlayer', () => {
    expect([1,2,3,4,5,6].map(getStartPlayer)).to.eql([Player.PLAYER, Player.BOT, Player.PLAYER, Player.BOT, Player.PLAYER, Player.BOT])
  })
})
