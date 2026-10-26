<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundTurnBot.title')}}</h1>

  <template v-if="botPass">
    <p class="mt-4" v-html="t('roundTurnBot.pass', {count:botState.starLimit})"></p>
  </template>
  <template v-else-if="botActions">
    <div class="action-tiles mt-4" v-if="botActions.steps.length > 0">
      <BotAction v-for="(step, index) in botActions.steps" :key="index" :step="step"/>
    </div>
    <p v-else class="mt-4" v-html="t('roundTurnBot.nothingToDo')"></p>
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
import NavigationState from '@/util/NavigationState'
import RouteCalculator from '@/services/RouteCalculator'
import BotActions, { BotActionStep } from '@/services/BotActions'
import Player from '@/services/enum/Player'

export default defineComponent({
  name: 'RoundTurnBot',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo,
    BotAction,
    BotActionDecision
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn, action, botPass, botState, botActions } = navigationState
    const routeCalculator = new RouteCalculator({round, turn, player:Player.BOT, action})

    return { t, router, state, navigationState, routeCalculator, round, turn, botPass, botState, botActions }
  },
  computed: {
    pendingStep() : BotActionStep|undefined {
      return this.botActions?.pendingStep
    },
    backButtonRouteTo() : string {
      return this.routeCalculator.getBackRouteTo(this.state)
    }
  },
  methods: {
    decide(decision : BotActionDecisionData) : void {
      const decisions = [...this.navigationState.botActionDecisions, decision]
      const botActions = this.navigationState.getBotActions(decisions)
      this.storeTurn(botActions, decisions)
      if (botActions.pendingStep || botActions.hasStepsAfterDecision(decisions.length - 1)) {
        this.router.push(this.routeCalculator.getBotActionRouteTo(decisions.length))
      }
      else {
        this.router.push(this.routeCalculator.getNextRouteTo(this.state))
      }
    },
    next() : void {
      this.storeTurn(this.botActions, [...this.navigationState.botActionDecisions])
      this.router.push(this.routeCalculator.getNextRouteTo(this.state))
    },
    storeTurn(botActions : BotActions|undefined, decisions : BotActionDecisionData[]) : void {
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.BOT,
        pass: this.botPass ? true : undefined,
        botPersistence: {
          cardDeck: this.navigationState.cardDeck.toPersistence(),
          botState: (botActions?.botState ?? this.botState).toPersistence()
        },
        botActionDecisions: decisions.length > 0 ? decisions : undefined
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.action-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
