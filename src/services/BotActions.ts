import { BotActionDecision } from '@/store/state'
import BotState, { RondelEffect } from './BotState'
import Card, { CardAction } from './Card'
import MilestoneCard from './MilestoneCard'
import Action from './enum/Action'
import BotActionStatus from './enum/BotActionStatus'
import ExpertColumn from './enum/ExpertColumn'
import ExpertType from './enum/ExpertType'
import NotPossibleReason from './enum/NotPossibleReason'
import RondelAction from './enum/RondelAction'

/** Engineer icons Arka needs for "Build a Station if Arka has at least 3 Engineer icons" */
const MIN_ENGINEER_ICONS_BUILD_STATION = 3

/** Expert type and column for the "take the left-most ..." actions */
const TAKE_COLUMN_EXPERT : Partial<Record<Action, ExpertType>> = {
  [Action.TAKE_ENGINEER]: ExpertType.ENGINEER,
  [Action.TAKE_INVESTOR]: ExpertType.INVESTOR,
  [Action.TAKE_RADIO_OPERATOR]: ExpertType.RADIO_OPERATOR
}

/**
 * Resolves Arka's Action Card into the steps shown to the player as action tiles:
 * Rondel move first, then the card actions from top to bottom.
 * Everything that can be derived from Arka's state is decided and applied by the app (branches, Milestone special actions,
 * Rondel effects, Upgrades, Explorers/Stations/Expert columns). Fully automated effects get no step, except drawing Cards.
 * Steps that need the board are resolved with the player's decisions, in order; the first step without a decision is pending.
 * "Not possible" moves the Rondel Explorer one step forward.
 */
export default class BotActions {

  readonly botState : BotState
  private readonly _steps : BotActionStep[] = []
  private readonly decisions : readonly BotActionDecision[]
  private _decisionCount = 0
  private pending = false

  /**
   * @param card Action Card
   * @param botState Arka's state before the card - is updated with all resolved actions
   * @param milestoneCards Arka's Milestone Cards that are not scored yet, in scoring order
   * @param decisions Player decisions for the steps that need the board, in order
   */
  constructor(card : Card, botState : BotState, milestoneCards : readonly MilestoneCard[], decisions : readonly BotActionDecision[]) {
    this.botState = botState
    this.decisions = decisions
    this.addRondelEffects(this.botState.moveRondel(card.rondelSteps))
    for (const cardAction of card.actions) {
      this.resolveCardAction(cardAction, milestoneCards)
    }
  }

  public get steps() : readonly BotActionStep[] {
    return this._steps
  }

  /**
   * Number of player decisions used for the steps.
   */
  public get decisionCount() : number {
    return this._decisionCount
  }

  /**
   * Step waiting for the player's decision.
   */
  public get pendingStep() : BotActionStep|undefined {
    return this._steps.find(step => step.status == BotActionStatus.PENDING)
  }

  /**
   * Checks if there are steps after the step with the given decision.
   * @param decisionIndex Index of the decision
   */
  public hasStepsAfterDecision(decisionIndex : number) : boolean {
    const stepIndex = this._steps.findIndex(step => step.decisionIndex == decisionIndex)
    return stepIndex >= 0 && stepIndex < this._steps.length - 1
  }

  private resolveCardAction(cardAction : CardAction, milestoneCards : readonly MilestoneCard[]) : void {
    switch (cardAction.action) {
      case Action.MILESTONE_SPECIAL_ACTION: {
        const milestoneCard = milestoneCards[0]
        if (milestoneCard) {
          this.resolveAction(milestoneCard.specialAction, { sourceAction: cardAction.action, milestoneCard })
        }
        break
      }
      case Action.MILESTONE_SPECIAL_ACTION_ALL:
        for (const milestoneCard of milestoneCards) {
          this.resolveAction(milestoneCard.specialAction, { sourceAction: cardAction.action, milestoneCard })
        }
        break
      case Action.BUILD_STATION_IF_3_ENGINEERS: {
        const engineerIcons = this.botState.getIcons(ExpertColumn.ENGINEER)
        if (engineerIcons >= MIN_ENGINEER_ICONS_BUILD_STATION) {
          this.resolveAction(Action.BUILD_STATION, { sourceAction: cardAction.action })
        }
        else {
          this.resolveAction(cardAction.otherwise ?? Action.TAKE_EXPERT, { sourceAction: cardAction.action })
        }
        break
      }
      default:
        this.resolveAction(cardAction.action, {})
    }
  }

