<template>
  <h1>{{t('gameEnd.title')}}</h1>

  <FinalScoring :navigationState="navigationState"/>

  <p class="mt-3" v-html="t('gameEnd.difficultyLevel', {level:state.setup.difficultyLevel, mode:t(`difficultyMode.${difficultyMode}`)})"></p>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="endGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import FinalScoring from '@/components/scoring/FinalScoring.vue'
import NavigationState from '@/util/NavigationState'
import DifficultyMode from '@/services/enum/DifficultyMode'
import getDifficultyLevelSettings from '@/util/getDifficultyLevelSettings'
import { MAX_ROUND } from '@/util/getMilestoneIndex'

export default defineComponent({
  name: 'GameEnd',
  components: {
    FooterButtons,
    DebugInfo,
    FinalScoring
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)

    return { t, state, navigationState }
  },
  computed: {
    difficultyMode() : DifficultyMode {
      return getDifficultyLevelSettings(this.state.setup.difficultyLevel).mode
    },
    backButtonRouteTo() : string {
      return `/round/${MAX_ROUND}/end`
    }
  }
})
</script>
