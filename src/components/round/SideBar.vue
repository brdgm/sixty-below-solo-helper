<template>
  <div class="sidebar">
    {{t('sideBar.round', {round})}}
    <hr/>
    <div class="played-cards">
      <ActionCardStarMarker v-for="card in playedCards" :key="card.id" :card="card"/>
    </div>

    <div v-for="(row, rowIndex) in valueRows" :key="rowIndex" class="values" :class="{'mt-2': rowIndex == 0}">
      <div v-for="item in row" :key="item.name" :title="t(`sideBar.${item.name}`)">
        <AppIcon :type="item.iconType" :name="item.icon" class="icon"/>
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

    <template v-if="milestones.length > 0">
      <hr/>
      <div v-for="milestone in milestones" :key="milestone.round" class="milestone" :class="{scored: milestone.victoryPoints != undefined}">
        <div class="milestone-round">
          <div>
          {{milestone.round}}
          </div>
          <div v-if="milestone.victoryPoints != undefined" class="milestone-vp">
            {{t('sideBar.milestoneScored', {vp:milestone.victoryPoints})}}
          </div>
        </div>
        <div class="milestone-card">
          <ArkaMilestoneCard :milestoneCard="milestone.milestoneCard" compact/>
        </div>
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
import ArkaMilestoneCard from '@/components/structure/ArkaMilestoneCard.vue'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import { MILESTONE_ROUNDS } from '@/util/getMilestoneIndex'

export default defineComponent({
  name: 'SideBar',
  components: {
    AppIcon,
    ActionCardStarMarker,
    ArkaMilestoneCard
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
    botState() : BotState {
      return this.navigationState.botState
    },
    playedCards() : readonly Card[] {
      return this.navigationState.cardDeck.played
    },
    valueRows() : SideBarValue[][] {
      return [
        [
          { name: 'expeditionSteps', iconType: 'misc', icon: 'expedition-track', value: this.botState.expeditionSteps },
          { name: 'explorersLeft', iconType: 'misc', icon: 'explorer', value: this.botState.explorersLeft },
          { name: 'starLimit', iconType: 'card', icon: 'star', value: this.botState.starLimit }
        ],
        [
          { name: 'cardsDrawn', iconType: 'misc', icon: 'card', value: this.botState.cardsDrawn },
          { name: 'stationsLeft', iconType: 'misc', icon: 'station', value: this.botState.stationsLeft },
          { name: 'upgrades', iconType: 'misc', icon: 'upgrade', value: this.botState.upgrades }
        ]
      ]
    },
    expertColumns() : SideBarExpertColumn[] {
      return getAllEnumValues(ExpertColumn).map(column => ({
        column,
        // printed Expert at the bottom, the Experts taken by Arka above it
        experts: [BotState.getColumnExpertType(column), ...this.botState.getExperts(column)]
      }))
    },
    milestones() : SideBarMilestone[] {
      return this.navigationState.arkaMilestoneCards.map((milestoneCard, milestoneIndex) => ({
        milestoneCard,
        round: MILESTONE_ROUNDS[milestoneIndex] ?? 0,
        victoryPoints: this.navigationState.scoredMilestones
            .find(scored => scored.milestoneIndex == milestoneIndex)?.victoryPoints
      }))
    }
  }
})

interface SideBarValue {
  name: string
  iconType: string
  icon: string
  value: number
}
interface SideBarExpertColumn {
  column: ExpertColumn
  experts: ExpertType[]
}
interface SideBarMilestone {
  milestoneCard: MilestoneCard
  round: number
  /** Victory points, if already scored */
  victoryPoints?: number
}
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 180px;
  margin-left: 15px;
  margin-bottom: 10px;
  margin-right: -12px;
  padding: 15px 10px 15px 15px;
  background-color: #ddd;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  @media (max-width: 600px) {
    width: 165px;
  }
}
.played-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-bottom: 0.25rem;
}
.values {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.25rem;
  .icon {
    height: 1.5rem;
    width: 1.5rem;
    object-fit: contain;
  }
}
.milestone {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.3rem;
  .milestone-round {
    width: 0.8rem;
    flex-shrink: 0;
    font-weight: bold;
  }
  .milestone-vp {
    font-size: 0.7rem;
    font-weight: normal;
    rotate: -90deg;
    white-space: nowrap;
    margin-top: 1rem;
  }
  .milestone-card {
    flex: 1;
    min-width: 0;
  }
  &.scored .milestone-card {
    opacity: 0.5;
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
    margin-bottom: -0.5rem;
    z-index: 10;
    filter: drop-shadow(0 0 0.2rem rgba(0, 0, 0, 0.5));
    &.printed {
      opacity: 0.6;
      margin-bottom: 0rem;
    }
  }
}
</style>
