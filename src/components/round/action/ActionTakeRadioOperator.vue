<template>
  <ActionTakeColumnExpert :step="step" :action="action"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ActionTakeColumnExpert from './ActionTakeColumnExpert.vue'
import { BotActionStep } from '@/services/BotActions'
import Action from '@/services/enum/Action'

export default defineComponent({
  name: 'ActionTakeRadioOperator',
  components: {
    ActionTakeColumnExpert
  },
  setup() {
    return { action: Action.TAKE_RADIO_OPERATOR }
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    }
  }
})
</script>
