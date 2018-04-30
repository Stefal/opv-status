<template>
  <div>
    <l-map ref="map" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="cord in sensors" :key="cord.id_sensors" :lat-lng="genCord(cord)" :icon="icon(cord)" v-on:click="clicked(cord)"></l-marker>
    </l-map>
  </div>
</template>

<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import L from 'leaflet'

export default {
  name: 'MapCampaign',
  props: ['campaign', 'sensors', 'lots'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      zoom: 13,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  methods: {
    genCord (elmt) {
      var cord = L.latLng(elmt.gps_pos.coordinates[0], elmt.gps_pos.coordinates[1])
      return cord
    },
    clicked (elmt) {
      this.$refs.map.setCenter(L.latLng(elmt.gps_pos.coordinates[0], elmt.gps_pos.coordinates[1]))
      this.$parent.$refs.lotInfo.setLot(this.lots[elmt.lot.id_lot])
    },
    icon (elmt) {
      var icon = L.icon({iconUrl: require('../assets/marker_not_assembled.png'), iconSize: [40, 40], iconAnchor: [20, 20]})
      if (this.lots[elmt.lot.id_lot].tile.id_tile !== null) {
        icon.options.iconUrl = require('../assets/marker_assembled.png')
      }
      return icon
    }
  },
  computed: {
    center () {
      var pos = L.latLng(0, 0)

      if (this.campaign.lots != null) {
        if (this.sensors.length >= this.campaign.lots.length) {
          var i = 0
          while (this.sensors[i].gps_pos.coordinates[0] === 0 && this.sensors[i].gps_pos.coordinates[1] === 0) {
            i++
            if (i >= this.sensors.length) {
              break
            }
          }
          pos = L.latLng(this.sensors[i].gps_pos.coordinates[0], this.sensors[i].gps_pos.coordinates[1])
        }
      }
      return pos
    }
  }
}
</script>
