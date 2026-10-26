<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundTurnBot.title')}}</h1>

  <template v-if="botPass">
    <p class="mt-4" v-html="t('roundTurnBot.pass', {count:botState.starLimit})"></p>
  </template>
  <template v-else-if="screen">
    <div class="mt-4" v-if="screen.step">
      <BotAction :step="screen.step"/>
    </div>
    <p v-else-if="screen.notices.length == 0" class="mt-4" v-html="t('roundTurnBot.nothingToDo')"></p>
    <div :class="{'mt-4': !screen.step}">
      <BotActionNotices :notices="screen.notices"/>
    </div>
  </template>

  <BotActionDecision v-if="pendingStep" :step="pendingStep" @decide="decide"/>
  <button v-else type="button" class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BotActionDecision as BotActionDecisionData, useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import BotAction from '@/components/round/BotAction.vue'
import BotActionDecision from '@/components/round/BotActionDecision.vue'
import BotActionNotices from '@/components/round/BotActionNotices.vue'
import NavigationState from '@/util/NavigationState'
import RouteCalculator from '@/services/RouteCalculator'
import BotActions, { BotActionScreen, BotActionStep } from '@/services/BotActions'
import BotActionStatus from '@/services/enum/BotActionStatus'
import Player from '@/services/enum/Player'

export default defineComponent({
  name: 'RoundTurnBot',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo,
    BotAction,
    BotActionDecision,
    BotActionNotices
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn, action, botPass, botState, botActions } = navigationState
    const routeCalculator = new RouteCalculator({round, turn, player:Player.BOT, action})

    return { t, router, state, navigationState, routeCalculator, round, turn, action, botPass, botState, botActions }
  },
  computed: {
    screen() : BotActionScreen|undefined {
      return this.navigationState.botActionScreen
    },
    pendingStep() : BotActionStep|undefined {
      const step = this.screen?.step
      return step?.status == BotActionStatus.PENDING ? step : undefined
    },
    backButtonRouteTo() : string {
      return this.routeCalculator.getBackRouteTo(this.state)
    }
  },
  methods: {
    decide(decision : BotActionDecisionData) : void {
      const decisions = [...this.navigationState.botActionDecisions, decision]
      this.storeTurnAndNavigate(this.navigationState.getBotActions(decisions), decisions)
    },
    next() : void {
      this.storeTurnAndNavigate(this.botActions, [...this.navigationState.botActionDecisions])
    },
    /**
     * Store the turn and show the next screen of Arka's turn, or continue with the next turn.
     * The turn remembers the screen on which it was completed, so "Back" from the next turn returns to it (state before its decision).
     */
    storeTurnAndNavigate(botActions : BotActions|undefined, decisions : BotActionDecisionData[]) : void {
      const hasNextScreen = (botActions?.screens.length ?? 0) > this.action + 1
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.BOT,
        pass: this.botPass ? true : undefined,
        botPersistence: {
          cardDeck: this.navigationState.cardDeck.toPersistence(),
          botState: (botActions?.botState ?? this.botState).toPersistence()
        },
        botActionDecisions: decisions.length > 0 ? decisions : undefined,
        botActionLastStep: !hasNextScreen && this.action > 0 ? this.action : undefined
      })
      if (hasNextScreen) {
        this.router.push(this.routeCalculator.getBotActionRouteTo(this.action + 1))
      }
      else {
        this.router.push(this.routeCalculator.getNextRouteTo(this.state))
      }
    }
  }
})
</script>
