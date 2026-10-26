/** Victory points of the Milestone Tiles I., II., III.: [lower side, higher side] (D4) */
const MILESTONE_TILE_VP = [[4, 6], [5, 8], [6, 12]]
/** Names of the Milestone Tiles, as printed */
export const MILESTONE_TILE_NAMES = ['I.', 'II.', 'III.']

/**
 * Get the victory points of a Milestone Tile.
 * @param milestoneIndex Index of the Milestone (0 = Milestone Tile I. at the end of round 3, ...)
 * @param overfulfilled Higher victory points if the condition is overfulfilled, otherwise the lower ones
 * @returns Victory points
 */
export default function getMilestoneVP(milestoneIndex : number, overfulfilled : boolean) : number {
  const tile = MILESTONE_TILE_VP[milestoneIndex]
  if (!tile) {
    throw new Error(`Invalid milestone index: ${milestoneIndex}`)
  }
  return overfulfilled ? tile[1] : tile[0]
}
