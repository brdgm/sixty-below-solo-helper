<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundStart.title', {round})}}</h1>

  <p class="mt-4" v-html="t(`roundStart.startPlayer.${startPlayer}`)"></p>

  <h5 class="mt-4">{{t('roundStart.preparation.title')}}</h5>
  <ul>
    <li v-html="t('roundStart.preparation.drawCards')"></li>
    <li v-html="t('roundStart.preparation.expeditionBonus')"></li>
  </ul>

  <h5>{{t('roundStart.planning.title')}}</h5>
  <ul>
    <li v-html="t('roundStart.planning.takeExplorers')"></li>
    <li v-html="t('roundStart.planning.drawCards')"></li>
  </ul>

  <p class="fst-italic" v-html="t('roundStart.arkaSkipsPhases')"></p>

  <div v-if="isMilestoneRound" class="alert alert-warning notice" role="status" v-html="t('roundStart.milestoneRound')"></div>

  <button type="button" class="btn btn-primary btn-lg mt-3" @click="next()">
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
import getMilestoneIndex from '@/util/getMilestoneIndex'

export default defineComponent({
  name: 'RoundStart',
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
    const { round, startPlayer } = navigationState
    const routeCalculator = new RouteCalculator({round})

    return { t, router, navigationState, routeCalculator, round, startPlayer }
  },
  computed: {
    isMilestoneRound() : boolean {
      return getMilestoneIndex(this.round) != undefined
    },
    backButtonRouteTo() : string {
      if (this.round > 1) {
        return `/round/${this.round - 1}/end`
      }
      return '/setupBot'
    }
  },
  methods: {
    next() : void {
      this.router.push(this.routeCalculator.getFirstTurnRouteTo())
    }
  }
})
</script>

<style lang="scss" scoped>
.notice {
  max-width: 40rem;
}
</style>
