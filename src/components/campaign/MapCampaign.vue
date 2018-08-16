<template>
  <v-card style="height: 100%">
    <l-map ref='map' :zoom='zoom' :center='center' style="height: 100%">
      <l-tile-layer ref="test" :url='url' :options='tileOption' :attribution='attribution'></l-tile-layer>
      <l-marker v-for='lm in lotMarkers' :options='lm.options' :draggable="true" :key='lm.key' :icon='lm.icon' :lat-lng='lm.pos' v-on:click='emitSelectedLot(lm.lot)' @dragend='markerMove'></l-marker>
    </l-map>
  </v-card>
</template>

<script>
import '@/../node_modules/leaflet/dist/leaflet.css'
import { LMap, LMarker, LPopup, LTileLayer } from 'vue2-leaflet'
import L from 'leaflet'
import ApiManager from '@/apiManager'

export default {
  name: 'MapCampaign',
  props: {
    lots: {
      type: Array,
      default: () => []
    },
    selectedLot: {
      type: Object,
      default: null
    }
  },
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
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileOption: {
        maxNativeZoom: 19,
        maxZoom: 25
      },
      badLot: [],
      // -- Icon used to display lot depending on their state
      lotIcons: {
        selected: L.icon({iconUrl: require('@/assets/markers/marker-icon-red.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        inactive: L.icon({iconUrl: require('@/assets/markers/marker-icon-grey.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        active: L.icon({iconUrl: require('@/assets/markers/marker-icon-green.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        stitched: L.icon({iconUrl: require('@/assets/markers/marker-icon-blue.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        unstitched: L.icon({iconUrl: require('@/assets/markers/marker-icon-black.png'), iconSize: [25, 41], iconAnchor: [12, 41]})
      }
    }
  },
  methods: {
    /**
     * Triggered when a lot is selected, will pass the information to the parent component.
     * @param lot The new selected lot.
     */
    emitSelectedLot (lot) {
      // to respect VueJS logic we are giving parent the choice to update or not, we don't want to mutate the parent
      this.$emit('update:selected-lot', lot)
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
    },

    /**
     *Translate lot into markers, set the correct icon.
     */
    lotMarkers () {
      return this.lots.map(lot => {
        const lotIcon = (lot === this.selectedLot) ? this.$data.lotIcons.selected
          : (lot.active === false) ? this.$data.lotIcons.inactive
            : (lot.active === true) ? this.$data.lotIcons.active
              : (lot.tile.id_tile != null) ? this.$data.lotIcons.stitched
                : this.$data.lotIcons.unstitched

        const lotPos = L.latLng(lot.sensors.gps_pos.coordinates[0], lot.sensors.gps_pos.coordinates[1])

        return {
          options: {
            sensors: lot.sensors
          },
          icon: lotIcon,
          pos: lotPos,
          key: lot.id_lot + '-' + lot.id_malette,
          lot: lot
        }
      })
    }
  }
}
</script>
