<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs7>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Campaign list</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom left>
                <v-btn slot="activator" icon dark>
                  <v-icon>more</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile>
                    <router-link to="/import/"><v-list-tile-title>Import Data</v-list-tile-title></router-link>
                  </v-list-tile>
                  <v-list-tile>
                    <router-link to="/spark/"><v-list-tile-title>Spark</v-list-tile-title></router-link>
                  </v-list-tile>
                </v-list>
              </v-menu>
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
                      <router-link :to="{ name: 'Campaign', params: { id_campaign: props.item.id_campaign, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">More</v-btn>
                      </router-link>
                      <router-link :to="{ name: 'SparkValue', params: { id_campaign: props.item.id_campaign, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">Make</v-btn>
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

export default {
  name: 'CampaignList',
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
