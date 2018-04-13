<template>
   <div>
     <h1>{{ id_campaign }}-{{ id_malette }}</h1>
     <LotList v-bind:campaign="campaign"></LotList>
     <MapCampaign v-bind:campaign="campaign"></MapCampaign>
   </div>
</template>

<script>
import LotList from '@/components/LotList'
import MapCampaign from '@/components/MapCampaign'

export default {
  name: 'Campaign',
  props: ['id_campaign', 'id_malette'],

  components: {
    LotList,
    MapCampaign
  },

  data () {
    return {
      campaign: null
    }
  },

  created () {
    fetch('http://opv_master:5000/campaign/' + this.id_campaign + '/' + this.id_malette)
      .then(answer => answer.json())
      .then(json => {
        this.campaign = json
      })
  }
}
</script>
