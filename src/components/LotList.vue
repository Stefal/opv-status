<template>
   <div>
     <h2>Lot list :</h2>
     <ul>
       <li v-for="lot in lots" v-bind:class="classToUse(lot)" v-bind:key="lot.id_lot">{{lot.id_lot}}</li>
     </ul>
   </div>
</template>

<script>
export default {
  name: 'LotList',
  props: ['lots'],
  data () {
    return {}
  },
  methods: {
    classToUse: function (elmt) {
      if (elmt.tile.id_tile == null) {
        return 'bad'
      }
      return 'good'
    }
  }
}
</script>

<style>
.bad{
  background-color: red;
}
.good{
  background-color: green;
}
</style>
