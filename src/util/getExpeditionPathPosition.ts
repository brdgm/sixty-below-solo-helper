/** Number of Expedition Track steps tracked by one step on the Expedition Path */
export const EXPEDITION_TRACK_STEPS_PER_PATH_SPACE = 5
/** Number of spaces on the Expedition Path */
export const EXPEDITION_PATH_SPACES = 7

/**
 * Get the position on Arka's Expedition Path for the given number of Expedition Track steps.
 * @param expeditionSteps Steps on the Expedition Track (= victory points)
 * @returns Expedition Path position (0 = first space, max. last space)
 */
export default function getExpeditionPathPosition(expeditionSteps : number) : number {
  return Math.min(Math.floor(expeditionSteps / EXPEDITION_TRACK_STEPS_PER_PATH_SPACE), EXPEDITION_PATH_SPACES - 1)
}
