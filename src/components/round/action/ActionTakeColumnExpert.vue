<template>
  <ActionBox :step="step" :instructionTitle="t(`rules.action.${action}.title`)">
    <template #action>
      <AppIcon type="action" :name="action" class="icon"/>
    </template>
    <template #values v-if="step.expertType">
      <AppIcon type="expert" :name="step.expertType" class="value-icon"/>
    </template>
    <template #instruction>
      <p v-html="t(`rules.action.${action}.text`)"></p>
      <p v-html="t('rules.expertPlacement')"></p>
      <p v-html="t('rules.expertAvailability')"></p>
    </template>
  </ActionBox>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionBox from '../ActionBox.vue'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionStep } from '@/services/BotActions'
import Action from '@/services/enum/Action'

/**
 * Shared tile for "Take the left-most Engineer/Investor/Radio Operator" (if none is available, a Mission Coordinator).
 */
export default defineComponent({
  name: 'ActionTakeColumnExpert',
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
    },
    action: {
      type: String as PropType<Action>,
      required: true
    }
  }
})
</script>
