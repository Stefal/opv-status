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
    fetch('http://opv_master:5000/campaign/' + this.id_campaign + '/' + this.id_malette)
      .then(answer => answer.json())
      .then(json => {
        this.campaign = json
        fetch('http://opv_master:5000/lot/with_sensors?id_campaign=' + json.id_campaign)
          .then(answer => answer.json())
          .then(json => {
            this.lots = json.objects
          })
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
