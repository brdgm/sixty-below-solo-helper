<template>
  <span class="action-card" :class="{star: card.star}" role="img" :aria-label="label" :title="label">
    {{card.star ? '★' : '−'}}
  </span>
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
  line-height: 1.6rem;
  border: 1px solid #333;
  border-radius: 3px;
  text-align: center;
  font-size: 0.9rem;
  background-color: #6c757d;
  color: #fff;
  &.star {
    background-color: #2a5c8a;
    color: #ffd84a;
  }
}
</style>
