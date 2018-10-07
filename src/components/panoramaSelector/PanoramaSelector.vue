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
                    <v-text-field v-model="currentLotKey" label="lot ids" hide-details></v-text-field>
                    <span style="display: inline-block; width: 290px;">
                        <v-select
                          :items="panoramas"
                          :item-text="(panorama) => { return `${panorama.id_panorama}-${panorama.id_malette}` }"
                          :item-value="(panorama) => { return panorama }"
                          v-model="selectedPanoramaMem"
                          hide-details
                          label="Panorama"
                          v-if="hasPanoramas"
                        ></v-select>
                      <span v-else>No panorama</span>
                    </span>
                  <template v-if="currentPanorama">
                    <v-checkbox flat
                        :label="`${activeStateMem===true ? 'active' : (activeStateMem == null) ? 'no set' : 'disable'}`"
                        v-model="activeStateMem"
                        hide-details
                        :indeterminate="activeStateMem == null"
                    ></v-checkbox>
                    <v-btn flat :to="'/viewer/'+currentPanorama.tiles[0].id_tile+'/'+currentPanorama.tiles[0].id_malette">
                      <v-icon>camera</v-icon>
                    </v-btn>
                  </template>
                  <v-divider vertical></v-divider>
                  <v-btn flat :disabled="!hasNextLot" v-on:click="goToNextLotMem()">
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-img :src="currentEquirectangularPath+'?width=1100'" v-if="currentPanorama"></v-img>
                <v-container v-else>
                  <v-layout row wrap align-center>
                    <v-flex class="text-xs-center">
                      <div style="height:550px">Pas de panorama pour ce lot</div>
                    </v-flex>
                  </v-layout>
                </v-container>
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
      active: null,
      currentLotIndex: -1,
      panoramasCache: {}, // Map lot id_lot-id_malette to their list of panoramas if they have one or null
      currentPanorama: null,
      activeChangeStateFailed: false
    }
  },
  async created () {
    const lots = (await ApiManager.getCampaignLotsWithSensors(this.id_campaign)).data.objects;
    lots.sort((la, lb) => { return (la.id_lot < lb.id_lot) ? -1 : 1; }); // As lot aren't correctly sorted
    this.lots = lots;
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
          this.goToLotIndexMem(i); // Keep it in memento
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
    },

    /**
     * Tells if the current lot as panorama.
     */
    hasPanoramas () {
      return this.panoramas && this.panoramas.length > 0;
    },

    /**
     * Current panorama http equirectangular path.
     */
    currentEquirectangularPath () {
      return this.getEquirectangularPath(this.currentPanorama);
    },

    /**
     * Current active state for currentPanorama, when setted will save it to database (roll back if it fails).
     * It's based on internal event to handle asynchronous calls.
    */
    activeStateMem: {
      get: function () {
        return (this.currentPanorama) ? this.currentPanorama.active : null;
      },
      set: function (newState) {
        this.changePanoramaActiveStateMem(this.currentPanorama, newState, this.currentLot);
      }
    },

    /**
     * Return currentPanorama and use memento when it's changed.
     */
    selectedPanoramaMem: {
      get: function () {
        return this.currentPanorama;
      },
      set: function (requestedPanorama) {
        const curP = this.currentPanorama;
        const cmd = {
          do: () => { this.currentPanorama = requestedPanorama },
          undo: () => { this.currentPanorama = curP }
        }
        this.memento.execute(cmd);
      }
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

      const panoramas = await this.getPanoramas(this.currentLot);

      this.currentPanorama = (this.panoramasCache[lotKey].length > 0) ? this.panoramasCache[lotKey][0] : null; // resetting current panorama to the first one

      return panoramas;
    }
  },
  methods: {

    /**
     * Get panoramas from cache of server for a lot.
     * @param {Lot} lot The lot.
     */
    getPanoramas: async function (lot) {
      const lotKey = this.keyFromLot(lot); // copy current key to ensure it doesn't change during requesting process
      const panoramas = [];

      if (!lotKey) {
        return null;
      }

      if (!this.panoramasCache[lotKey]) {
        // Getting contcurrentLotIndexrol points
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
      }

      return this.panoramasCache[lotKey];
    },

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
     * Go to ngoToLotIndexMemext lot with memento.
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
    },

    /**
     * Go to specific lot index.
     * @param {number} lotIndex Lot index.
     */
    goToLotIndexMem: function (lotIndex) {
      const oldLotIndex = this.currentLotIndex;
      const cmd = {
        do: () => { this.currentLotIndex = lotIndex; },
        undo: () => { this.currentLotIndex = oldLotIndex; }
      };
      this.memento.execute(cmd);
    },

    /**
     * Returns equirectangular path.
     * @param {Panorama} The panorama object.
     */
    getEquirectangularPath: function (panorama) {
      return ApiManager.dirHttpPath(panorama.equirectangular_path) + '/panorama.jpg';
    },

    /**
     * Change the panorama active state with memento.
     */
    changePanoramaActiveStateMem: async function (panorama, newActiveState, associatedLot) {
      const oldActiveState = panorama.active;
      const cmd = {
        do: async () => {
          panorama.active = newActiveState
          await ApiManager.putPanorama(panorama);
          await this.refreshLotActiveState(associatedLot);
        },
        undo: async () => {
          panorama.active = oldActiveState
          await ApiManager.putPanorama(panorama);
          await this.refreshLotActiveState(associatedLot);
        }
      };
      await this.memento.executeAsync(cmd);
    },

    /**
     * Set lot active state. Will be active if it as active (undetermined panoramas).
     * @param {Lot} lot Lot that will be refreshed.
     */
    refreshLotActiveState: async function (lot) {
      const panoramas = await this.getPanoramas(lot);
      let hasActiveOrNullPanorama = false;

      for (let i = 0; i < panoramas.length; i++) {
        if (panoramas[i].active === true || panoramas[i].active === null) {
          hasActiveOrNullPanorama = true;
          break;
        }
      }

      if (lot.active !== hasActiveOrNullPanorama) { // updating lot active state if it changed
        lot.active = hasActiveOrNullPanorama;
        await ApiManager.putLot(lot);
      }
    }
  }
}
</script>
