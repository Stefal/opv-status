<template>
  <div>
    <l-map ref='map' :zoom='zoom' :center='center'>
      <l-tile-layer :url='url' :attribution='attribution'></l-tile-layer>
      <l-marker v-for='lot in lots' :ref="lot.id_lot" :key='lot.id_lot' :lat-lng='genCord(lot.sensors)' :icon='icon(lot)' v-on:click='clicked(lot)'></l-marker>
    </l-map>
  </div>
</template>

<script>
import '@/../node_modules/leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import L from 'leaflet'

export default {
  name: 'MapCampaign',
  props: ['lots'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      zoom: 19,
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
      this.$refs.map.setCenter(L.latLng(elmt.sensors.gps_pos.coordinates[0], elmt.sensors.gps_pos.coordinates[1]))
      this.$parent.$refs.lotInfo.setLot(elmt)
    },
    icon (elmt) {
      var icon = L.icon({iconUrl: require('@/assets/marker_not_assembled.png'), iconSize: [40, 40], iconAnchor: [20, 20]})
      if (elmt.tile.id_tile !== null) {
        icon.options.iconUrl = require('@/assets/marker_assembled.png')
      }
      return icon
    },
    setIncomplet (id) {
      this.$refs[id][0].icon = L.icon({iconUrl: require('@/assets/marker_not_full.png'), iconSize: [40, 40], iconAnchor: [20, 20]})
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
