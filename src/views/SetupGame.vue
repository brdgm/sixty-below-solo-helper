<template>
  <h1>{{t('setup.title')}}</h1>

  <p v-html="t('setup.placeholder')"></p>

  <button type="button" class="btn btn-primary btn-lg mt-4" disabled>
    {{t('setupBot.title')}}
  </button>

  <FooterButtons backButtonRouteTo="/" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'

export default defineComponent({
  name: 'SetupGame',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>
