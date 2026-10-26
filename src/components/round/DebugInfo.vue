<template>
  <div class="mt-4" v-if="state.setup.debugMode">
    <hr/>
    <p class="debug">
      <b>round</b>: {{navigationState.round}},
      <b>turn</b>: {{navigationState.turn}},
      <b>player</b>: {{navigationState.player}},
      <b>startPlayer</b>: {{navigationState.startPlayer}},
      <b>botPass</b>: {{navigationState.botPass}}<br/>
      <b>currentCard</b>: {{cardDeck.currentCard ?? '-'}}<br/>
      <b>botActionDecisions</b>: {{navigationState.botActionDecisions}}<br/>
      <b>botActionScreen</b>: {{navigationState.botActionScreen ?? '-'}}<br/>
      <b>botActions</b>: {{navigationState.botActions?.steps ?? '-'}}<br/>
      <b>milestoneCards</b>: {{navigationState.milestoneCards}}<br/>
      <b>cardDeck</b>: {{cardDeck.toPersistence()}}<br/>
      <b>botState</b>: {{botState.toPersistence()}},
        <b>expeditionPathPosition</b>: {{botState.expeditionPathPosition}},
        <b>starLimit</b>: {{botState.starLimit}}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import CardDeck from '@/services/CardDeck'
import BotState from '@/services/BotState'

export default defineComponent({
  name: 'DebugInfo',
  setup() {
    const state = useStateStore()
    return { state }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  computed: {
    cardDeck() : CardDeck {
      return this.navigationState.cardDeck
    },
    botState() : BotState {
      return this.navigationState.botState
    }
  }
})
</script>

<style lang="scss" scoped>
.debug {
  font-size: small;
}
</style>
