import { cloneDeep } from 'lodash'
import { ref } from 'vue'
import { BotStatePersistence } from '@/store/state'
import ExpertColumn from './enum/ExpertColumn'
import ExpertType from './enum/ExpertType'
import RondelAction from './enum/RondelAction'
import Rondel from './Rondel'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import getExpeditionPathPosition from '@/util/getExpeditionPathPosition'
import getStarLimit from '@/util/getStarLimit'

/** Max. Experts per column on Arka's Tableau, including the printed one (C5) */
export const MAX_EXPERTS_PER_COLUMN = 5
/** Upgrades of one color: 4 level one, 4 level two, 3 level three */
export const MAX_UPGRADES = 11
/** Explorers available for the board: 17 of one color, minus the 2 on the Expedition Path and the Rondel replaced by the app (C19) */
export const EXPLORER_COUNT = 15
export const STATION_COUNT = 5

/** Expert type printed at the bottom of each column, Experts of this type are placed in this column */
const COLUMN_EXPERT_TYPE : Record<ExpertColumn, ExpertType> = {
  [ExpertColumn.INVESTOR]: ExpertType.INVESTOR,
  [ExpertColumn.RADIO_OPERATOR]: ExpertType.RADIO_OPERATOR,
  [ExpertColumn.ENGINEER]: ExpertType.ENGINEER
}

/**
 * State of Arka's Tableau: Rondel, Expedition Track/Path, Expert columns, Upgrades,
 * and the counters for the face-down cards, Explorers and Stations.
 */
export default class BotState {

  private readonly _state

  private constructor(state : BotStatePersistence) {
    this._state = ref(state)
  }

  public get rondelPosition() : number {
    return this._state.value.rondelPosition
  }

  /**
   * Steps on the Expedition Track (= victory points).
   */
  public get expeditionSteps() : number {
    return this._state.value.expeditionSteps
  }

  /**
   * Position on the Expedition Path (0 = first space).
   */
  public get expeditionPathPosition() : number {
    return getExpeditionPathPosition(this.expeditionSteps)
  }

  /**
   * Expedition Level: number of stars Arka plays per round.
   */
  public get starLimit() : number {
    return getStarLimit(this.expeditionSteps)
  }

  public get upgrades() : number {
    return this._state.value.upgrades
  }

  public get cardsDrawn() : number {
    return this._state.value.cardsDrawn
  }

  public get explorersLandscape() : number {
    return this._state.value.explorersLandscape
  }

  public get explorersExpertActionTile() : number {
    return this._state.value.explorersExpertActionTile
  }

  public get explorersLeft() : number {
    return EXPLORER_COUNT - this.explorersLandscape - this.explorersExpertActionTile
  }

  public get stationsBuilt() : number {
    return this._state.value.stationsBuilt
  }

  public get stationsLeft() : number {
    return STATION_COUNT - this.stationsBuilt
  }

  /**
   * Arka's Presence on Landscapes: Explorers on Landscapes and Stations (C16).
   */
  public get presenceLandscapes() : number {
    return this.explorersLandscape + this.stationsBuilt
  }

  /**
   * Value of the Station Site for building a Station: number of Engineer icons +1.
   */
  public get stationSiteValue() : number {
    return this.getIcons(ExpertColumn.ENGINEER) + 1
  }

  /**
   * Experts taken by Arka in the given column, in the order taken (without the printed Expert).
   */
  public getExperts(column : ExpertColumn) : readonly ExpertType[] {
    return this._state.value.experts[column]
  }

  /**
   * Number of Experts in the column, including the printed one.
   */
  public getColumnTotal(column : ExpertColumn) : number {
    return 1 + this.getExperts(column).length
  }

  public isColumnFull(column : ExpertColumn) : boolean {
    return this.getColumnTotal(column) >= MAX_EXPERTS_PER_COLUMN
  }

  /**
   * Number of icons of the column: printed Expert, Experts of the column's type and Mission Coordinators.
   * Pilots and Mechanics do not count as icon.
   */
  public getIcons(column : ExpertColumn) : number {
    const expertType = COLUMN_EXPERT_TYPE[column]
    return 1 + this.getExperts(column)
        .filter(item => item == expertType || item == ExpertType.MISSION_COORDINATOR).length
  }

  /**
   * Columns with the most Experts: candidates for placing a Pilot or Mechanic (player chooses on a tie, C6).
   */
  public get columnsWithMostExperts() : ExpertColumn[] {
    const columns = getAllEnumValues(ExpertColumn)
    const maxTotal = Math.max(...columns.map(column => this.getColumnTotal(column)))
    return columns.filter(column => this.getColumnTotal(column) == maxTotal)
  }

