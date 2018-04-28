<template>
   <div>
     <CampaignInfo v-bind:lots="lots" v-bind:sensors="sensors" v-bind:campaign="campaign"></CampaignInfo>
     <div class="column">
       <LotList style="width: 10%" v-bind:lots="lots"></LotList>
       <MapCampaign style="width: 90%; height: 700px;" v-on:test="test" v-bind:campaign="campaign" v-bind:sensors="sensors"></MapCampaign>
     </div>
   </div>
</template>

<script>
import CampaignInfo from '@/components/CampaignInfo'
import LotList from '@/components/LotList'
import MapCampaign from '@/components/MapCampaign'

export default {
  name: 'Campaign',
  props: ['id_campaign', 'id_malette'],

  components: {
    LotList,
    MapCampaign,
    CampaignInfo
  },

  data () {
    return {
      campaign: {},
      lots: [],
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
              fetch('http://opv_master:5000/sensors/' + i.sensors.id_sensors + '/' + i.sensors.id_malette)
                .then(answer => answer.json())
                .then(json => {
                  this.sensors.push(json)
                })
            }
          })
      })
  },
  methods: {
    test () {
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
</style>
