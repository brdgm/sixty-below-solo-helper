<template>
  <div class="sidebar">
    {{t('sideBar.round', {round})}}<br/>
    <template v-if="turn > 0">{{t('sideBar.turn', {turn})}}<br/></template>
    <hr/>
    <h6>{{t('player.bot')}}</h6>
    <div class="played-cards">
      <ActionCardStarMarker v-for="card in playedCards" :key="card.id" :card="card"/>
    </div>
    <span v-html="t('sideBar.starsPlayed', {played:starsPlayed, limit:botState.starLimit})"></span>

    <div class="values mt-2">
      <div v-for="item in values" :key="item.name" :title="t(`sideBar.${item.name}`)">
        <AppIcon type="misc" :name="item.icon" class="icon"/>
        <span class="visually-hidden">{{t(`sideBar.${item.name}`)}}</span>
        {{item.value}}
      </div>
    </div>

    <div class="experts mt-2" :title="t('sideBar.experts')">
      <span class="visually-hidden">{{t('sideBar.experts')}}</span>
      <div v-for="column in expertColumns" :key="column.column" class="column">
        <AppIcon v-for="(expertType, index) in column.experts" :key="index" type="expert" :name="expertType"
            class="expert" :class="{printed: index == 0}"/>
      </div>
    </div>

    <template v-if="scoredMilestones.length > 0 || nextMilestoneCard">
      <hr/>
      <div class="milestone">
        <div v-for="scoredMilestone in scoredMilestones" :key="scoredMilestone.milestoneIndex" class="small">
          {{t('sideBar.milestoneScored', {tile:tileNames[scoredMilestone.milestoneIndex], vp:scoredMilestone.victoryPoints})}}
        </div>
        <template v-if="nextMilestoneCard">
          <div class="small">{{t('sideBar.nextMilestone', {round:nextMilestoneRound})}}</div>
          <div class="small fst-italic">{{t(`milestoneCondition.${nextMilestoneCard.overfulfill}`)}}</div>
          <AppIcon type="action" :name="nextMilestoneCard.specialAction" class="special-action"
              :title="t(`rules.action.${nextMilestoneCard.specialAction}.title`)"/>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationState from '@/util/NavigationState'
import Card from '@/services/Card'
import BotState from '@/services/BotState'
import MilestoneCard from '@/services/MilestoneCard'
import ExpertColumn from '@/services/enum/ExpertColumn'
import ExpertType from '@/services/enum/ExpertType'
import AppIcon from '@/components/structure/AppIcon.vue'
import ActionCardStarMarker from '@/components/structure/ActionCardStarMarker.vue'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import getNextMilestoneIndex from '@/util/getNextMilestoneIndex'
import { MILESTONE_ROUNDS } from '@/util/getMilestoneIndex'
import { MILESTONE_TILE_NAMES } from '@/util/getMilestoneVP'
import { ScoredMilestone } from '@/util/getScoredMilestones'

export default defineComponent({
  name: 'SideBar',
  components: {
    AppIcon,
    ActionCardStarMarker
  },
  setup() {
    const { t } = useI18n()
    return { t, tileNames: MILESTONE_TILE_NAMES }
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
    botState() : BotState {
      return this.navigationState.botState
    },
    playedCards() : readonly Card[] {
      return this.navigationState.cardDeck.played
    },
    starsPlayed() : number {
      return this.navigationState.cardDeck.starsPlayed
    },
    values() : SideBarValue[] {
      return [
        { name: 'expeditionSteps', icon: 'expedition-track', value: this.botState.expeditionSteps },
        { name: 'upgrades', icon: 'upgrade', value: this.botState.upgrades },
        { name: 'cardsDrawn', icon: 'card', value: this.botState.cardsDrawn },
        { name: 'explorersLeft', icon: 'explorer', value: this.botState.explorersLeft },
        { name: 'stationsLeft', icon: 'station', value: this.botState.stationsLeft }
      ]
    },
    expertColumns() : SideBarExpertColumn[] {
      return getAllEnumValues(ExpertColumn).map(column => ({
        column,
        // printed Expert at the bottom, the Experts taken by Arka above it
        experts: [BotState.getColumnExpertType(column), ...this.botState.getExperts(column)]
      }))
    },
    nextMilestoneCard() : MilestoneCard|undefined {
      return this.navigationState.milestoneCards[0]
    },
    scoredMilestones() : readonly ScoredMilestone[] {
      return this.navigationState.scoredMilestones
    },
    nextMilestoneRound() : number|undefined {
      return MILESTONE_ROUNDS[getNextMilestoneIndex(this.round)]
    }
  }
})

interface SideBarValue {
  name: string
  icon: string
  value: number
}
interface SideBarExpertColumn {
  column: ExpertColumn
  experts: ExpertType[]
}
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
.values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
  .icon {
    height: 1.5rem;
    width: 1.5rem;
    object-fit: contain;
  }
}
.experts {
  display: flex;
  gap: 0.25rem;
  .column {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.1rem;
  }
  .expert {
    width: 1.6rem;
    height: 1.6rem;
    object-fit: contain;
    &.printed {
      opacity: 0.6;
    }
  }
}
.milestone {
  .special-action {
    height: 2rem;
    margin-top: 0.25rem;
    border-radius: 0.25rem;
  }
}
</style>
