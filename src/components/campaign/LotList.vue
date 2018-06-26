<template>
   <v-card style="height: 80.5vh" class="scroll-y">
     <v-toolbar dark color="primary">
       <v-toolbar-title>Lot list</v-toolbar-title>
     </v-toolbar>
     <v-list>
      <v-list-tile v-for="lot in lots" :key="lot.id_lot" @click="clicked(lot)">
        <v-list-tile-content>{{lot.id_lot}}</v-list-tile-content>
        <v-icon :ref="lot.id_lot" v-if="lot.tile.id_tile !== null" color="green">camera</v-icon>
        <v-icon :ref="lot.id_lot" v-else color="blue">camera</v-icon>
      </v-list-tile>
    </v-list>
   </v-card>
</template>

<script>
export default {
  name: 'LotList',
  props: ['lots'],
  data () {
    return {}
  },
  methods: {
    setIncomplet: function (id) {
      this.$refs[id][0].classList.remove('blue--text')
      this.$refs[id][0].classList.add('red--text')
    },
    clicked: function (lot) {
      this.$parent.$parent.$parent.$refs.lotInfo.setLot(lot)
    }
  }
}
</script>
