<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-card class="elevation-12">
            <CampaignInfo v-bind:lots="lots" v-bind:campaign="campaign"></CampaignInfo>
            <v-card-text>
                <v-layout row wrap>
                  <v-flex style="height: 86vh">
                    <LotFilters v-on:update:predicate="lotFilterPredicate = $event"></LotFilters>
                    <MapCampaign ref="map" v-bind:lots="filteredLots" style="height: 60vh" v-on:update:selected-lot="selectedLot = $event" v-bind:selected-lot="selectedLot"></MapCampaign>
                    <LotInfo class="mt-1" ref="lotInfo" v-bind:lot="selectedLot" style="height: 20vh"></LotInfo>
                  </v-flex>
                  <v-flex xs1>
                    <LotList class="ml-1" style="height: 86.5vh" ref="lotList" v-bind:lots="filteredLots" v-on:update:selected-lot="selectedLot = $event" v-bind:selected-lot="selectedLot"></LotList>
                  </v-flex>
                </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import CampaignInfo from '@/components/campaign/CampaignInfo'
import LotList from '@/components/campaign/LotList'
import MapCampaign from '@/components/campaign/MapCampaign'
import LotInfo from '@/components/campaign/LotInfo'
import LotFilters from '@/components/campaign/LotFilters'
import ApiManager from '@/apiManager'

export default {
  name: 'Campaign',
  props: ['id_campaign', 'id_malette'],

  components: {
    LotList,
    MapCampaign,
    CampaignInfo,
    LotInfo,
    LotFilters
  },

  data () {
    return {
      campaign: {},
      lots: [],
      selectedLot: null,
      lotFilterPredicate: (lot) => true
    }
  },

  created () {
    ApiManager.getCampaign(this.id_campaign, this.id_malette).then(answer => {
      this.campaign = answer.data
      ApiManager.getCampaignLotsWithSensors(answer.data.id_campaign).then(lots => {
        lots = lots.data.objects
        lots.forEach(l => { l.isComplet = null })
        this.lots = lots
      })
    })
  },

  computed: {
    /**
     * Filters lot according to the specified filter/predicate.
     */
    filteredLots () {
      return this.lots.filter(this.lotFilterPredicate)
    }
  }
}
</script>
