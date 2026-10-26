import { expect } from 'chai'
import getScoredMilestones from '@/util/getScoredMilestones'
import mockState from '../helper/mockState'
import mockRound from '../helper/mockRound'

const state = mockState({arkaMilestoneCards:['sm4','sm1','sm6'], rounds:[
  mockRound({round:3, milestoneOverfulfilled:true}),
  mockRound({round:4}),
  mockRound({round:5, milestoneOverfulfilled:false}),
  mockRound({round:6})
]})

describe('util/getScoredMilestones', () => {
  it('before-round-4', () => {
    const result = getScoredMilestones(state, 4)
    expect(result).to.have.lengthOf(1)
    expect(result[0].milestoneIndex).to.eq(0)
    expect(result[0].milestoneCard.id).to.eq('sm4')
    expect(result[0].overfulfilled).to.be.true
    expect(result[0].victoryPoints).to.eq(6)
  })

  it('round-3-not-included-before-end', () => {
    expect(getScoredMilestones(state, 3)).to.have.lengthOf(0)
  })

  it('game-end-round-6-not-scored', () => {
    const result = getScoredMilestones(state, 7)
    expect(result.map(item => [item.milestoneCard.id, item.victoryPoints])).to.eql([['sm4', 6], ['sm1', 5]])
  })
})
