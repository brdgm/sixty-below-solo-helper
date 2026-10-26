<template>
  <button type="button" class="milestone-card" :class="{compact}" :aria-label="specialActionTitle" @click="showRules">
    <span class="always-fulfilled" v-if="!compact">{{t('arkaMilestoneCard.alwaysFulfilled')}}</span>
    <span class="content">
      <span class="overfulfill">
        <span class="label" v-if="!compact">{{t('arkaMilestoneCard.overfulfill')}}</span>
        <span class="condition">{{t(`milestoneCondition.${milestoneCard.overfulfill}`)}}</span>
      </span>
      <span class="special-action">
        <span class="special-action-title">
          <AppIcon type="action" name="milestone-special-action" class="cog"/>
        </span>
        <AppIcon type="action" :name="milestoneCard.specialAction" class="action-icon"/>
      </span>
    </span>
  </button>

  <ModalDialog :id="modalId" :title="specialActionTitle">
    <template #body>
      <p v-html="t(`rules.action.${milestoneCard.specialAction}.text`)"></p>
      <p v-if="isTakeExpert" v-html="t('rules.expertAvailability')"></p>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import showModal from '@brdgm/brdgm-commons/src/util/modal/showModal'
import AppIcon from '@/components/structure/AppIcon.vue'
import MilestoneCard from '@/services/MilestoneCard'
import Action from '@/services/enum/Action'

const TAKE_EXPERT_ACTIONS = new Set<Action>([Action.TAKE_EXPERT, Action.TAKE_ENGINEER, Action.TAKE_INVESTOR, Action.TAKE_RADIO_OPERATOR])

/**
 * Arka's Milestone Card in the look of the physical card. Click shows the rules text of the special action.
 */
export default defineComponent({
  name: 'ArkaMilestoneCard',
  components: {
    AppIcon,
    ModalDialog
  },
  setup() {
    const { t } = useI18n()
    const modalId = `modal-${useId()}`
    return { t, modalId }
  },
  props: {
    milestoneCard: {
      type: Object as PropType<MilestoneCard>,
      required: true
    },
    /** Compact display for the sidebar */
    compact: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    specialActionTitle() : string {
      return `${this.t('arkaMilestoneCard.specialAction')}: ${this.t(this.specialActionTitleKey)}`
    },
    specialActionTitleKey() : string {
      return `rules.action.${this.milestoneCard.specialAction}.title`
    },
    isTakeExpert() : boolean {
      return TAKE_EXPERT_ACTIONS.has(this.milestoneCard.specialAction)
    }
  },
  methods: {
    showRules() : void {
      showModal(this.modalId)
    }
  }
})
</script>

<style lang="scss" scoped>
// colors of the physical Arka Milestone Cards: dark brown body, cream text, light wood strips
.milestone-card {
  position: relative;
  display: block;
  width: 17rem;
  padding: 0;
  text-align: start;
  font: inherit;
  color: #ece4c6;
  background-color: #322d2c;
  border: none;
  border-top: 6px solid #e7dab4;
  border-radius: 0.6rem;
  overflow: hidden;
  cursor: pointer;
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    right: 4px;
    width: 1.1rem;
    height: 1.1rem;
    background-image: url('@/assets/icons/help-semi-transparent.webp');
    background-size: contain;
    filter: invert(1);
  }
  .always-fulfilled {
    display: block;
    font-weight: bold;
    font-style: italic;
    font-size: 0.85rem;
    text-align: center;
    padding: 0.3rem 1.5rem;
    border-bottom: 3px solid #c2aa89;
  }
  .content {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0.6rem 0.6rem;
  }
  .overfulfill {
    flex: 1;
    font-style: italic;
    font-size: 0.85rem;
    .label, .condition {
      display: block;
    }
    .label {
      font-weight: bold;
    }
  }
  .special-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.4rem;
    min-width: 5rem;
    border-left: 3px solid #c2aa89;
    border-top: 3px solid #c2aa89;
    border-top-left-radius: 0.3rem;
    .special-action-title {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.85rem;
    }
    .cog {
      height: 1.8rem;
    }
    .action-icon {
      height: 2.6rem;
    }
  }
  &.compact {
    width: 100%;
    border-top-width: 4px;
    font-size: 0.75rem;
    &::after {
      width: 0.9rem;
      height: 0.9rem;
    }
    .content {
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.3rem 0.4rem 0.4rem;
      line-height: 0.95rem;
    }
    .overfulfill {
      padding-right: 0.8rem;
    }
    .special-action {
      flex-direction: row;
      justify-content: center;
      border: none;
      padding: 0;
      .cog {
        height: 1.4rem;
      }
      .action-icon {
        height: 1.8rem;
      }
    }
  }
}
</style>
