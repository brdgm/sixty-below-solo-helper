<template>
  <div class="table-wrapper">
    <table>
      <tbody>
        <tr>
          <th scope="col"><h5>{{t('finalScoring.title')}}</h5></th>
          <th scope="col"><span class="fw-bold">{{t('finalScoring.player')}}</span></th>
          <th scope="col"><span class="fw-bold">{{t('player.bot')}}</span></th>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.expertsRow4And5')"></span></th>
          <td><NumberInput v-model="playerExpertsRow4And5" :max="15"/></td>
          <td><NumberInput v-model="botExpertsRow4And5" :max="15"/></td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.missionCoordinators')"></span></th>
          <td><NumberInput v-model="playerMissionCoordinators" :max="15"/></td>
          <td><NumberInput v-model="botMissionCoordinators" :max="15"/></td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.pilotsMechanics')"></span></th>
          <td><NumberInput v-model="playerPilotsMechanics" :max="15"/></td>
          <td><NumberInput v-model="botPilotsMechanics" :max="15"/></td>
        </tr>
        <tr class="subtotal">
          <th scope="row"><span v-html="t('finalScoring.experts')"></span></th>
          <td>{{playerExpertVP}}</td>
          <td>{{botExpertVP}}</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.expeditionTrack')"></span></th>
          <td><NumberInput v-model="playerExpeditionTrackVP"/></td>
          <td>{{botExpeditionTrackVP}}</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.stationSites')"></span></th>
          <td><NumberInput v-model="playerStationSitesVP"/></td>
          <td>–</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.stations')"></span></th>
          <td><NumberInput v-model="playerStationsVP"/></td>
          <td>–</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.upgrades')"></span></th>
          <td><NumberInput v-model="playerUpgradesVP"/></td>
          <td>{{botUpgradesVP}}</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.negativePoints')"></span></th>
          <td class="text-nowrap">− <NumberInput v-model="playerNegativePoints"/></td>
          <td>–</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.expeditionCards')"></span></th>
          <td><NumberInput v-model="playerExpeditionCardsVP"/></td>
          <td rowspan="2">
            <NumberInput v-model="botCardsVP"/>
            <div class="hint" v-html="t('finalScoring.arkaCards')"></div>
          </td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.projectCards')"></span></th>
          <td><NumberInput v-model="playerProjectCardsVP"/></td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.milestones')"></span></th>
          <td><NumberInput v-model="playerMilestonesVP"/></td>
          <td>{{botMilestonesVP}}</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.meteorite')"></span></th>
          <td><NumberInput v-model="playerMeteoriteVP"/></td>
          <td>–</td>
        </tr>
        <tr>
          <th scope="row" class="fw-bold">{{t('finalScoring.total')}}</th>
          <td class="fw-bold">{{playerTotalVP}}</td>
          <td class="fw-bold">{{botTotalVP}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="alert mt-3 winner" :class="winnerAlertClass" role="status">
    <b>{{t(`finalScoring.winner.${winner}`)}}</b>
    <span class="ms-2 small">{{t('finalScoring.tie')}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'
import toNumber from '@brdgm/brdgm-commons/src/util/form/toNumber'
import NavigationState from '@/util/NavigationState'
import Player from '@/services/enum/Player'
import getExpertVP from '@/util/getExpertVP'
import getArkaUpgradeVP from '@/util/getArkaUpgradeVP'
import getWinner from '@/util/getWinner'

/**
 * Final scoring for the player and Arka, one row per scoring category of the base game plus the Meteorite.
 */
export default defineComponent({
  name: 'FinalScoring',
  components: {
    NumberInput
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { botState } = props.navigationState

    // Arka's Expert counts are tracked by the app, but can be corrected
    const botExpertsRow4And5 = ref<number|undefined>(botState.expertsRow4And5Count)
    const botMissionCoordinators = ref<number|undefined>(botState.missionCoordinatorCount)
    const botPilotsMechanics = ref<number|undefined>(botState.pilotMechanicCount)

    return { t, botExpertsRow4And5, botMissionCoordinators, botPilotsMechanics }
  },
  data() {
    return {
      playerExpertsRow4And5: undefined as number|undefined,
      playerMissionCoordinators: undefined as number|undefined,
      playerPilotsMechanics: undefined as number|undefined,
      playerExpeditionTrackVP: undefined as number|undefined,
      playerStationSitesVP: undefined as number|undefined,
      playerStationsVP: undefined as number|undefined,
      playerUpgradesVP: undefined as number|undefined,
      playerNegativePoints: undefined as number|undefined,
      playerExpeditionCardsVP: undefined as number|undefined,
      playerProjectCardsVP: undefined as number|undefined,
      playerMilestonesVP: undefined as number|undefined,
      playerMeteoriteVP: undefined as number|undefined,
      botCardsVP: undefined as number|undefined
    }
  },
  computed: {
    playerExpertVP() : number {
      return getExpertVP({
        expertsRow4And5: toNumber(this.playerExpertsRow4And5),
        missionCoordinators: toNumber(this.playerMissionCoordinators),
        pilotsMechanics: toNumber(this.playerPilotsMechanics)
      })
    },
    botExpertVP() : number {
      return getExpertVP({
        expertsRow4And5: toNumber(this.botExpertsRow4And5),
        missionCoordinators: toNumber(this.botMissionCoordinators),
        pilotsMechanics: toNumber(this.botPilotsMechanics)
      })
    },
    botExpeditionTrackVP() : number {
      return this.navigationState.botState.expeditionSteps
    },
    botUpgradesVP() : number {
      return getArkaUpgradeVP(this.navigationState.botState.upgrades)
    },
    botMilestonesVP() : number {
      return this.navigationState.scoredMilestones.reduce((sum, milestone) => sum + milestone.victoryPoints, 0)
    },
    playerTotalVP() : number {
      return this.playerExpertVP
        + toNumber(this.playerExpeditionTrackVP)
        + toNumber(this.playerStationSitesVP)
        + toNumber(this.playerStationsVP)
        + toNumber(this.playerUpgradesVP)
        - toNumber(this.playerNegativePoints)
        + toNumber(this.playerExpeditionCardsVP)
        + toNumber(this.playerProjectCardsVP)
        + toNumber(this.playerMilestonesVP)
        + toNumber(this.playerMeteoriteVP)
    },
    botTotalVP() : number {
      return this.botExpertVP
        + this.botExpeditionTrackVP
        + this.botUpgradesVP
        + toNumber(this.botCardsVP)
        + this.botMilestonesVP
    },
    winner() : Player {
      return getWinner(this.playerTotalVP, this.botTotalVP)
    },
    winnerAlertClass() : string {
      return this.winner == Player.PLAYER ? 'alert-success' : 'alert-danger'
    }
  }
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  overflow-x: auto;
}
th, td {
  text-align: center;
  padding: 0.5rem;
  font-weight: normal;
  min-width: 5rem;
}
th:nth-child(1) {
  text-align: start;
  max-width: 22rem;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
tr.subtotal {
  font-style: italic;
}
th {
  vertical-align: middle;
}
:deep(input) {
  width: 5rem;
  display: inline-block;
}
.hint {
  font-size: 0.8rem;
  max-width: 10rem;
  margin: 0.25rem auto 0;
}
.winner {
  max-width: 40rem;
}
</style>
