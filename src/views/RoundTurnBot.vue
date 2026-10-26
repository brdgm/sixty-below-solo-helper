<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundTurnBot.title')}}</h1>

  <template v-if="botPass">
    <p class="mt-4" v-html="t('roundTurnBot.pass', {count:botState.starLimit})"></p>
  </template>
  <template v-else-if="currentCard">
    <p class="mt-4" v-html="t('roundTurnBot.revealActionCard')"></p>
    <!-- TODO: carry out the actions step by step in step 6 (Arka's actions) -->
    <ActionCardOverview :card="currentCard"/>
  </template>

  <button type="button" class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import ActionCardOverview from '@/components/round/ActionCardOverview.vue'
import NavigationState from '@/util/NavigationState'
import RouteCalculator from '@/services/RouteCalculator'
import Player from '@/services/enum/Player'
import Card from '@/services/Card'

export default defineComponent({
  name: 'RoundTurnBot',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo,
    ActionCardOverview
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn, botPass, cardDeck, botState } = navigationState
    const routeCalculator = new RouteCalculator({round, turn, player:Player.BOT})

    return { t, router, state, navigationState, routeCalculator, round, turn, botPass, cardDeck, botState }
  },
  computed: {
    currentCard() : Card|undefined {
      return this.cardDeck.currentCard
    },
    backButtonRouteTo() : string {
      return this.routeCalculator.getBackRouteTo(this.state)
    }
  },
  methods: {
    next() : void {
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.BOT,
        pass: this.botPass ? true : undefined,
        botPersistence: {
          cardDeck: this.cardDeck.toPersistence(),
          botState: this.botState.toPersistence()
        }
      })
      this.router.push(this.routeCalculator.getNextRouteTo(this.state))
    }
  }
})
</script>
