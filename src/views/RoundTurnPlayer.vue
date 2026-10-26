<template>
  <SideBar :navigationState="navigationState"/>

  <h1>{{t('roundTurnPlayer.title')}}</h1>

  <p class="mt-4" v-html="t('roundTurnPlayer.execute')"></p>

  <button type="button" class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>
  <button type="button" class="btn btn-outline-danger btn-lg mt-4 ms-2" data-bs-toggle="modal" data-bs-target="#passModal">
    {{t('action.pass')}}
  </button>

  <ModalDialog id="passModal" :title="t('action.pass')">
    <template #body>
      <p v-html="t('roundTurnPlayer.passConfirm')"></p>
      <p v-html="t('roundTurnPlayer.passInfo')"></p>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="pass()" data-bs-dismiss="modal">{{t('action.pass')}}</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>

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
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import NavigationState from '@/util/NavigationState'
import RouteCalculator from '@/services/RouteCalculator'
import Player from '@/services/enum/Player'

export default defineComponent({
  name: 'RoundTurnPlayer',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo,
    ModalDialog
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn } = navigationState
    const routeCalculator = new RouteCalculator({round, turn, player:Player.PLAYER})

    return { t, router, state, navigationState, routeCalculator, round, turn }
  },
  computed: {
    backButtonRouteTo() : string {
      return this.routeCalculator.getBackRouteTo(this.state)
    }
  },
  methods: {
    next() : void {
      this.storeTurnAndNavigate(false)
    },
    pass() : void {
      this.storeTurnAndNavigate(true)
    },
    storeTurnAndNavigate(pass : boolean) : void {
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.PLAYER,
        pass: pass ? true : undefined
      })
      this.router.push(this.routeCalculator.getNextRouteTo(this.state))
    }
  }
})
</script>
