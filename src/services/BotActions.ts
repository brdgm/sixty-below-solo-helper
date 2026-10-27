import { BotActionDecision, BotStatePersistence } from '@/store/state'
import BotState, { RondelEffect } from './BotState'
import Card, { CardAction } from './Card'
import MilestoneCard from './MilestoneCard'
import Action from './enum/Action'
import BotActionNoticeType from './enum/BotActionNoticeType'
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
 * Resolves Arka's Action Card into screens, each with one action the player carries out:
 * Rondel move first, then the card actions from top to bottom.
 * Everything that can be derived from Arka's state is decided and applied by the app (branches, Milestone special actions,
 * Rondel effects, Upgrades, Explorers/Stations/Expert columns). Fully automated effects get no screen; the important ones
 * (Upgrade, Expedition Level, action not possible) are shown as notices on the following screen.
 * Steps that need the board are resolved with the player's decisions, in order; the first step without a decision is pending,
 * the resolution stops there.
 * "Not possible" moves the Rondel Explorer one step forward.
 * If Arka has played as many stars as her Expedition Level with this card, she passes after this turn - this is shown on
 * the last screen of the turn, so she needs no extra turn just for passing.
 */
export default class BotActions {

  readonly botState : BotState
  /** Arka passes after this turn: she has played as many stars as her Expedition Level (only set when all steps are resolved) */
  readonly pass : boolean
  private readonly _steps : BotActionStep[] = []
  private readonly _screens : BotActionScreen[] = []
  private readonly decisions : readonly BotActionDecision[]
  private readonly starsPlayed : number
  private _decisionCount = 0
  private pending = false
  private pendingNotices : BotActionNotice[] = []
  private lastCardStep? : BotActionStep

  /**
   * @param card Action Card
   * @param botState Arka's state before the card - is updated with all resolved actions
   * @param milestoneCards Arka's Milestone Cards that are not scored yet, in scoring order
   * @param decisions Player decisions for the steps that need the board, in order
   * @param starsPlayed Stars played this round, including this card
   */
  constructor(card : Card, botState : BotState, milestoneCards : readonly MilestoneCard[], decisions : readonly BotActionDecision[],
      starsPlayed : number) {
    this.botState = botState
    this.decisions = decisions
    this.starsPlayed = starsPlayed
    this.moveRondel(card.rondelSteps)
    for (const cardAction of card.actions) {
      this.resolveCardAction(cardAction, milestoneCards)
    }
    const lastScreen = this._screens.at(-1)
    if (this.pending) {
      this.pass = false
      if (lastScreen && this.isPassKnownBeforeDecision(lastScreen)) {
        lastScreen.pass = true
      }
      return
    }
    this.pass = this.starsPlayed >= this.botState.starLimit
    // a pass after the last decision is shown on the decision screen if it is already known there, otherwise on an extra final screen
    const passNotShownYet = this.pass && lastScreen?.step?.decisionIndex != undefined && !this.isPassKnownBeforeDecision(lastScreen)
    if (!lastScreen || this.pendingNotices.length > 0 || passNotShownYet) {
      // final screen for notices after the last action, Arka passing, or "nothing to do"
      this._screens.push({ notices: this.pendingNotices, botState: this.botState.toPersistence() })
    }
    const finalScreen = this._screens.at(-1)
    if (this.pass && finalScreen) {
      finalScreen.pass = true
    }
  }

  /**
   * All steps, incl. decided, automated and upcoming ones (for debugging).
   */
  public get steps() : readonly BotActionStep[] {
    return this._steps
  }

