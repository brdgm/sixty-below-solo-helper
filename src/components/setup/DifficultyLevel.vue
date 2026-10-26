<template>
  <h3 class="mt-4 mb-3">{{t('setup.difficultyLevel.title')}}</h3>

  <div class="row">
    <div class="col-3 col-sm-2 col-md-1 text-end">
      <label for="difficultyLevel" class="form-label">{{t('setup.difficultyLevel.easy')}}</label>
    </div>
    <div class="col-6 col-sm-8 col-md-5">
      <input type="range" class="form-range" :min="minLevel" :max="maxLevel" id="difficultyLevel"
          v-model.number="difficultyLevel">
    </div>
    <div class="col-3 col-sm-2 col-md-1">
      <label for="difficultyLevel" class="form-label">{{t('setup.difficultyLevel.hard')}}</label>
    </div>
  </div>
  <div class="row">
    <div class="col-6 offset-3 col-sm-8 offset-sm-2 col-md-5 offset-md-1">
      <i>
        {{t(`difficultyMode.${settings.mode}`)}}:
        {{t('setup.difficultyLevel.actionCardsWithoutStar', {count:settings.actionCardsWithoutStar})}}
      </i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import DifficultyLevelEnum from '@/services/enum/DifficultyLevel'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import getDifficultyLevelSettings, { DifficultyLevelSettings } from '@/util/getDifficultyLevelSettings'

export default defineComponent({
  name: 'DifficultyLevel',
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const levels = getAllEnumValues(DifficultyLevelEnum)
    const minLevel = Math.min(...levels)
    const maxLevel = Math.max(...levels)
    return { t, state, minLevel, maxLevel }
  },
  computed: {
    difficultyLevel: {
      get() : DifficultyLevelEnum {
        return this.state.setup.difficultyLevel
      },
      set(value : DifficultyLevelEnum) {
        this.state.setup.difficultyLevel = value
      }
    },
    settings() : DifficultyLevelSettings {
      return getDifficultyLevelSettings(this.difficultyLevel)
    }
  }
})
</script>
