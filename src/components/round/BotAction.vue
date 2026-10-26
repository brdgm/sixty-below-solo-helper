<template>
  <component :is="`action-${step.action}`" :step="step"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BotActionStep } from '@/services/BotActions'
import ActionBuildStation from './action/ActionBuildStation.vue'
import ActionTakeExpert from './action/ActionTakeExpert.vue'
import ActionTakeEngineer from './action/ActionTakeEngineer.vue'
import ActionTakeInvestor from './action/ActionTakeInvestor.vue'
import ActionTakeRadioOperator from './action/ActionTakeRadioOperator.vue'
import ActionExploreLandscape from './action/ActionExploreLandscape.vue'
import ActionPlaceExplorerLandscape from './action/ActionPlaceExplorerLandscape.vue'
import ActionPlaceExplorerExpertActionTile from './action/ActionPlaceExplorerExpertActionTile.vue'
import ActionDrawCards from './action/ActionDrawCards.vue'

/**
 * Shows the action tile for a step of Arka's turn.
 */
export default defineComponent({
  name: 'BotAction',
  components: {
    ActionBuildStation,
    ActionTakeExpert,
    ActionTakeEngineer,
    ActionTakeInvestor,
    ActionTakeRadioOperator,
    ActionExploreLandscape,
    ActionPlaceExplorerLandscape,
    ActionPlaceExplorerExpertActionTile,
    ActionDrawCards
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    }
  }
})
</script>
