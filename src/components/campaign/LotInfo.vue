<template>
   <div v-if="lot !== null">
     <p>Lot : {{lot.id_lot}} | Date : {{lot.takenDate}} | Gps cord : {{lot.sensors.gps_pos.coordinates}} | <router-link v-if="lot.tile.id_tile !== null" :to="'/viewer/' + lot.tile.id_tile + '/' + lot.id_malette">See</router-link></p>
     <img v-for="i in img" v-bind:key="i" v-bind:src="i" class="apn">
   </div>
</template>

<script>
import Config from '@/config.json'

export default {
  name: 'LotInfo',
  data () {
    return {
      lot: null,
      img: [],
      imgNb: Config.picture
    }
  },
  methods: {
    setLot (lot) {
      this.lot = lot
      this.img = []
      for (var i = 0; i < this.imgNb; i++) {
        this.img.push(('http://opv_master:5050/v1/files/' + lot.pictures_path + '/APN' + i + '.JPG'))
      }
    }
  }
}
</script>

<style>
.apn{
  width: 150px;
}
</style>
