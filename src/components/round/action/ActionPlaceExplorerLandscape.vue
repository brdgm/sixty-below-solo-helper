<template>
  <ActionBox :step="step" :instructionTitle="t('rules.action.place-explorer-landscape.title')">
    <template #action>
      <AppIcon type="action" name="place-explorer-landscape" class="icon"/>
    </template>
    <template #instruction>
      <p v-html="t('rules.action.place-explorer-landscape.text')"></p>
    </template>
  </ActionBox>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionBox from '../ActionBox.vue'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionStep } from '@/services/BotActions'

export default defineComponent({
  name: 'ActionPlaceExplorerLandscape',
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
