<template>
   <div>
     <CampaignInfo v-bind:lots="lots" v-bind:campaign="campaign"></CampaignInfo>
     <div class="column">
       <LotList style="width: 10%" v-bind:lots="lots"></LotList>
       <div class="row" style="width: 100%">
         <MapCampaign style="width: 100%; height: 500px;" v-bind:lots="lots"></MapCampaign>
         <LotInfo ref="lotInfo"></LotInfo>
       </div>
     </div>
   </div>
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

<style>
.column{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.row{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
