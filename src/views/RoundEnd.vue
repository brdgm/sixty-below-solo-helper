<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundEnd.title', {round})}}</h1>

  <ul class="instructions mt-4">
    <!-- TODO: Arka's Milestone scoring in step 7 (milestones and end of game) -->
    <li v-if="isMilestoneRound" v-html="t('roundEnd.scoreMilestone')"></li>
    <li v-if="isForecastRound" v-html="t('roundEnd.gainForecastTile')"></li>
    <li v-if="!isLastRound" v-html="t('roundEnd.moveRoundIndicator')"></li>
  </ul>

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
import NavigationState from '@/util/NavigationState'
import RouteCalculator from '@/services/RouteCalculator'
import getMilestoneIndex, { MAX_ROUND } from '@/util/getMilestoneIndex'

/** At the end of this round, every player gains one Forecast Tile */
const FORECAST_ROUND = 5

export default defineComponent({
  name: 'RoundEnd',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, cardDeck, botState } = navigationState
    const routeCalculator = new RouteCalculator({round})

    return { t, router, state, navigationState, routeCalculator, round, cardDeck, botState }
  },
  computed: {
    isMilestoneRound() : boolean {
      return getMilestoneIndex(this.round) != undefined
    },
    isForecastRound() : boolean {
      return this.round == FORECAST_ROUND
    },
    isLastRound() : boolean {
      return this.round >= MAX_ROUND
    },
    backButtonRouteTo() : string {
      return this.routeCalculator.getLastTurnRouteTo(this.state)
    }
  },
  methods: {
    next() : void {
      if (!this.isLastRound) {
        this.cardDeck.endRound()
        this.state.storeRound({
          round: this.round + 1,
          initialBotPersistence: {
            cardDeck: this.cardDeck.toPersistence(),
            botState: this.botState.toPersistence()
          },
          turns: []
        })
      }
      this.router.push(this.routeCalculator.getNextRoundRouteTo())
    }
  }
})
</script>

<style lang="scss" scoped>
.instructions {
  max-width: 1000px;
  & > li {
    margin-top: 0.5rem;
  }
}
</style>
