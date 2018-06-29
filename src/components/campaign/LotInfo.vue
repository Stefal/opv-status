<template>
   <v-card v-if="lot !== null">
     <v-card-text>
       <v-layout row wrap>
         <v-flex>
           <img v-for="i in img" v-bind:key="i" v-bind:src="i" class="apn">
         </v-flex>
         <v-flex>
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
             </v-list>
           </v-card>
         </v-flex>
       </v-layout>
     </v-card-text>
   </v-card>
</template>

<script>
import Config from '@/config.json'

export default {
  name: 'LotInfo',
  data () {
    return {
      lot: null,
      img: [],
      imgNb: Config.picture,
      picturesPath: Config.server.host + ':' + Config.server.dm_port + '/v1/files/'
    }
  },
  methods: {
    setLot (lot) {
      this.lot = lot
      this.img = []
      for (var i = 0; i < this.imgNb; i++) {
        this.img.push((this.picturesPath + lot.pictures_path + '/APN' + i + '.JPG'))
      }
    }
  }
}
</script>

<style>
.apn{
  height: 17vh;
}
</style>
