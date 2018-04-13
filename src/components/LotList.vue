<template>
   <div>
     <h2>Lot list :</h2>
     <ul>
       <li v-for="lot in campaign.lots" v-bind:key="lot.id_lot">{{lot.id_lot}}</li>
     </ul>
   </div>
</template>

<script>
export default {
  name: 'LotList',
  props: ['campaign'],
  data () {
    return {}
  }
}
</script>
