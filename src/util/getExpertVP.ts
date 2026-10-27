/**
 * Get victory points for Experts (C14: Arka scores like the player).
 * @param counts Number of 4th and 5th placed Experts (without the printed one) of all columns, Mission Coordinators, Pilots and Mechanics
 * @returns Victory points: 2 per 4th/5th placed Expert, 1 per Mission Coordinator, 2 per Pilot/Mechanic
 */
export default function getExpertVP(counts : ExpertCounts) : number {
  return counts.expertsRow4And5 * 2 + counts.missionCoordinators + counts.pilotsMechanics * 2
}

export interface ExpertCounts {
  expertsRow4And5: number
  missionCoordinators: number
  pilotsMechanics: number
}
