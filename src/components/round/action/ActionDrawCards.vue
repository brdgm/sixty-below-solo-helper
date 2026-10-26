<template>
  <ActionBox :step="step" :instructionTitle="t('rules.rondel.draw-cards.title')">
    <template #action>
      <AppIcon type="rondel" name="draw-cards" class="icon"/>
    </template>
    <template #values>
      {{t('actionDrawCards.cards', {count:step.cardCount})}}
    </template>
    <template #instruction>
      <p v-html="t('rules.rondel.draw-cards.text')"></p>
    </template>
  </ActionBox>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionBox from '../ActionBox.vue'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionStep } from '@/services/BotActions'

/**
 * Rondel: the Rondel Explorer crossed "Draw Cards" - the player draws the Cards for Arka.
 */
export default defineComponent({
  name: 'ActionDrawCards',
  components: {
    ActionBox,
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    }
  }
})
</script>
