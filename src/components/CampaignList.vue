<template>
  <table>
    <tr>
      <th>Campaign name</th>
      <th>Lots number</th>
      <th>Campaign id</th>
      <th>Malette id</th>
    </tr>
    <tr v-for="campaign in campaigns" v-bind:key="campaign.id_campaign">
      <td>{{ campaign.name }}</td>
      <td>{{ campaign.lots.length }}</td>
      <td>{{ campaign.id_campaign }}</td>
      <td>{{ campaign.id_malette }}</td>
      <td><router-link :to="'/campaign/' + campaign.id_campaign + '/' + campaign.id_malette">More</router-link></td>
      <td><router-link :to="'/spark/' + campaign.id_campaign + '/' + campaign.id_malette">Make</router-link></td>
    </tr>
  </table>
</template>

<script>
import ApiManager from '@/apiManager'

export default {
  name: 'CampaignList',
  data () {
    return {
      campaigns: []
    }
  },
  created () {
    ApiManager.getCampaignList().then(answer => {
      this.campaigns = answer.data.objects
    })
  }
}
</script>
