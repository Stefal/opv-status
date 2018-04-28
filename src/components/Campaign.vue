<template>
   <div>
     <CampaignInfo v-bind:lots="lots" v-bind:sensors="sensors" v-bind:campaign="campaign"></CampaignInfo>
     <div class="column">
       <LotList style="width: 10%" v-bind:lots="lots"></LotList>
       <div class="row" style="width: 100%">
         <MapCampaign style="width: 100%; height: 700px;" v-on:test="test" v-bind:campaign="campaign" v-bind:sensors="sensors" v-bind:lots="lots_json"></MapCampaign>
         <LotInfo ref="lotInfo"></LotInfo>
       </div>
     </div>
   </div>
</template>

<script>
import CampaignInfo from '@/components/CampaignInfo'
import LotList from '@/components/LotList'
import MapCampaign from '@/components/MapCampaign'
import LotInfo from '@/components/LotInfo'

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
      lots: [],
      lots_json: {},
      sensors: []
    }
  },

  created () {
    fetch('http://opv_master:5000/campaign/' + this.id_campaign + '/' + this.id_malette)
      .then(answer => answer.json())
      .then(json => {
        this.campaign = json
        fetch('http://opv_master:5000/lot?id_campaign=' + json.id_campaign)
          .then(answer => answer.json())
          .then(json => {
            this.lots = json.objects

            for (var i in json.objects) {
              i = json.objects[i]
              this.lots_json[i.id_lot] = i
              fetch('http://opv_master:5000/sensors/' + i.sensors.id_sensors + '/' + i.sensors.id_malette)
                .then(answer => answer.json())
                .then(json => {
                  this.sensors.push(json)
                  this.lots_json[json.lot.id_lot].sensors = json
                })
            }
          })
      })
  },
  methods: {
    test: function () {
      console.log('tested !')
    }
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
  justify-content: space-between;
}
</style>
