<template>
    <v-container grid-list-md style="padding-top:0px; padding-bottom:0px;">
        <v-layout row align-center>
            <v-flex xs6>
                <b>Filters lots</b>
            </v-flex>
            <v-flex xs6><v-checkbox label='active' v-model="active" :color="lotIcons.active"></v-checkbox></v-flex>
            <v-flex xs6><v-checkbox label='inactive' v-model="inactive" :color="lotIcons.inactive"></v-checkbox></v-flex>
            <v-flex xs6><v-checkbox label='no active state' v-model="noState" color='black'></v-checkbox></v-flex>
            <v-flex xs6><v-checkbox label='tiled' v-model="tiled" :color="lotIcons.stitched"></v-checkbox></v-flex>
            <v-flex xs6><v-checkbox label='no tiles' v-model="noTiles" :color="lotIcons.unstitched"></v-checkbox></v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: 'LotFilters',
  props: [],
  data () {
    return {
      lotIcons: {
        selected: 'red',
        inactive: 'grey',
        active: 'green',
        stitched: 'blue',
        unstitched: 'black'
      },
      active: true,
      inactive: true,
      noState: true,
      tiled: true,
      noTiles: true
    }
  },
  computed: {
    /**
     * This predicate is used to tell if a lot should be display (if it returns true lot should be displayed).
     * It should be catch by the parent and used in the rest of the page.
     */
    predicate () {
      const predicate = (lot) => {
        return ((this.active && lot.active === true) || (this.inactive && lot.active === false) || (this.noState && lot.active == null)) &&
          ((this.tiled && lot.tile.id_tile != null) || (this.noTiles && lot.tile.id_tile == null))
      }

      this.$emit('update:predicate', predicate)

      return predicate
    }
  }
}
</script>
