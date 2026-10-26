import { expect } from 'chai'
import getWinner from '@/util/getWinner'
import Player from '@/services/enum/Player'

describe('util/getWinner', () => {
  it('getWinner', () => {
    expect(getWinner(80, 79)).to.eq(Player.PLAYER)
    expect(getWinner(79, 80)).to.eq(Player.BOT)
  })

  it('tie-arka-wins', () => {
    expect(getWinner(80, 80)).to.eq(Player.BOT)
  })
})
