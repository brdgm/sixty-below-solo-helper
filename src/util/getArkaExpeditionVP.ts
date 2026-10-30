/** Victory points of the first Expedition Path space, where Arka's Explorer starts */
const VP_FIRST_EXPEDITION_PATH_SPACE = 5

/**
 * Get Arka's victory points for the Expedition Track: 1 VP per step, plus the 5 VP of the
 * first Expedition Path space (each further space is reached by 5 steps, so they are included in the steps).
 * @param expeditionSteps Steps on the Expedition Track
 * @returns Victory points
 */
export default function getArkaExpeditionVP(expeditionSteps : number) : number {
  return VP_FIRST_EXPEDITION_PATH_SPACE + expeditionSteps
}
