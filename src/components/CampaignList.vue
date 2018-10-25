<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs7>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Campaign list</v-toolbar-title>
              <v-spacer></v-spacer>
              <Menu :where="'List'"></Menu>
            </v-toolbar>
            <v-card-text>
              <v-data-table :headers="headers" :items="campaigns" item-key="id_campaign" hide-actions class="elevation-1" no-data>
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{props.item.name}}</td>
                    <td>{{props.item.lots.length}}</td>
                    <td>{{props.item.id_campaign}}</td>
                    <td>{{props.item.id_malette}}</td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <router-link class="mr-1" :to="{ name: 'Campaign', params: { id_campaign: props.item.id_campaign, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">Global campaign view</v-btn>
                      </router-link>
                      <router-link class="mr-1" :to="{ name: 'SparkValue', params: { id_campaign: props.item.id_campaign, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">Stitch it</v-btn>
                      </router-link>
                      <router-link class="mr-1" :to="{ name: 'PanoramaSelector', params: { id_campaign: props.item.id_campaign, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">Panorama selection</v-btn>
                      </router-link>
                      <router-link :to="{ name: 'PathDetailsViewer', params: { id_campaign: props.item.id_campaign, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">Path details</v-btn>
                      </router-link>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import ApiManager from '@/apiManager'
import Menu from '@/components/Menu'

export default {
  name: 'CampaignList',
  components: {
    Menu
  },
  data () {
    return {
      campaigns: [],
      headers: [
        {text: 'Campaign name', value: 'name', align: 'left'},
        {text: 'Lot number', value: 'lots.length'},
        {text: 'Campaign id', value: 'id_campaign'},
        {text: 'Malette id', value: 'id_malette'}
      ]
    }
  },
  created () {
    ApiManager.getCampaignList().then(answer => {
      this.campaigns = answer.data.objects
    })
  }
}
</script>
