<template>
  <div class="action-box" role="button" tabindex="0" :aria-label="instructionTitle"
      @click="showInstructions" @keydown.enter="showInstructions">
    <div class="action">
      <template v-if="step.milestoneCard">
        <AppIcon type="action" :name="step.sourceAction ?? 'milestone-special-action'" class="milestone-icon"/>
        <span class="separator">:</span>
      </template>
      <slot name="action"></slot>
    </div>
    <div class="values" v-if="hasValues">
      <slot name="values"></slot>
    </div>
  </div>

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
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 12rem;
  min-height: 8rem;
  padding: 1.25rem 2.25rem;
  color: #212529;
  background-color: #cfe1e8;
  border: 3px solid #7d98a3;
  border-radius: 0.75rem;
  cursor: pointer;
  background-image: url('@/assets/icons/help-semi-transparent.webp');
  background-repeat: no-repeat;
  background-position: right 5px top 5px;
  background-size: 1.25rem;
  .action {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    :deep(.icon) {
      height: 5rem;
      border-radius: 0.5rem;
    }
    .milestone-icon {
      height: 3rem;
      border-radius: 0.35rem;
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
