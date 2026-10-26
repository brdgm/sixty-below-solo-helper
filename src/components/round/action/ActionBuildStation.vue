<template>
  <ActionBox :step="step" :instructionTitle="t(`rules.action.${iconName}.title`)">
    <template #action>
      <AppIcon type="action" :name="iconName" class="icon"/>
    </template>
    <template #values>
      {{t('actionBuildStation.stationSite', {value:step.stationSiteValue})}}
    </template>
    <template #instruction>
      <p v-if="isIf3Engineers" v-html="t('rules.action.build-station-if-3-engineers.text')"></p>
      <p v-html="t('rules.action.build-station.text')"></p>
    </template>
  </ActionBox>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionBox from '../ActionBox.vue'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionStep } from '@/services/BotActions'
import Action from '@/services/enum/Action'

export default defineComponent({
  name: 'ActionBuildStation',
  components: {
    ActionBox,
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    }
  },
  computed: {
    isIf3Engineers() : boolean {
      return this.step.sourceAction == Action.BUILD_STATION_IF_3_ENGINEERS
    },
    iconName() : Action {
      return this.isIf3Engineers ? Action.BUILD_STATION_IF_3_ENGINEERS : Action.BUILD_STATION
    }
  }
})
</script>
