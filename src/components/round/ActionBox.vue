<template>
  <button type="button" class="action-box" :aria-label="instructionTitle" @click="showInstructions">
    <span class="action">
      <template v-if="step.milestoneCard">
        <AppIcon type="action" :name="step.sourceAction ?? 'milestone-special-action'" class="milestone-icon"/>
        <span class="separator">:</span>
      </template>
      <slot name="action"></slot>
    </span>
    <span class="values" v-if="hasValues">
      <slot name="values"></slot>
    </span>
  </button>

  <ModalDialog :id="modalId" :title="instructionTitle" :scrollable="true">
    <template #body>
      <p v-if="step.milestoneCard" v-html="t(`rules.action.${step.sourceAction}.text`)"></p>
      <slot name="instruction"></slot>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import showModal from '@brdgm/brdgm-commons/src/util/modal/showModal'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionStep } from '@/services/BotActions'

/**
 * Colored action tile with the iconography of Arka's Action Card. Click shows the rules text.
 */
export default defineComponent({
  name: 'ActionBox',
  components: {
    ModalDialog,
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    const modalId = `modal-${useId()}`
    return { t, modalId }
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    },
    instructionTitle: {
      type: String,
      required: true
    }
  },
  computed: {
    hasValues() : boolean {
      return this.$slots.values != undefined
    }
  },
  methods: {
    showInstructions() : void {
      showModal(this.modalId)
    }
  }
})
</script>

<style lang="scss" scoped>
.action-box {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 12rem;
  min-height: 8rem;
  padding: 1.25rem 2.25rem;
  // look of the black action circle on Arka's Action Cards: dark center, metal ring, icy surroundings
  color: #fff;
  background-color: #222320;
  border: 4px solid #8d918c;
  border-radius: 1.5rem;
  box-shadow: 0 0 0 4px #d3dfd6;
  font: inherit;
  cursor: pointer;
  &::after {
    content: '';
    position: absolute;
    top: 6px;
    right: 6px;
    width: 1.25rem;
    height: 1.25rem;
    background-image: url('@/assets/icons/help-semi-transparent.webp');
    background-size: contain;
    filter: invert(1);
  }
  .action {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    :deep(.icon) {
      height: 5rem;
      width: 7rem;
      object-fit: contain;
    }
    .milestone-icon {
      height: 3rem;
    }
    .separator {
      font-size: 1.5rem;
      margin-right: 0.25rem;
    }
  }
  .values {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    :deep(.value-icon) {
      height: 2rem;
    }
  }
}
</style>
