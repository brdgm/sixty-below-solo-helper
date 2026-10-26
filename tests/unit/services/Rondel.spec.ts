import { expect } from 'chai'
import Rondel from '@/services/Rondel'
import RondelAction from '@/services/enum/RondelAction'

describe('services/Rondel', () => {
  it('move-from-start', () => {
    expect(Rondel.move(0, 1)).to.eql({ position: 1, crossedActions: [RondelAction.EXPEDITION] })
  })

  it('move-without-action', () => {
    expect(Rondel.move(1, 1)).to.eql({ position: 2, crossedActions: [] })
    expect(Rondel.move(7, 1)).to.eql({ position: 0, crossedActions: [] })
  })

  it('move-multiple-steps', () => {
    expect(Rondel.move(2, 3)).to.eql({ position: 5, crossedActions: [RondelAction.DRAW_CARDS, RondelAction.UPGRADE] })
    expect(Rondel.move(6, 3)).to.eql({ position: 1, crossedActions: [RondelAction.UPGRADE, RondelAction.EXPEDITION] })
  })

  it('move-full-circle', () => {
    expect(Rondel.move(0, 8)).to.eql({ position: 0, crossedActions: [RondelAction.EXPEDITION, RondelAction.DRAW_CARDS, RondelAction.UPGRADE, RondelAction.UPGRADE] })
  })

  it('move-zero', () => {
    expect(Rondel.move(3, 0)).to.eql({ position: 3, crossedActions: [] })
  })
})
