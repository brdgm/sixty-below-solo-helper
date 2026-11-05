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
          <td>
            <span class="with-hint">
              {{botExpeditionTrackVP}}
              <InfoHint :text="t('finalScoring.arkaExpeditionTrack')" class="hint"/>
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.stationSites')"></span></th>
          <td><NumberInput v-model="playerStationSitesVP"/></td>
          <td>
            <span class="with-hint">
              <NumberInput v-model="botStationSitesVP"/>
              <InfoHint :text="t('finalScoring.arkaStationSites')" class="hint"/>
            </span>
          </td>
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
          <td class="text-nowrap">− <NumberInput v-model="playerNegativePoints" class="minusVP"/></td>
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
            <span class="with-hint">
              <NumberInput v-model="botProjectCardsVP"/>
              <InfoHint :text="t('finalScoring.arkaProjectCards')" class="hint"/>
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.milestones')"></span></th>
          <td><NumberInput v-model="playerMilestonesVP"/></td>
          <td>{{botMilestonesVP}}</td>
        </tr>
        <tr>
          <th scope="row"><span v-html="t('finalScoring.meteorite')"></span></th>
          <td>
            <span class="with-hint">
              <NumberInput v-model="playerMeteoriteVP"/>
              <InfoHint :text="t('finalScoring.playerMeteorite')" class="hint"/>
            </span>
          </td>
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

  <output v-if="isTie" class="alert alert-info mt-3 tie d-block" v-html="t('finalScoring.tie')"></output>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'
import toNumber from '@brdgm/brdgm-commons/src/util/form/toNumber'
import NavigationState from '@/util/NavigationState'
import getExpertVP from '@/util/getExpertVP'
import getArkaUpgradeVP from '@/util/getArkaUpgradeVP'
import getArkaExpeditionVP from '@/util/getArkaExpeditionVP'
import getArkaStationSitesVP from '@/util/getArkaStationSitesVP'
import InfoHint from '@/components/structure/InfoHint.vue'

/**
 * Final scoring for the player and Arka: victory points per scoring category of the base game plus the Meteorite.
 * The player enters victory points, Arka's are calculated where tracked by the app.
 * Arka's Station Sites VP are pre-filled, but can be corrected (she may have taken a Station Site with a lower value).
 */
export default defineComponent({
  name: 'FinalScoring',
  components: {
    NumberInput,
    InfoHint
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
      botStationSitesVP: getArkaStationSitesVP(this.navigationState.botState.stationSiteValues) as number|undefined,
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
      return getArkaExpeditionVP(this.navigationState.botState.expeditionSteps)
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
        + toNumber(this.botStationSitesVP)
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
  vertical-align: top;
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
// Value columns: space for the help icons on the right in all rows, the icons are placed next to the value
// without shifting it, so all values of a column are centered on the same axis
th:not(:first-child), td {
  padding-right: 2.25rem;
}
.with-hint {
  position: relative;
  display: inline-block;
  .hint {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 0.25rem;
  }
}
:deep(input) {
  width: 5rem;
  display: inline-block;
  &.minusVP {
    width: 4.1rem;
  }
}
.tie {
  max-width: 40rem;
}
// small screens: compact cells and inputs (VP have max. 3 digits) to avoid horizontal scrolling
@media (max-width: 575.98px) {
  th, td {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  th:not(:first-child), td {
    padding-right: 2rem;
  }
  .with-hint .hint {
    margin-left: 0;
  }
  :deep(input) {
    width: 4rem;
    &.minusVP {
      width: 3.1rem;
    }
  }
}
</style>
