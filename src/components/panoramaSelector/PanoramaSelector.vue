<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs7>
          <v-card class="elevation-12" width="1100px" height="780px">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Panorama selector for campaign : {{id_campaign}} - {{id_malette}} </v-toolbar-title>
              <v-spacer></v-spacer>
              <Menu></Menu>
            </v-toolbar>
              <template v-if="dataLoaded">
                <v-toolbar>
                  <v-btn flat :disabled="!memento.canUndo" v-on:click="memento.undo()">
                    <v-icon>undo</v-icon>
                  </v-btn>
                  <v-btn flat :disabled="!memento.canRedo" v-on:click="memento.redo()">
                    <v-icon>redo</v-icon>
                  </v-btn>
                  <v-divider vertical></v-divider>
                  <v-btn flat :disabled="!hasPrevLot" v-on:click="goToPrevLotMem()">
                    <v-icon>keyboard_arrow_left</v-icon>
                  </v-btn>
                  <v-divider vertical></v-divider>
                    <v-text-field v-model="currentLotKey" label="lot ids"></v-text-field>
                    <span style="display: inline-block; width: 290px;">
                      <v-overflow-btn :items="currentPanos" hide-details value='Pano 10-42 (1/2)' full-width></v-overflow-btn>
                    </span>
                    <v-checkbox flat
                        :label="`${active===true ? 'active' : 'disable'}`"
                        v-model="active"
                        hide-details
                    ></v-checkbox>
                  <v-btn flat>
                    <v-icon>camera</v-icon>
                  </v-btn>
                  <v-divider vertical></v-divider>
                  <v-btn flat :disabled="!hasNextLot" v-on:click="goToNextLotMem()">
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-img src="http://opv_master:5050/v1/files/POC-432-0f679038-a92d-11e8-8a4a-00163e22b7fe/panorama.jpg"></v-img>
                <v-card style="height: 25vh">
                  <l-map ref='map' :zoom='zoom' :center='center' style="height: 100%">
                    <l-tile-layer ref="test" :url='url' :options='tileOption' :attribution='attribution'></l-tile-layer>
                  </l-map>
                </v-card>
              </template>
              <template v-else>
                <v-container fill-height>
                  <v-layout row wrap align-center>
                    <v-flex class="text-xs-center">
                      Chargement des données <br>
                      <v-progress-circular :size="50" indeterminate color="primary"></v-progress-circular>
                    </v-flex>
                  </v-layout>
                </v-container>
              </template>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import ApiManager from '@/apiManager'
import '@/../node_modules/leaflet/dist/leaflet.css'
import { LMap, LMarker, LPopup, LTileLayer } from 'vue2-leaflet'
import L from 'leaflet'
import Menu from '@/components/Menu'
import Memento from '@/helpers/memento'

export default {
  name: 'PanoramaSelector',
  props: ['id_campaign', 'id_malette'],
  components: {
    Menu,
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      currentPanos: [ 'Pano 10-42 (1/2)', 'Pano 30-42 (2/2)' ],
      zoom: 19,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileOption: {
        maxNativeZoom: 19,
        maxZoom: 25
      },
      center: L.latLng(48.6312, -4.5427),
      dataLoaded: false,
      lots: [],
      active: true,
      currentLotIndex: -1,
      panoramasCache: {} // Map lot id_lot-id_malette to their list of panoramas if they have one or null
    }
  },
  async created () {
    this.lots = (await ApiManager.getCampaignLotsWithSensors(this.id_campaign)).data.objects;
    this.currentLotIndex = 0;
    this.dataLoaded = true;
    this.memento = new Memento(); // Undo/redo processor
  },
  computed: {
    /**
     * The current lot.
     */
    currentLot () {
      return (this.currentLotIndex >= 0) ? this.lots[this.currentLotIndex] : null;
    },

    /**
     * The current lot key (representation).
     */
    currentLotKey: {
      get: function () {
        return (this.currentLot) ? this.keyFromLot(this.currentLot) : null;
      },
      set: function (wantedKey) {
        const i = this.lotIndexFromKey(wantedKey);

        if (i) {
          this.currentLotIndex = i;
        }
      }
    },

    /**
     * Tells if there is a next lot.
     */
    hasNextLot () {
      return this.currentLotIndex + 1 < this.lots.length;
    },

    /**
     * Tells if there is a previus lot;
     */
    hasPrevLot () {
      return this.currentLotIndex - 1 >= 0;
    }
  },
  asyncComputed: {
    /**
     * Panoramas associated to the current lot.
     * Migth be empty.
     * Panoramas are cached.
     */
    async panoramas () {
      const lotKey = this.currentLotKey; // copy current key to ensure it doesn't change during requesting process

      if (!lotKey) {
        return null;
      }

      if (this.panoramasCache[lotKey]) {
        return this.panoramasCache[lotKey]
      }

      // Getting control points
      const panoramas = []
      for (const cpIds of this.currentLot.cps) {
        const cp = (await ApiManager.getCp(cpIds.id_cp, cpIds.id_malette)).data

        // Getting all pano for each cp
        if (cp && cp.panorama) {
          for (const panoIds of cp.panorama) {
            const panorama = (await ApiManager.getPanorama(panoIds.id_panorama, panoIds.id_malette)).data
            panoramas.push(panorama)
          }
        }
      }
      this.panoramasCache[lotKey] = panoramas;

      return this.panoramasCache[lotKey];
    }
  },
  methods: {
    /**
     * Generate key from lot.
     * @param {Lot} lot a lot.
     */
    keyFromLot: function (lot) {
      return `${lot.id_lot}-${this.currentLot.id_malette}`;
    },

    /**
     * Find index from key.
     */
    lotIndexFromKey: function (key) {
      if (!key.indexOf('-')) {
        return;
      }

      const [idLotStr, idMaletteStr] = key.split('-');
      const [idLot, idMalette] = [parseInt(idLotStr), parseInt(idMaletteStr)];

      for (let i = 0; i < this.lots.length; i++) {
        const l = this.lots[i];

        if (l.id_lot === idLot && l.id_malette === idMalette) {
          return i;
        }
      }
    },

    /**
     * Go to next lot.
     */
    goToNextLot: function () {
      if (this.hasNextLot) {
        this.currentLotIndex++;
      }
    },

    /**
     * Go to previous lot.
     */
    goToPrevLot: function () {
      if (this.hasPrevLot) {
        this.currentLotIndex--;
      }
    },

    /**
     * Go to next lot with memento.
     */
    goToNextLotMem: function () {
      const cmd = {
        do: () => { this.goToNextLot() },
        undo: () => { this.goToPrevLot() }
      }
      this.memento.execute(cmd);
    },

    /**
     * Go to previous lot with memento.
     */
    goToPrevLotMem: function () {
      const cmd = {
        do: () => { this.goToPrevLot() },
        undo: () => { this.goToNextLot() }
      }
      this.memento.execute(cmd);
    }
  }
}
</script>
