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
    </tr>
  </table>
</template>

<script>
export default {
  name: 'CampaignList',
  data () {
    return {
      campaigns: []
    }
  },
  created () {
    fetch('http://opv_master:5000/campaign/')
      .then(answer => answer.json())
      .then(json => {
        this.campaigns = json.objects
      })
  }
}
</script>
