<template>
  <v-card v-if="node !== null">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Node {{node.id_path_node}}/{{node.id_malette}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link v-if="panorama !== null" :to="{name: 'Viewer', params: {id_tile: tile.id_tile, id_malette: tile.id_malette}}"><v-icon>panorama_horizontal</v-icon></router-link>
    </v-toolbar>
    <v-card-text>
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>Disabled: </v-list-tile-content>
              <v-list-tile-content class="align-end">{{node.disabled}}</v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>Hotspot: </v-list-tile-content>
              <v-list-tile-content class="align-end">{{node.hotspot}}</v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>Endpoint: </v-list-tile-content>
              <v-list-tile-content class="align-end">{{node.endpoint}}</v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>Panorama: </v-list-tile-content>
              <v-list-tile-content class="align-end">{{node.id_panorama}}/{{node.id_panorama_malette}}</v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>Sensors: </v-list-tile-content>
              <v-list-tile-content class="align-end">{{sensors}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
      <img class="mt-1" v-if="panorama !== null" :src="panoramaUrl">
    </v-card-text>
  </v-card>
</template>

<script>
import Config from '@/config'
import apiManager from '@/apiManager'

export default {
  name: 'NodeInfo',
  props: {
    node: {
      default: null
    }
  },
  data () {
    return {
      picturesPath: Config.server.host + ':' + Config.server.dm_port + '/v1/files/',
      panorama: null
    }
  },
  mounted () {
    this.newNode()
  },
  watch: {
    node () {
      this.newNode()
    }
  },
  methods: {
    newNode () {
      if (this.node !== null) {
        apiManager.getPanorama(this.node.id_panorama, this.node.id_panorama_malette)
          .then((panorama) => {
            this.panorama = panorama.data
          })
      }
    }
  },
  computed: {
    panoramaUrl () {
      return this.picturesPath + this.panorama.equirectangular_path + '/panorama.jpg?width=300'
    },
    sensors () {
      if (this.node.reconstructed_gps_pos !== null) {
        return 'reconstructed'
      } else {
        return 'orignal'
      }
    },
    tile () {
      return this.panorama.tiles[this.panorama.tiles.length - 1]
    }
  }
}
</script>
<style scoped>
img {
  width: 100%;
}
</style>
