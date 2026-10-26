<template>
  <div class="action-card-overview">
    <ActionCardStarMarker :card="card" class="marker"/>
    <ol class="actions">
      <li v-for="(cardAction, index) in card.actions" :key="index">
        {{t(`rules.action.${cardAction.action}.title`)}}
        <template v-if="cardAction.otherwise">
          <br/><i>{{t('actionCardOverview.otherwise', {action:t(`rules.action.${cardAction.otherwise}.title`)})}}</i>
        </template>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/services/Card'
import ActionCardStarMarker from '@/components/structure/ActionCardStarMarker.vue'

/**
 * Overview of the actions of Arka's Action Card: Rondel move first, then the card actions from top to bottom.
 */
export default defineComponent({
  name: 'ActionCardOverview',
  components: {
    ActionCardStarMarker
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
  }
})
</script>

<style lang="scss" scoped>
.action-card-overview {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  .marker {
    transform: scale(1.5);
    transform-origin: top left;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
  .actions {
    margin-bottom: 0;
    li {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
