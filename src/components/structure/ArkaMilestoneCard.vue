<template>
  <div class="milestone-card">
    <div class="always-fulfilled">{{t('arkaMilestoneCard.alwaysFulfilled')}}</div>
    <div class="mt-2">
      <b>{{t('arkaMilestoneCard.overfulfill')}}</b><br/>
      {{t(`milestoneCondition.${milestoneCard.overfulfill}`)}}
    </div>
    <div class="mt-2">
      <b>{{t('arkaMilestoneCard.specialAction')}}</b><br/>
      {{t(`rules.action.${milestoneCard.specialAction}.title`)}}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import MilestoneCard from '@/services/MilestoneCard'

export default defineComponent({
  name: 'ArkaMilestoneCard',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    milestoneCard: {
      type: Object as PropType<MilestoneCard>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.milestone-card {
  width: 13rem;
  padding: 0.75rem;
  border: 1px solid #aaa;
  border-radius: 0.5rem;
  background-color: #f4f1ea;
  font-size: 0.9rem;
}
.always-fulfilled {
  font-style: italic;
  color: #555;
}
</style>