  /**
   * Screens shown to the player, one action each - up to the screen of the pending decision.
   */
  public get screens() : readonly BotActionScreen[] {
    return this._screens
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
   * Number of decisions made on the screens before the given screen.
   * @param screenIndex Screen index
   */
  public getDecisionCountBefore(screenIndex : number) : number {
    return this._screens.slice(0, screenIndex)
        .filter(screen => screen.step?.decisionIndex != undefined)
        .length
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
    const step : BotActionStep = { action, ...source, status: BotActionStatus.UPCOMING }
    this._steps.push(step)
    this.lastCardStep = step
    if (this.pending) {
      return
    }
    switch (action) {
      case Action.TAKE_UPGRADE:
        step.status = BotActionStatus.EXECUTED
        if (this.botState.takeUpgrade()) {
          this.pendingNotices.push({ type: BotActionNoticeType.UPGRADE })
        }
        break
      case Action.EXPLORE_LANDSCAPE:
        if (this.botState.explorersLeft > 0) {
          step.status = BotActionStatus.TODO
          this.addScreen(step)
          this.botState.placeExplorerLandscape()
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
   * Take the upper-most available Expert from the left: own column, Pilots and Mechanics in the column with the most Experts
   * that is not full yet (C21).
   */
  private resolveTakeExpert(step : BotActionStep) : void {
    step.pilotMechanicColumns = this.botState.columnsWithMostExperts
    this.decide(step, decision => {
      const expertType = decision.expertType ?? ExpertType.MISSION_COORDINATOR
      const column = BotState.getExpertColumn(expertType)
          ?? this.getPilotMechanicColumn(decision.expertColumn, step.pilotMechanicColumns ?? [])
      step.expertType = expertType
      step.expertColumn = column
      if (!column || this.botState.isColumnFull(column)) {
        step.notPossibleReason = NotPossibleReason.COLUMN_FULL
        return false
      }
      this.botState.addExpert(column, expertType)
      return true
    })
  }

  private getPilotMechanicColumn(chosenColumn : ExpertColumn|undefined, candidates : readonly ExpertColumn[]) : ExpertColumn|undefined {
    if (chosenColumn && candidates.includes(chosenColumn)) {
      return chosenColumn
    }
    return candidates[0]
  }

  /**
   * Show the step on its own screen and resolve it with the next player decision, or mark it as pending if there is none.
   * @param step Step
   * @param apply Applies the executed action, returns false if it turns out to be not possible
   */
  private decide(step : BotActionStep, apply : (decision : BotActionDecision) => boolean|void) : void {
    step.decisionIndex = this._decisionCount
    this.addScreen(step)
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
      step.status = BotActionStatus.NOT_POSSIBLE
      if (step.notPossibleReason) {
        this.pendingNotices.push({ type: BotActionNoticeType.NOT_POSSIBLE, action: step.action, reason: step.notPossibleReason })
      }
      this.moveRondel(1)
    }
  }

  /**
   * Action not possible as known by the app: no screen, only a notice.
   */
  private notPossible(step : BotActionStep, reason : NotPossibleReason) : void {
    step.status = BotActionStatus.NOT_POSSIBLE
    step.notPossibleReason = reason
    this.pendingNotices.push({ type: BotActionNoticeType.NOT_POSSIBLE, action: step.action, reason })
    this.moveRondel(1)
  }

  /**
   * Show the step on a screen, together with the notices of the automated effects before it.
   */
  private addScreen(step : BotActionStep) : void {
    this._screens.push({ step, notices: this.pendingNotices, botState: this.botState.toPersistence() })
    this.pendingNotices = []
  }

  /**
   * Move the Rondel Explorer. Rondel effects are applied by BotState; drawing Cards needs the player (screen),
   * Upgrades and a higher Expedition Level are noticed.
   */
  private moveRondel(steps : number) : void {
    const starLimit = this.botState.starLimit
    const effects = this.botState.moveRondel(steps)
    if (this.botState.starLimit > starLimit) {
      this.pendingNotices.push({ type: BotActionNoticeType.EXPEDITION_LEVEL, starLimit: this.botState.starLimit })
    }
    effects.forEach(effect => this.addRondelEffect(effect))
  }

  private addRondelEffect(effect : RondelEffect) : void {
    if (effect.action == RondelAction.UPGRADE && effect.amount > 0) {
      this.pendingNotices.push({ type: BotActionNoticeType.UPGRADE })
    }
    else if (effect.action == RondelAction.DRAW_CARDS) {
      const step : BotActionStep = { action: RondelAction.DRAW_CARDS, status: BotActionStatus.TODO, cardCount: effect.amount }
      this._steps.push(step)
      this.addScreen(step)
    }
  }

  /**
   * Checks if it is known on the screen of a player decision that Arka passes after it, whatever the player decides:
   * it is the last action of the card, Arka has played as many stars as her Expedition Level, and "Not possible"
   * (Rondel one step forward) would not raise her Expedition Level.
   * Other effects of the decision get an own screen and are covered there.
   */
  private isPassKnownBeforeDecision(screen : BotActionScreen) : boolean {
    if (screen.step?.decisionIndex == undefined || screen.step != this.lastCardStep) {
      return false
    }
    const botState = BotState.fromPersistence(screen.botState)
    const starLimit = botState.starLimit
    botState.moveRondel(1)
    return this.starsPlayed >= starLimit && botState.starLimit == starLimit
  }

}

interface StepSource {
  sourceAction?: Action
  milestoneCard?: MilestoneCard
}

/**
 * Step of Arka's turn.
 */
export interface BotActionStep extends StepSource {
  /** Action: card action or Rondel action */
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

/**
 * Screen of Arka's turn: one action tile (or none on the final screen) and the notices of the automated effects before it.
 */
export interface BotActionScreen {
  step?: BotActionStep
  notices: BotActionNotice[]
  /** Arka's state when the screen is shown (before its own action) */
  botState: BotStatePersistence
  /** Arka passes at the end of this turn: set on the last screen, or already on the decision screen if it is known there */
  pass?: boolean
}

export interface BotActionNotice {
  type: BotActionNoticeType
  /** Not possible: action */
  action?: Action|RondelAction
  /** Not possible: reason */
  reason?: NotPossibleReason
  /** Expedition Level: new star limit */
  starLimit?: number
}
