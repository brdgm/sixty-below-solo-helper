/** Victory points depicted on the Station Sites, by Station Site value (index), values 0-2 have none */
const VP_PER_STATION_SITE_VALUE = [0, 0, 0, 1, 2, 4, 5, 6]

/**
 * Get Arka's victory points for the Station Sites she built.
 * If a Station Site with the value was not available, she took one with a lower value -
 * the app does not track this, the player corrects the victory points in the final scoring.
 * @param stationSiteValues Values of the Station Sites built by Arka (Engineer icons +1)
 * @returns Victory points
 */
export default function getArkaStationSitesVP(stationSiteValues : readonly number[]) : number {
  const maxValue = VP_PER_STATION_SITE_VALUE.length - 1
  return stationSiteValues.reduce((sum, value) => sum + (VP_PER_STATION_SITE_VALUE[Math.min(value, maxValue)] ?? 0), 0)
}
