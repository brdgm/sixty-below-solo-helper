<template>
  <h1>{{t('gameEnd.title')}}</h1>

  <!-- TODO: final scoring in step 7 (milestones and end of game) -->

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="endGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { MAX_ROUND } from '@/util/getMilestoneIndex'

export default defineComponent({
  name: 'GameEnd',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  computed: {
    backButtonRouteTo() : string {
      return `/round/${MAX_ROUND}/end`
    }
  }
})
</script>
