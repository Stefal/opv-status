<template>
  <v-card style="height: 100%">
    <l-map ref='map' :zoom='zoom' :center='center' style="height: 100%">
      <l-tile-layer :url='url' :attribution='attribution'></l-tile-layer>
      <l-circle-marker v-for='lot in lots' :ref="lot.id_lot" :key='lot.id_lot' :lat-lng='genCord(lot.sensors)' :fillColor='color(lot)' :color='color(lot)' v-on:click='clicked(lot)'></l-circle-marker>
    </l-map>
  </v-card>
</template>

<script>
import '@/../node_modules/leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LCircleMarker, LPopup } from 'vue2-leaflet'
import L from 'leaflet'
import Config from '@/config.json'

export default {
  name: 'MapCampaign',
  props: ['lots'],
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
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
      this.$parent.$parent.$parent.$refs.lotInfo.setLot(elmt)
    },
    color (elmt) {
      var color = Config.color.assembled

      if (elmt.tile.id_tile == null) {
        color = Config.color.unassembled
      }

      return color
    },
    setIncomplet (id) {
      this.$refs[id][0].setColor(Config.color.not_full)
      this.$refs[id][0].setFillColor(Config.color.not_full)
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
