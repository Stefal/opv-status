<template>
   <v-card class="scroll-y">
     <v-toolbar dark color="primary">
       <v-toolbar-title>Lot list</v-toolbar-title>
     </v-toolbar>
     <v-list>
      <v-list-tile v-for="lot in lots" :key="lot.id_lot" @click="emitSelectedLot(lot)">
        <v-list-tile-content>
          {{lot.id_lot}}
        </v-list-tile-content>
        <v-icon :ref="lot.id_lot" v-if="lot === selectedLot" v-bind:color="lotIcons.selected">camera</v-icon>
        <v-icon :ref="lot.id_lot" v-else-if="lot.active === false" v-bind:color="lotIcons.inactive">camera</v-icon>
        <v-icon :ref="lot.id_lot" v-else-if="lot.active === true" v-bind:color="lotIcons.active">camera</v-icon>
        <v-icon :ref="lot.id_lot" v-else-if="lot.isComplet === false" v-bind:color="lotIcons.uncomplete">camera</v-icon>
        <v-icon :ref="lot.id_lot" v-else-if="lot.tile.id_tile != null" v-bind:color="lotIcons.stitched">camera</v-icon>
        <v-icon :ref="lot.id_lot" v-else v-bind:color="lotIcons.unstitched">camera</v-icon>
      </v-list-tile>
    </v-list>
   </v-card>
</template>

<script>
export default {
  name: 'LotList',
  props: {
    lots: {
      type: Array,
      default: () => []
    },
    selectedLot: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      lotIcons: {
        selected: 'red',
        inactive: 'grey',
        active: 'green',
        stitched: 'blue',
        unstitched: 'black',
        uncomplete: 'orange'
      }
    }
  },
  methods: {
    setIncomplet: function (id) {
      this.$refs[id][0].classList.remove('blue--text')
      this.$refs[id][0].classList.add('red--text')
    },

    /**
     * Triggered when a lot is selected, will pass the information to the parent component.
     * @param lot The new selected lot.
     */
    emitSelectedLot (lot) {
      // to respect VueJS logic we are giving parent the choice to update or not, we don't want to mutate the parent
      this.$emit('update:selected-lot', lot)
    }
  }
}
</script>
