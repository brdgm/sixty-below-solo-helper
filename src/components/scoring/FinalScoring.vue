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
          <th scope="row"><span v-html="t('finalScoring.experts')"></span></th>
          <td><NumberInput v-model="playerExpertsVP"/></td>
          <td>{{botExpertsVP}}</td>
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
          <td><NumberInput v-model="botExpeditionCardsVP"/></td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.projectCards')"></span></th>
          <td><NumberInput v-model="playerProjectCardsVP"/></td>
          <td>
            <NumberInput v-model="botProjectCardsVP"/>
            <div class="hint" v-html="t('finalScoring.arkaProjectCards')"></div>
          </td>
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

  <div v-if="isTie" class="alert alert-info mt-3 tie" role="status" v-html="t('finalScoring.tie')"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'
import toNumber from '@brdgm/brdgm-commons/src/util/form/toNumber'
import NavigationState from '@/util/NavigationState'
import getExpertVP from '@/util/getExpertVP'
import getArkaUpgradeVP from '@/util/getArkaUpgradeVP'

/**
 * Final scoring for the player and Arka: victory points per scoring category of the base game plus the Meteorite.
 * The player enters victory points, Arka's are calculated where tracked by the app.
 */
export default defineComponent({
  name: 'FinalScoring',
  components: {
    NumberInput
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  data() {
    return {
      playerExpertsVP: undefined as number|undefined,
      playerExpeditionTrackVP: undefined as number|undefined,
      playerStationSitesVP: undefined as number|undefined,
      playerStationsVP: undefined as number|undefined,
      playerUpgradesVP: undefined as number|undefined,
      playerNegativePoints: undefined as number|undefined,
      playerExpeditionCardsVP: undefined as number|undefined,
      playerProjectCardsVP: undefined as number|undefined,
      playerMilestonesVP: undefined as number|undefined,
      playerMeteoriteVP: undefined as number|undefined,
      botExpeditionCardsVP: undefined as number|undefined,
      botProjectCardsVP: undefined as number|undefined
    }
  },
  computed: {
    botExpertsVP() : number {
      const { botState } = this.navigationState
      return getExpertVP({
        expertsRow4And5: botState.expertsRow4And5Count,
        missionCoordinators: botState.missionCoordinatorCount,
        pilotsMechanics: botState.pilotMechanicCount
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
      return toNumber(this.playerExpertsVP)
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
      return this.botExpertsVP
        + this.botExpeditionTrackVP
        + this.botUpgradesVP
        + toNumber(this.botExpeditionCardsVP)
        + toNumber(this.botProjectCardsVP)
        + this.botMilestonesVP
    },
    isTie() : boolean {
      return this.playerTotalVP > 0 && this.playerTotalVP == this.botTotalVP
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
th {
  vertical-align: middle;
}
:deep(input) {
  width: 5rem;
  display: inline-block;
}
.hint {
  font-size: 0.8rem;
  max-width: 11rem;
  margin: 0.25rem auto 0;
}
.tie {
  max-width: 40rem;
}
</style>
