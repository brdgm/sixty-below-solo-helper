<template>
  <ActionTakeColumnExpert :step="step" :action="action"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ActionTakeColumnExpert from './ActionTakeColumnExpert.vue'
import { BotActionStep } from '@/services/BotActions'
import Action from '@/services/enum/Action'

export default defineComponent({
  name: 'ActionTakeInvestor',
  components: {
    ActionTakeColumnExpert
  },
  setup() {
    return { action: Action.TAKE_INVESTOR }
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    }
  }
})
</script>
