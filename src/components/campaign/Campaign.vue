<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-card class="elevation-12">
            <CampaignInfo v-bind:lots="lots" v-bind:campaign="campaign"></CampaignInfo>
            <v-card-text>
              <v-container fluid grid-list-sm>
                <v-layout row wrap>
                  <v-flex style="height: 80vh">
                    <MapCampaign ref="map" v-bind:lots="lots" style="height: 60vh"></MapCampaign>
                    <LotInfo class="mt-1" ref="lotInfo" style="height: 20vh"></LotInfo>
                  </v-flex>
                  <v-flex xs1>
                    <LotList ref="lotList" v-bind:lots="lots"></LotList>
                  </v-flex>
                </v-layout>
              </v-container>
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
import ApiManager from '@/apiManager'

export default {
  name: 'Campaign',
  props: ['id_campaign', 'id_malette'],

  components: {
    LotList,
    MapCampaign,
    CampaignInfo,
    LotInfo
  },

  data () {
    return {
      campaign: {},
      lots: []
    }
  },

  created () {
    ApiManager.getCampaign(this.id_campaign, this.id_malette).then(answer => {
      this.campaign = answer.data
      for (var lot in answer.data.lots) {
        lot = answer.data.lots[lot]
        ApiManager.getLotWithSensors(lot.id_lot, lot.id_malette).then(lot => {
          this.lots.push(lot.data)
        })
      }
    })
  }
}
</script>
