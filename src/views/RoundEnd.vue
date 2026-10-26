<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundEnd.title', {round})}}</h1>

  <p class="mt-4" v-html="t('roundEnd.discardCards')"></p>

  <p v-if="isMilestoneRound" class="mt-4" v-html="t('roundEnd.scoreMilestone')"></p>
  <output v-if="isForecastRound" class="alert alert-warning notice mt-4 d-block" v-html="t('roundEnd.gainForecastTile')"></output>

  <template v-if="milestoneCard && milestoneIndex != undefined">
    <ArkaMilestoneScoring :milestoneCard="milestoneCard" :milestoneIndex="milestoneIndex" :botState="botState"/>
    <p class="mt-3 fw-bold" v-html="t('roundEnd.arkaOverfulfills')"></p>
    <button type="button" class="btn btn-success btn-lg me-2" @click="milestoneScored(true)">
      {{t('roundEnd.overfulfilled', {vp:higherVP})}}
    </button>
    <button type="button" class="btn btn-danger btn-lg" @click="milestoneScored(false)">
      {{t('roundEnd.notOverfulfilled', {vp:lowerVP})}}
    </button>
  </template>
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
import { useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import ArkaMilestoneScoring from '@/components/round/ArkaMilestoneScoring.vue'
import NavigationState from '@/util/NavigationState'
import RouteCalculator from '@/services/RouteCalculator'
import MilestoneCard from '@/services/MilestoneCard'
import getMilestoneIndex, { MAX_ROUND } from '@/util/getMilestoneIndex'
import getMilestoneVP from '@/util/getMilestoneVP'

/** At the end of this round, every player gains one Forecast Tile */
const FORECAST_ROUND = 5

export default defineComponent({
  name: 'RoundEnd',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo,
    ArkaMilestoneScoring
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
    milestoneIndex() : number|undefined {
      return getMilestoneIndex(this.round)
    },
    isMilestoneRound() : boolean {
      return this.milestoneIndex != undefined
    },
    milestoneCard() : MilestoneCard|undefined {
      // the next Milestone Card not scored yet is the one scored at the end of this round
      return this.isMilestoneRound ? this.navigationState.milestoneCards[0] : undefined
    },
    lowerVP() : number {
      return getMilestoneVP(this.milestoneIndex ?? 0, false)
    },
    higherVP() : number {
      return getMilestoneVP(this.milestoneIndex ?? 0, true)
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
    milestoneScored(overfulfilled : boolean) : void {
      this.state.storeMilestoneOverfulfilled(this.round, overfulfilled)
      this.next()
    },
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
.notice {
  max-width: 40rem;
}
</style>
