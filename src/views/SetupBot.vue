<template>
  <h1>{{t('setupBot.title')}}</h1>

  <div class="instructions mt-4">
    <ol>
      <li v-html="t('setupBot.instructions.twoPlayerSetup')"></li>
      <li v-html="t('setupBot.instructions.milestoneCards')"></li>
      <li v-html="t('setupBot.instructions.arkaTableau')"></li>
      <li v-html="t('setupBot.instructions.arkaComponents')"></li>
      <li v-html="t('setupBot.instructions.arkaCards')"></li>
      <li v-html="t('setupBot.instructions.arkaMilestoneCards')"></li>
    </ol>
  </div>

  <div class="milestone-cards">
    <div v-for="(milestoneCard, index) in milestoneCards" :key="milestoneCard.id">
      <div class="fw-bold mb-1">{{t('setupBot.endOfRound', {round:milestoneRounds[index]})}}</div>
      <ArkaMilestoneCard :milestoneCard="milestoneCard"/>
    </div>
  </div>

  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col alert alert-info">
        <h4>{{t('setupBot.ruleChanges.title')}}</h4>
        <ul>
          <li v-html="t('setupBot.ruleChanges.managedByApp')"></li>
          <li v-html="t('setupBot.ruleChanges.actionCardDeck', {count:settings.actionCardsWithoutStar})"></li>
          <li v-html="t('setupBot.ruleChanges.arkaPhases')"></li>
          <li v-html="t('setupBot.ruleChanges.firstPlayer')"></li>
          <li v-html="t('setupBot.ruleChanges.meteorite')"></li>
        </ul>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-primary btn-lg mt-4" @click="startGame()">
    {{t('action.startGame')}}
  </button>

  <FooterButtons backButtonRouteTo="/setupGame" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import ArkaMilestoneCard from '@/components/structure/ArkaMilestoneCard.vue'
import MilestoneCard from '@/services/MilestoneCard'
import MilestoneCards from '@/services/MilestoneCards'
import CardDeck from '@/services/CardDeck'
import BotState from '@/services/BotState'
import getDifficultyLevelSettings, { DifficultyLevelSettings } from '@/util/getDifficultyLevelSettings'
import { MILESTONE_ROUNDS } from '@/util/getMilestoneIndex'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons,
    ArkaMilestoneCard
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()
    return { t, state, router, milestoneRounds: MILESTONE_ROUNDS }
  },
  computed: {
    settings() : DifficultyLevelSettings {
      return getDifficultyLevelSettings(this.state.setup.difficultyLevel)
    },
    milestoneCards() : MilestoneCard[] {
      return (this.state.setup.arkaMilestoneCards ?? []).map(id => MilestoneCards.get(id))
    }
  },
  methods: {
    startGame() : void {
      this.state.storeRound({
        round: 1,
        initialBotPersistence: {
          cardDeck: CardDeck.new(this.state.setup.difficultyLevel).toPersistence(),
          botState: BotState.new().toPersistence()
        },
        turns: []
      })
      this.router.push('/round/1/start')
    }
  }
})
</script>

<style lang="scss" scoped>
.instructions {
  max-width: 1000px;
  ol > li {
    margin-top: 0.5rem;
  }
}
.milestone-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-left: 2rem;
}
</style>
