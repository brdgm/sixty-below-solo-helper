<template>
  <div class="mt-4" v-if="state.setup.debugMode">
    <hr/>
    <p class="debug">
      <b>round</b>: {{navigationState.round}},
      <b>turn</b>: {{navigationState.turn}},
      <b>player</b>: {{navigationState.player}},
      <b>startPlayer</b>: {{navigationState.startPlayer}},
      <b>botPass</b>: {{navigationState.botPass}}<br/>
      <b>cardDeck</b>:
        <b>pile</b>: {{cardIds(cardDeck.pile)}},
        <b>played</b>: {{cardIds(cardDeck.played)}},
        <b>discard</b>: {{cardIds(cardDeck.discard)}}<br/>
      <b>botState</b>:
        <b>rondelPosition</b>: {{botState.rondelPosition}},
        <b>expeditionSteps</b>: {{botState.expeditionSteps}},
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
import Card from '@/services/Card'

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
  },
  methods: {
    cardIds(cards : readonly Card[]) : string {
      return cards.map(card => card.id).join(',')
    }
  }
})
</script>

<style lang="scss" scoped>
.debug {
  font-size: small;
}
</style>
