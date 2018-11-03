<template>
  <v-dialog width="500" v-model="importing">
    <v-btn color="primary" dark slot="activator">Import</v-btn>
    <v-card style="z-index: 3">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Import panorama</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-layout>
          <v-btn @click="getPanorama" color="primary" dark>Import all</v-btn>
          <v-switch v-model="active" label="Active ?"></v-switch>
        </v-layout>
        <v-divider></v-divider>
        <v-layout>
          <v-text-field ref="idPanorama" label="Id panorama"></v-text-field>
          <v-text-field ref="idMalette" class="ml-1 mr-1" label="Id malette"></v-text-field>
          <v-btn @click="getOnePanorama" color="primary" dark>Import</v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import apiManager from '@/apiManager'

export default {
  name: 'Import',
  props: ['path_details'],
  data () {
    return {
      importing: false,
      active: true
    }
  },
  methods: {
    getPanorama () {
      if (!this.active) {
        apiManager.getPanoramaSensorsFromCampaign(this.path_details.campaign.id_campaign)
          .then(this.convertPanoramaToPathNode)
      } else {
        apiManager.getActivePanoramaSensorsFromCampaign(this.path_details.campaign.id_campaign)
          .then(this.convertPanoramaToPathNode)
      }
    },
    getOnePanorama () {
      apiManager.getPanoramaSensors(this.$refs.idPanorama.$refs.input.value, this.$refs.idMalette.$refs.input.value)
        .then((panorama) => {
          this.convertPanoramaToPathNode({
            data: {
              objects: [
                panorama.data
              ]
            }
          })
        })
    },
    convertPanoramaToPathNode (panoramas) {
      panoramas = panoramas.data.objects
      let pathNodes = []
      for (var panorama in panoramas) {
        panorama = panoramas[panorama]
        let pathNode = panorama
        pathNode['disabled'] = false
        pathNode['hotspot'] = false
        pathNode['endpoint'] = false
        pathNode['id_panorama_malette'] = panorama.id_malette
        pathNode['id_path_details'] = this.path_details.id_path_details
        pathNode['id_path_details_malette'] = this.path_details.id_malette
        pathNodes.push(pathNode)
      }
      this.$parent.$parent.$parent.$parent.$parent.pathNode.push(...pathNodes)
      this.$parent.$parent.$parent.$parent.$parent.save(true)
    }
  }
}
</script>
