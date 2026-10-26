<template>
  <span class="action-card" :title="label">
    <AppIcon type="card" :name="card.star ? 'star' : 'minus'" class="badge-icon"/>
    <span class="visually-hidden">{{label}}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/structure/AppIcon.vue'
import Card from '@/services/Card'

/**
 * Small Action Card symbol in the colors of Arka's Action Cards, showing the star marking of the card.
 */
export default defineComponent({
  name: 'ActionCardStarMarker',
  components: {
    AppIcon
  },
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
// colors of Arka's Action Cards: icy top, dark body, star/minus badge at the bottom
.action-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.85rem;
  border: 1px solid #555;
  border-radius: 3px;
  background: #2f2c2c;
  .badge-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
