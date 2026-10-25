<template>
  <h1>{{t('setup.title')}}</h1>

  <DifficultyLevel/>

  <button type="button" class="btn btn-primary btn-lg mt-4" @click="setupBot()">
    {{t('setupBot.title')}}
  </button>

  <FooterButtons endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import DifficultyLevel from '@/components/setup/DifficultyLevel.vue'
import getRandomArkaMilestoneCards from '@/util/getRandomArkaMilestoneCards'

export default defineComponent({
  name: 'SetupGame',
  components: {
    FooterButtons,
    DifficultyLevel
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()
    return { t, state, router }
  },
  methods: {
    setupBot() : void {
      this.state.resetGame()
      this.state.setup.arkaMilestoneCards = getRandomArkaMilestoneCards()
      this.router.push('/setupBot')
    }
  }
})
</script>
