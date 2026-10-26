<template>
  <h4 class="mt-4">{{t('arkaMilestoneScoring.title')}}</h4>
  <div class="milestone">
    <ArkaMilestoneCard :milestoneCard="milestoneCard"/>
    <div>
      <p>
        <span v-html="t(`arkaMilestoneScoring.hint.${milestoneCard.overfulfill}`, {count:conditionValue})"></span><br/>
        <span v-html="t(`arkaMilestoneScoring.hintLine2.${milestoneCard.overfulfill}`)"></span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ArkaMilestoneCard from '@/components/structure/ArkaMilestoneCard.vue'
import MilestoneCard from '@/services/MilestoneCard'
import BotState from '@/services/BotState'
import getMilestoneVP, { MILESTONE_TILE_NAMES } from '@/util/getMilestoneVP'
import getMilestoneConditionValue from '@/util/getMilestoneConditionValue'

/**
 * Arka's Milestone scored at the end of the round: card, Milestone Tile values and Arka's tracked value as hint.
 */
export default defineComponent({
  name: 'ArkaMilestoneScoring',
  components: {
    ArkaMilestoneCard
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    milestoneCard: {
      type: Object as PropType<MilestoneCard>,
      required: true
    },
    milestoneIndex: {
      type: Number,
      required: true
    },
    botState: {
      type: Object as PropType<BotState>,
      required: true
    }
  },
  computed: {
    tileName() : string {
      return MILESTONE_TILE_NAMES[this.milestoneIndex] ?? ''
    },
    lowerVP() : number {
      return getMilestoneVP(this.milestoneIndex, false)
    },
    higherVP() : number {
      return getMilestoneVP(this.milestoneIndex, true)
    },
    conditionValue() : number {
      return getMilestoneConditionValue(this.milestoneCard.overfulfill, this.botState)
    }
  }
})
</script>

<style lang="scss" scoped>
.milestone {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
  max-width: 1000px;
  > div:last-child {
    flex: 1;
    min-width: 15rem;
  }
}
</style>
