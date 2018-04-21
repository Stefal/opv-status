<template>
  <div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="cord in sensors" :key="cord.id_sensors" :lat-lng="genCord(cord)" :icon="icon">
        <l-popup :content="cord.lot.id_lot + '-' + cord.lot.id_malette"></l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import L from 'leaflet'

export default {
  name: 'MapCampaign',
  props: ['campaign', 'sensors'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      zoom: 13,
      center: L.latLng(48.390834, -4.485556),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  methods: {
    genCord (elmt) {
      var cord = L.latLng(elmt.gps_pos.coordinates[0], elmt.gps_pos.coordinates[1])
      return cord
    }
  },
  computed: {
    icon () {
      return L.icon({
        iconUrl: require('../assets/marker.png'),
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
    }
  }
}
</script>
