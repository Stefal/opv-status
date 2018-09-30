<template>
  <v-card style="height: 100%">
    <l-map ref='map' :zoom='zoom' :center='center' style="height: 100%">
      <l-tile-layer ref="test" :url='url' :options='tileOption' :attribution='attribution'></l-tile-layer>
      <l-rotated-marker :rotationAngle="180 + lot.sensors.degrees + 90" v-for="lot in lots" :key="lot.id_lot"  :options='{sensors: lot.sensors}' :draggable="true" :icon='genIcon(lot)' :lat-lng='genCord(lot.sensors)' v-on:click='clicked(lot)' @dragend='markerMove'></l-rotated-marker>
    </l-map>
  </v-card>
</template>

<script>
import '@/../node_modules/leaflet/dist/leaflet.css'
import { LMap, LPopup, LTileLayer, LPolyline } from 'vue2-leaflet'
import LRotatedMarker from 'vue2-leaflet-rotatedmarker'
import L from 'leaflet'
import ApiManager from '@/apiManager'

export default {
  name: 'MapCampaign',
  props: ['lots'],
  components: {
    LMap,
    LTileLayer,
    LPopup,
    LPolyline,
    LRotatedMarker
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
      badLot: []
    }
  },
  methods: {
    genCord (elmt) {
      var cord = L.latLng(elmt.gps_pos.coordinates[0], elmt.gps_pos.coordinates[1])
      return cord
    },
    genIcon (lot) {
      var icon = L.icon({iconUrl: require('@/assets/marker_not_assembled.png'), iconSize: [40, 40], iconAnchor: [20, 20]})
      if (lot.tile.id_tile != null) {
        icon.options.iconUrl = require('@/assets/marker_assembled.png')
      }
      if (lot.id_lot in this.badLot) {
        icon.options.iconUrl = require('@/assets/marker_not_full.png')
      }
      return icon
    },
    clicked (elmt) {
      this.$refs.map.setCenter(L.latLng(elmt.sensors.gps_pos.coordinates[0], elmt.sensors.gps_pos.coordinates[1]))
      this.$parent.$parent.$parent.$refs.lotInfo.setLot(elmt)
    },
    setIncomplet (id) {
      this.badLot.push(id)
    },
    markerMove (event) {
      var pos = event.target.getLatLng()
      var newSensors = event.target.options.sensors
      newSensors.gps_pos.coordinates[0] = pos.lat
      newSensors.gps_pos.coordinates[1] = pos.lng
      ApiManager.putSensors(newSensors)
    }
  },
  computed: {
    center () {
      var pos = L.latLng(0, 0)

      if (this.lots.length > 0) {
        var i = 0
        while (this.lots[i].sensors.gps_pos.coordinates[0] === 0 && this.lots[i].sensors.gps_pos.coordinates[1] === 0) {
          i++
          if (i >= this.lots.length) {
            break
          }
        }
        pos = L.latLng(this.lots[i].sensors.gps_pos.coordinates[0], this.lots[i].sensors.gps_pos.coordinates[1])
      }
      return pos
    }
  }
}
</script>
