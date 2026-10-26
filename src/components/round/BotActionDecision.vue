<template>
  <div class="decision mt-4">
    <template v-if="isExecutedOrNotPossible">
      <button type="button" class="btn btn-success btn-lg me-2" @click="executed()">
        {{t('botActionDecision.executed')}}
      </button>
      <button type="button" class="btn btn-danger btn-lg" @click="notPossible()">
        {{t('botActionDecision.notPossible')}}
      </button>
    </template>

    <template v-else-if="columnExpertType">
      <p v-html="t('botActionDecision.whichExpert')"></p>
      <button v-for="expertType in [columnExpertType, missionCoordinator]" :key="expertType"
          type="button" class="btn btn-outline-dark btn-lg me-2 mb-2" @click="takeExpert(expertType)">
        <AppIcon type="expert" :name="expertType" class="expert-icon"/> {{t(`expertType.${expertType}`)}}
      </button>
    </template>

    <template v-else-if="isTakeExpert">
      <template v-if="selectedExpertType">
        <p v-html="t('botActionDecision.whichColumn', {expert:t(`expertType.${selectedExpertType}`)})"></p>
        <button v-for="column in step.pilotMechanicColumns" :key="column"
            type="button" class="btn btn-outline-dark btn-lg me-2 mb-2" @click="chooseColumn(column)">
          <AppIcon type="expert" :name="column" class="expert-icon"/> {{t('botActionDecision.column', {expert:t(`expertType.${column}`)})}}
        </button>
      </template>
      <template v-else>
        <p v-html="t('botActionDecision.whichExpert')"></p>
        <button v-for="expertType in takeExpertTypes" :key="expertType"
            type="button" class="btn btn-outline-dark btn-lg me-2 mb-2" @click="takeExpert(expertType)">
          <AppIcon type="expert" :name="expertType" class="expert-icon"/> {{t(`expertType.${expertType}`)}}
        </button>
        <br/>
        <button type="button" class="btn btn-danger btn-lg mt-2" @click="notPossible()">
          {{t('botActionDecision.notPossible')}}
        </button>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionStep } from '@/services/BotActions'
import { BotActionDecision } from '@/store/state'
import Action from '@/services/enum/Action'
import ExpertType from '@/services/enum/ExpertType'
import ExpertColumn from '@/services/enum/ExpertColumn'

const EXECUTED_OR_NOT_POSSIBLE_ACTIONS : string[] = [Action.BUILD_STATION, Action.PLACE_EXPLORER_LANDSCAPE, Action.PLACE_EXPLORER_EXPERT_ACTION_TILE]
const COLUMN_EXPERT_TYPES : Partial<Record<string, ExpertType>> = {
  [Action.TAKE_ENGINEER]: ExpertType.ENGINEER,
  [Action.TAKE_INVESTOR]: ExpertType.INVESTOR,
  [Action.TAKE_RADIO_OPERATOR]: ExpertType.RADIO_OPERATOR
}
/** Experts on the Expert Plan, for "take the upper-most available Expert from the left" */
const TAKE_EXPERT_TYPES = [ExpertType.RADIO_OPERATOR, ExpertType.ENGINEER, ExpertType.INVESTOR, ExpertType.PILOT, ExpertType.MECHANIC]

/**
 * Player decision for Arka's pending action step.
 */
export default defineComponent({
  name: 'BotActionDecision',
  components: {
    AppIcon
  },
  emits: {
    decide: (_decision: BotActionDecision) => true
  },
  setup() {
    const { t } = useI18n()
    return { t, missionCoordinator: ExpertType.MISSION_COORDINATOR, takeExpertTypes: TAKE_EXPERT_TYPES }
  },
  props: {
    step: {
      type: Object as PropType<BotActionStep>,
      required: true
    }
  },
  data() {
    return {
      selectedExpertType: undefined as ExpertType|undefined
    }
  },
  computed: {
    isExecutedOrNotPossible() : boolean {
      return EXECUTED_OR_NOT_POSSIBLE_ACTIONS.includes(this.step.action)
    },
    columnExpertType() : ExpertType|undefined {
      return COLUMN_EXPERT_TYPES[this.step.action]
    },
    isTakeExpert() : boolean {
      return this.step.action == Action.TAKE_EXPERT
    }
  },
  methods: {
    executed() : void {
      this.$emit('decide', { executed: true })
    },
    notPossible() : void {
      this.$emit('decide', { executed: false })
    },
    takeExpert(expertType : ExpertType) : void {
      const isPilotMechanic = expertType == ExpertType.PILOT || expertType == ExpertType.MECHANIC
      if (this.isTakeExpert && isPilotMechanic && (this.step.pilotMechanicColumns ?? []).length > 1) {
        this.selectedExpertType = expertType
      }
      else {
        this.$emit('decide', { executed: true, expertType })
      }
    },
    chooseColumn(expertColumn : ExpertColumn) : void {
      this.$emit('decide', { executed: true, expertType: this.selectedExpertType, expertColumn })
    }
  }
})
</script>

<style lang="scss" scoped>
.expert-icon {
  height: 2rem;
}
</style>
