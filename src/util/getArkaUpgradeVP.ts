/** Arka gains 4 victory points for each Upgrade */
const VP_PER_UPGRADE = 4

/**
 * Get Arka's victory points for her Upgrades.
 * @param upgrades Number of Upgrades
 * @returns Victory points
 */
export default function getArkaUpgradeVP(upgrades : number) : number {
  return upgrades * VP_PER_UPGRADE
}
