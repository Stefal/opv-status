<template>
   <div>
     <h2>Lot list :</h2>
     <ul>
       <li v-for="lot in lots" v-bind:style="{ backgroundColor: color(lot) }" v-bind:ref="lot.id_lot" v-bind:key="lot.id_lot">{{lot.id_lot}}
         <router-link v-if="lot.tile.id_tile !== null" :to="'/viewer/' + lot.tile.id_tile + '/' + lot.id_malette">See pano</router-link>
         <span v-on:click="clicked(lot)">See</span>
       </li>
     </ul>
   </div>
</template>

<script>
import Config from '@/config.json'

export default {
  name: 'LotList',
  props: ['lots'],
  data () {
    return {}
  },
  methods: {
    color: function (elmt) {
      if (elmt.tile.id_tile == null) {
        return Config.color.unassembled
      }
      return Config.color.assembled
    },
    setIncomplet: function (id) {
      // this.$refs[id][0].className = 'uncomplet'
      this.$refs[id][0].style.backgroundColor = Config.color.not_full
      console.log(this.$refs[id][0].style.backgroundColor)
    },
    clicked: function (lot) {
      this.$parent.$refs.lotInfo.setLot(lot)
    }
  }
}
</script>
