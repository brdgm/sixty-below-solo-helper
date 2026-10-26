import RondelAction from './enum/RondelAction'

/** Number of spaces on the Rondel */
export const RONDEL_SPACES = 8

/**
 * Rondel action crossed when moving from the space with the given index to the next one (clockwise).
 * Space 0 is the starting space, directly before the Expedition action (C1).
 */
const ACTION_AFTER_SPACE : (RondelAction|undefined)[] = [
  RondelAction.EXPEDITION,
  undefined,
  RondelAction.DRAW_CARDS,
  undefined,
  RondelAction.UPGRADE,
  undefined,
  RondelAction.UPGRADE,
  undefined
]

/**
 * Arka's Rondel.
 */
export default {

  /**
   * Move the Rondel Explorer clockwise.
   * @param position Current position (0..7)
   * @param steps Number of steps
   * @returns New position and the actions crossed, in order
   */
  move(position : number, steps : number) : RondelMove {
    const crossedActions : RondelAction[] = []
    let newPosition = position
    for (let step = 0; step < steps; step++) {
      const action = ACTION_AFTER_SPACE[newPosition]
      if (action) {
        crossedActions.push(action)
      }
      newPosition = (newPosition + 1) % RONDEL_SPACES
    }
    return { position: newPosition, crossedActions }
  }

}

export interface RondelMove {
  position: number
  crossedActions: RondelAction[]
}
