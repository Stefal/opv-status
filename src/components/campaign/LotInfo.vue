<template>
   <v-card v-if="lot !== null">
       <v-card-text>
         <v-layout row wrap>
         <v-layout row wrap class="mr-1">
           <img v-for="i in img" :key="i" :src="i" class="apn">
         </v-layout>
         <v-card>
           <v-toolbar dark color="primary">
             <v-toolbar-title>Lot : {{lot.id_lot}}</v-toolbar-title>
             <v-spacer></v-spacer>
             <router-link v-if="lot.tile.id_tile !== null" :to="'/viewer/' + lot.tile.id_tile + '/' + lot.id_malette"><v-icon>panorama_horizontal</v-icon></router-link>
           </v-toolbar>
           <v-list>
             <v-list-tile>
               <v-list-tile-content>Date :</v-list-tile-content>
               <v-list-tile-content class="align-end">{{lot.takenDate}}</v-list-tile-content>
             </v-list-tile>
             <v-list-tile>
               <v-list-tile-content>Gps cord :</v-list-tile-content>
               <v-list-tile-content class="align-end">{{lot.sensors.gps_pos.coordinates}}</v-list-tile-content>
             </v-list-tile>
             <v-list-tile>
                 <v-list-tile-content>Active :</v-list-tile-content>
                 <v-list-tile-content class="align-end">{{lot.active}}</v-list-tile-content>
               </v-list-tile>
           </v-list>
         </v-card>
         </v-layout>
     </v-card-text>
   </v-card>
</template>

<script>
import Config from '@/config.json'

export default {
  name: 'LotInfo',
  props: {
    lot: { // Currently selectedLot
      type: Object,
      default: null
    }
  },
  data () {
    return {
      lot: null,
      img: [],
      imgNb: Config.picture,
      picturesPath: Config.server.host + ':' + Config.server.dm_port + '/v1/files/'
    }
  },
  computed: {
    /**
     *Get images details for currently selected lot.
    */
    img () {
      const imgs = []

      if (this.lot == null) return imgs

      for (var i = 0; i < this.imgNb; i++) {
        imgs.push((this.picturesPath + this.lot.pictures_path + '/APN' + i + '.JPG'))
      }

      return imgs
    }
  }
}
</script>

<style scoped>
.apn{
  max-height: 23vh;
  max-width: calc(45vw / 6)
}
</style>
