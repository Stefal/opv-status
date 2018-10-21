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
    },
    memento: { // Memento to be used to track sensors motification actions
      type: Object,
      default: null
    },
    autoCenterOnSelected: { // Will automatically center the map on the selected lot
      type: Boolean,
      default: false
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
        unstitched: L.icon({iconUrl: require('@/assets/markers/marker-icon-black.png'), iconSize: [25, 41], iconAnchor: [12, 41]}),
        uncomplet: L.icon({iconUrl: require('@/assets/markers/marker-icon-orange.png'), iconSize: [25, 41], iconAnchor: [12, 41]})
      },
      refreshMarkers: false // Toggle it to refresh all markers
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
      const pos = event.target.getLatLng();
      const sensors = event.target.options.sensors;

      // Saving old/new coodinates (copy native values as we don't know how object are referenced in leaflet)
      const oldPosLat = sensors.gps_pos.coordinates[0];
      const oldPostLon = sensors.gps_pos.coordinates[1];
      const newPosLat = pos.lat;
      const newPostLon = pos.lng;

      const cmd = {
        do: () => {
          sensors.gps_pos.coordinates[0] = newPosLat;
          sensors.gps_pos.coordinates[1] = newPostLon;
          this.refreshMarkers = !this.refreshMarkers; // Ugly hack
          ApiManager.putSensors(sensors);
        },
        undo: () => {
          sensors.gps_pos.coordinates[0] = oldPosLat;
          sensors.gps_pos.coordinates[1] = oldPostLon;
          this.refreshMarkers = !this.refreshMarkers; // Ugly hack
          ApiManager.putSensors(sensors);
        }
      };

      if (this.memento !== null) { // Use memento if possible
        this.memento.execute(cmd);
      } else { // Directly execute command otherwise
        cmd.do();
      }
    }
  },
  computed: {
    center () {
      if (this.autoCenterOnSelected) {
        return L.latLng(this.selectedLot.sensors.gps_pos.coordinates[0], this.selectedLot.sensors.gps_pos.coordinates[1])
      } else {
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
    },

    /**
     *Translate lot into markers, set the correct icon.
     */
    lotMarkers () {
      console.log('lotMarkers')

      console.log('Refreshing markers : ', this.refreshMarkers)

      return this.lots.map(lot => {
        const lotIcon = (lot === this.selectedLot) ? this.$data.lotIcons.selected
          : (lot.active === false) ? this.$data.lotIcons.inactive
            : (lot.active === true) ? this.$data.lotIcons.active
              : (lot.isComplet === false) ? this.$data.lotIcons.uncomplet
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