  private resolveAction(action : Action, source : StepSource) : void {
    if (action == Action.TAKE_UPGRADE) {
      // fully automated, no step
      if (!this.pending) {
        this.botState.takeUpgrade()
      }
      return
    }
    const step : BotActionStep = { action, ...source, status: BotActionStatus.UPCOMING }
    this._steps.push(step)
    if (this.pending) {
      return
    }
    switch (action) {
      case Action.EXPLORE_LANDSCAPE:
        if (this.botState.explorersLeft > 0) {
          this.botState.placeExplorerLandscape()
          step.status = BotActionStatus.TODO
        }
        else {
          this.notPossible(step, NotPossibleReason.NO_EXPLORER)
        }
        break
      case Action.PLACE_EXPLORER_LANDSCAPE:
        this.resolveExplorerAction(step, () => this.botState.placeExplorerLandscape())
        break
      case Action.PLACE_EXPLORER_EXPERT_ACTION_TILE:
        this.resolveExplorerAction(step, () => this.botState.placeExplorerExpertActionTile())
        break
      case Action.BUILD_STATION:
        step.stationSiteValue = this.botState.stationSiteValue
        if (this.botState.stationsLeft > 0) {
          this.decide(step, () => this.botState.buildStation())
        }
        else {
          this.notPossible(step, NotPossibleReason.NO_STATION)
        }
        break
      case Action.TAKE_ENGINEER:
      case Action.TAKE_INVESTOR:
      case Action.TAKE_RADIO_OPERATOR:
        this.resolveTakeColumnExpert(step, TAKE_COLUMN_EXPERT[action] ?? ExpertType.MISSION_COORDINATOR)
        break
      case Action.TAKE_EXPERT:
        this.resolveTakeExpert(step)
        break
      default:
        throw new Error(`Invalid action: ${action}`)
    }
  }

  private resolveExplorerAction(step : BotActionStep, placeExplorer : () => void) : void {
    if (this.botState.explorersLeft > 0) {
      this.decide(step, placeExplorer)
    }
    else {
      this.notPossible(step, NotPossibleReason.NO_EXPLORER)
    }
  }

  /**
   * Take the left-most Expert of the given type, or a Mission Coordinator instead (placed in the column of the type).
   */
  private resolveTakeColumnExpert(step : BotActionStep, expertType : ExpertType) : void {
    const column = BotState.getExpertColumn(expertType) ?? ExpertColumn.INVESTOR
    step.expertColumn = column
    if (this.botState.isColumnFull(column)) {
      this.notPossible(step, NotPossibleReason.COLUMN_FULL)
      return
    }
    this.decide(step, decision => {
      const takenType = decision.expertType == ExpertType.MISSION_COORDINATOR ? ExpertType.MISSION_COORDINATOR : expertType
      step.expertType = takenType
      this.botState.addExpert(column, takenType)
      return true
    })
  }

  /**
   * Take the upper-most available Expert from the left: own column, Pilots and Mechanics in the column with the most Experts.
   */
  private resolveTakeExpert(step : BotActionStep) : void {
    step.pilotMechanicColumns = this.botState.columnsWithMostExperts
    this.decide(step, decision => {
      const expertType = decision.expertType ?? ExpertType.MISSION_COORDINATOR
      const column = BotState.getExpertColumn(expertType)
          ?? this.getPilotMechanicColumn(decision.expertColumn, step.pilotMechanicColumns ?? [])
      step.expertType = expertType
      step.expertColumn = column
      if (this.botState.isColumnFull(column)) {
        step.notPossibleReason = NotPossibleReason.COLUMN_FULL
        return false
      }
      this.botState.addExpert(column, expertType)
      return true
    })
  }

  private getPilotMechanicColumn(chosenColumn : ExpertColumn|undefined, candidates : readonly ExpertColumn[]) : ExpertColumn {
    if (chosenColumn && candidates.includes(chosenColumn)) {
      return chosenColumn
    }
    return candidates[0] ?? ExpertColumn.INVESTOR
  }

  /**
   * Resolve step with the next player decision, or mark it as pending if there is none.
   * @param step Step
   * @param apply Applies the executed action, returns false if it turns out to be not possible
   */
  private decide(step : BotActionStep, apply : (decision : BotActionDecision) => boolean|void) : void {
    step.decisionIndex = this._decisionCount
    const decision = this.decisions[this._decisionCount]
    if (!decision) {
      step.status = BotActionStatus.PENDING
      this.pending = true
      return
    }
    this._decisionCount++
    if (decision.executed && apply(decision) !== false) {
      step.status = BotActionStatus.EXECUTED
    }
    else {
      this.notPossible(step, step.notPossibleReason)
    }
  }

  private notPossible(step : BotActionStep, reason? : NotPossibleReason) : void {
    step.status = BotActionStatus.NOT_POSSIBLE
    step.notPossibleReason = reason
    this.addRondelEffects(this.botState.moveRondel(1))
  }

  /**
   * Rondel effects are applied by BotState; only drawing Cards needs the player.
   */
  private addRondelEffects(effects : RondelEffect[]) : void {
    effects
      .filter(effect => effect.action == RondelAction.DRAW_CARDS)
      .forEach(effect => this._steps.push({
        action: RondelAction.DRAW_CARDS,
        status: BotActionStatus.TODO,
        cardCount: effect.amount
      }))
  }

}

interface StepSource {
  sourceAction?: Action
  milestoneCard?: MilestoneCard
}

/**
 * Step of Arka's turn, shown as an action tile.
 */
export interface BotActionStep extends StepSource {
  /** Action of the tile: card action or Rondel action */
  action: Action|RondelAction
  status: BotActionStatus
  /** Index of the player decision for this step */
  decisionIndex?: number
  notPossibleReason?: NotPossibleReason
  /** Draw Cards: number of Cards */
  cardCount?: number
  /** Build a Station: value of the Station Site (Engineer icons +1) */
  stationSiteValue?: number
  /** Expert taken */
  expertType?: ExpertType
  /** Column of the Expert taken */
  expertColumn?: ExpertColumn
  /** Take an Expert: columns with the most Experts, for a Pilot or Mechanic */
  pilotMechanicColumns?: ExpertColumn[]
}
