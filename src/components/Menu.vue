<template>
  <v-menu bottom left>
    <v-btn slot="activator" icon dark>
      <v-icon>more</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile v-for="input in inputs" :key="input.name" v-if="input.name !== where">
        <router-link :to="{ name: input.link}">
          <v-list-tile-title>{{ input.name }}</v-list-tile-title>
        </router-link>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'Menu',
  props: ['where'],
  data () {
    return {
      inputs: [
        {name: 'Import data', link: 'ImportCampaign'},
        {name: 'Spark', link: 'Spark'},
        {name: 'List', link: 'CampaignList'},
        {name: 'Virtual tour viewer', link: 'VirtualTourViewer'}
      ]
    }
  }
}
</script>
