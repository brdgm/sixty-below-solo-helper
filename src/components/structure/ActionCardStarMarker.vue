<template>
  <svg class="action-card" :class="{star: card.star}" viewBox="0 0 18 26" :aria-label="label">
    <title>{{label}}</title>
    <rect x="0.5" y="0.5" width="17" height="25" rx="3" class="card"/>
    <text x="9" y="17.5" text-anchor="middle" class="marker">{{card.star ? '★' : '−'}}</text>
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/services/Card'

/**
 * Small Action Card symbol showing the star marking of the card.
 */
export default defineComponent({
  name: 'ActionCardStarMarker',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    card: {
      type: Object as PropType<Card>,
      required: true
    }
  },
  computed: {
    label() : string {
      return this.card.star ? this.t('actionCardStarMarker.star') : this.t('actionCardStarMarker.noStar')
    }
  }
})
</script>

<style lang="scss" scoped>
.action-card {
  display: inline-block;
  width: 1.1rem;
  height: 1.6rem;
  .card {
    fill: #6c757d;
    stroke: #333;
  }
  .marker {
    fill: #fff;
    font-size: 14px;
  }
  &.star {
    .card {
      fill: #2a5c8a;
    }
    .marker {
      fill: #ffd84a;
    }
  }
}
</style>