  /**
   * Number of Experts in the 4th and 5th row of all columns (2 VP each).
   */
  public get expertsRow4And5Count() : number {
    return getAllEnumValues(ExpertColumn)
        .reduce((sum, column) => sum + Math.max(0, this.getColumnTotal(column) - 3), 0)
  }

  public get missionCoordinatorCount() : number {
    return this.getExpertTypeCount(ExpertType.MISSION_COORDINATOR)
  }

  public get pilotMechanicCount() : number {
    return this.getExpertTypeCount(ExpertType.PILOT) + this.getExpertTypeCount(ExpertType.MECHANIC)
  }

  private getExpertTypeCount(expertType : ExpertType) : number {
    return getAllEnumValues(ExpertColumn)
        .reduce((sum, column) => sum + this.getExperts(column).filter(item => item == expertType).length, 0)
  }

  /**
   * Add an Expert to a column.
   * Radio Operators, Engineers and Investors can only be placed in their own column,
   * Mission Coordinators, Pilots and Mechanics in any column.
   * @param column Column
   * @param expertType Expert type
   */
  public addExpert(column : ExpertColumn, expertType : ExpertType) : void {
    const expertColumn = BotState.getExpertColumn(expertType)
    if (expertColumn && expertColumn != column) {
      throw new Error(`Expert ${expertType} cannot be placed in column ${column}.`)
    }
    if (this.isColumnFull(column)) {
      throw new Error(`Column ${column} is full.`)
    }
    this._state.value.experts[column].push(expertType)
  }

  /**
   * Move the Rondel Explorer and carry out all crossed Rondel actions.
   * @param steps Number of steps
   * @returns Effects of the crossed actions, in order
   */
  public moveRondel(steps : number) : RondelEffect[] {
    const { position, crossedActions } = Rondel.move(this.rondelPosition, steps)
    this._state.value.rondelPosition = position
    return crossedActions.map(action => ({ action, amount: this.applyRondelAction(action) }))
  }

  private applyRondelAction(action : RondelAction) : number {
    switch (action) {
      case RondelAction.EXPEDITION: {
        const steps = this.getIcons(ExpertColumn.RADIO_OPERATOR)
        this._state.value.expeditionSteps += steps
        return steps
      }
      case RondelAction.DRAW_CARDS: {
        const cards = this.getIcons(ExpertColumn.INVESTOR)
        this._state.value.cardsDrawn += cards
        return cards
      }
      case RondelAction.UPGRADE:
        return this.takeUpgrade() ? 1 : 0
      default:
        throw new Error(`Invalid rondel action: ${action}`)
    }
  }

  /**
   * Take an Upgrade, if there is still one left.
   * @returns true if an Upgrade was taken
   */
  public takeUpgrade() : boolean {
    if (this.upgrades >= MAX_UPGRADES) {
      return false
    }
    this._state.value.upgrades++
    return true
  }

  public placeExplorerLandscape() : void {
    this.checkExplorerLeft()
    this._state.value.explorersLandscape++
  }

  public placeExplorerExpertActionTile() : void {
    this.checkExplorerLeft()
    this._state.value.explorersExpertActionTile++
  }

  private checkExplorerLeft() : void {
    if (this.explorersLeft <= 0) {
      throw new Error('No Explorer left.')
    }
  }

  public buildStation() : void {
    if (this.stationsLeft <= 0) {
      throw new Error('No Station left.')
    }
    this._state.value.stationsBuilt++
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : BotStatePersistence {
    return cloneDeep(this._state.value)
  }

  /**
   * Get the column for an Expert type. Pilots, Mechanics and Mission Coordinators have no own column.
   * @param expertType Expert type
   * @returns Column or undefined
   */
  public static getExpertColumn(expertType : ExpertType) : ExpertColumn|undefined {
    return getAllEnumValues(ExpertColumn).find(column => COLUMN_EXPERT_TYPE[column] == expertType)
  }

  /**
   * Get the Expert type printed at the bottom of a column.
   * @param column Column
   */
  public static getColumnExpertType(column : ExpertColumn) : ExpertType {
    return COLUMN_EXPERT_TYPE[column]
  }

  /**
   * Creates the initial state at game start.
   */
  public static new() : BotState {
    return new BotState({
      rondelPosition: 0,
      expeditionSteps: 0,
      experts: {
        [ExpertColumn.INVESTOR]: [],
        [ExpertColumn.RADIO_OPERATOR]: [],
        [ExpertColumn.ENGINEER]: []
      },
      upgrades: 0,
      cardsDrawn: 0,
      explorersLandscape: 0,
      explorersExpertActionTile: 0,
      stationsBuilt: 0
    })
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : BotStatePersistence) : BotState {
    return new BotState(cloneDeep(persistence))
  }

}

export interface RondelEffect {
  action: RondelAction
  /** Expedition: steps on the Expedition Track; Draw Cards: cards drawn; Upgrade: Upgrades taken (0 if none left) */
  amount: number
}
