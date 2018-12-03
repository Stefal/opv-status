<template>
  <v-card>
    <l-map ref='map' :center="center" :zoom='zoom' style="height: 100%">
      <l-tile-layer :url='url' :options='tileOption' :attribution='attribution'></l-tile-layer>
      <l-marker v-for='(aNode, index) in node' :key='aNode.id_path_node' :icon='getIcon(aNode, index)' :lat-lng='getLatLng(aNode)' @click="selectNode(index)"></l-marker>
      <l-polyline v-for='(anEdge, index) in edge' :key='anEdge.id_path_edge' :latLngs="[getLatLng(nodeDict[anEdge.source_path_node.id_path_node]), getLatLng(nodeDict[anEdge.dest_path_node.id_path_node])]" @click="selectEdge(index)"></l-polyline>
    </l-map>
  </v-card>
</template>

<script>
import '@/../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LMap, LMarker, LPopup, LTileLayer, LPolyline } from 'vue2-leaflet'

export default {
  name: 'Map',
  components: {
    LMap,
    LMarker,
    LPopup,
    LTileLayer,
    LPolyline
  },
  props: {
    'node': {
      default: () => []
    },
    'edge': {
      default: () => []
    },
    'path_details': {
      default: () => { return {} }
    }
  },
  data () {
    return {
      zoom: 19,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileOption: {
        maxNativeZoom: 19,
        maxZoom: 25
      },
      icon: {
        red: L.icon({iconUrl: require('@/assets/markers/marker-icon-red.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        grey: L.icon({iconUrl: require('@/assets/markers/marker-icon-grey.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        green: L.icon({iconUrl: require('@/assets/markers/marker-icon-green.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        blue: L.icon({iconUrl: require('@/assets/markers/marker-icon-blue.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        black: L.icon({iconUrl: require('@/assets/markers/marker-icon-black.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        orange: L.icon({iconUrl: require('@/assets/markers/marker-icon-orange.png'), iconSize: [25, 41], iconAnchor: [12, 41]})
      },
      selectedNode: null,
      newEdgeMarker: null
    }
  },
  methods: {
    getSensorsType (node) {
      if (node.reconstructed_gps_pos !== null) {
        return 'reconstructed_'
      } else {
        return 'original_'
      }
    },
    getLatLng (node) {
      if (node === undefined) {
        return {
          lat: 0,
          lng: 0
        }
      }
      let sensorsType = this.getSensorsType(node)
      return {
        lat: node[sensorsType + 'gps_pos'].coordinates[0],
        lng: node[sensorsType + 'gps_pos'].coordinates[1]
      }
    },
    getIcon (node, index) {
      if (this.selectedNode === index) {
        return this.icon.red
      } else if (node.disabled) {
        return this.icon.grey
      } else if (node.hotspot) {
        return this.icon.green
      } else if (node.endpoint) {
        return this.icon.orange
      } else {
        return this.icon.blue
      }
    },
    selectNode (index) {
      let mode = this.$parent.$parent.$parent.$refs.parameter.mode
      if (mode === 'view') {
        this.$emit('node:selected', this.node[index])
        this.selectedNode = index
      } else if (mode === 'hotspot') {
        this.$set(this.node[index], 'hotspot', !this.node[index].hotspot)
      } else if (mode === 'delete') {
        this.$set(this.node[index], 'disabled', !this.node[index].disabled)
      } else if (mode === 'endpoint') {
        this.$set(this.node[index], 'endpoint', !this.node[index].endpoint)
      } else if (mode === 'edge') {
        if (this.newEdgeMarker === null) {
          this.newEdgeMarker = this.node[index]
        } else {
          this.edge.push({
            source_path_node: {
              id_path_node: this.newEdgeMarker.id_path_node,
              id_malette: this.newEdgeMarker.id_malette
            },
            dest_path_node: {
              id_path_node: this.node[index].id_path_node,
              id_malette: this.node[index].id_malette
            },
            path_details: {
              id_path_details: this.path_details.id_path_details,
              id_malette: this.path_details.id_malette
            }
          })
          this.newEdgeMarker = null
        }
      }
    },
    selectEdge (index) {
      let mode = this.$parent.$parent.$parent.$refs.parameter.mode
      if (mode === 'deleteedge') {
        this.edge.splice(index)
      }
    }
  },
  computed: {
    center () {
      let pos = L.latLng(0, 0)
      let sensorsType

      if (this.node.length > 0) {
        var i = 0
        sensorsType = this.getSensorsType(this.node[i])
        while (this.node[i][sensorsType + 'gps_pos'].coordinates[0] === 0 && this.node[i][sensorsType + 'gps_pos'].coordinates[1] === 0) {
          i++
          sensorsType = this.getSensorsType(this.node[i])
          if (i >= this.node.length) {
            break
          }
        }
        pos = L.latLng(this.node[i][sensorsType + 'gps_pos'].coordinates[0], this.node[i][sensorsType + 'gps_pos'].coordinates[1])
      }
      return pos
    },
    nodeDict () {
      let dict = {}
      for (let node in this.node) {
        node = this.node[node]
        dict[node.id_path_node] = node
      }
      return dict
    }
  }
}
</script>
