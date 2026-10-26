<template>
  <div class="sidebar">
    {{t('sideBar.round', {round})}}<br/>
    <template v-if="turn > 0">{{t('sideBar.turn', {turn})}}<br/></template>
    <hr/>
    <div class="arka">
      <h6>{{t('player.bot')}}</h6>
      <div class="played-cards">
        <ActionCardStarMarker v-for="card in playedCards" :key="card.id" :card="card"/>
      </div>
      <span v-html="t('sideBar.starsPlayed', {played:starsPlayed, limit:starLimit})"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationState from '@/util/NavigationState'
import Card from '@/services/Card'
import ActionCardStarMarker from '@/components/structure/ActionCardStarMarker.vue'

export default defineComponent({
  name: 'SideBar',
  components: {
    ActionCardStarMarker
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  computed: {
    round() : number {
      return this.navigationState.round
    },
    turn() : number {
      return this.navigationState.turn
    },
    playedCards() : readonly Card[] {
      return this.navigationState.cardDeck.played
    },
    starsPlayed() : number {
      return this.navigationState.cardDeck.starsPlayed
    },
    starLimit() : number {
      return this.navigationState.botState.starLimit
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 145px;
  margin-left: 15px;
  margin-bottom: 10px;
  margin-right: -12px;
  padding: 15px 10px 15px 15px;
  background-color: #ddd;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  @media (max-width: 600px) {
    font-size: 0.9rem;
    width: 120px;
  }
}
.played-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-bottom: 0.25rem;
}
</style>
