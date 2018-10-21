<template>
  <v-card>
    <v-toolbar dark color="primary"><v-toolbar-title>Filter</v-toolbar-title></v-toolbar>
    <v-list>
      <v-list-tile><v-list-tile-content><v-checkbox label='active' v-model="active" :color="lotIcons.active"></v-checkbox></v-list-tile-content></v-list-tile>
      <v-list-tile><v-list-tile-content><v-checkbox label='inactive' v-model="inactive" :color="lotIcons.inactive"></v-checkbox></v-list-tile-content></v-list-tile>
      <v-list-tile><v-list-tile-content><v-checkbox label='no active state' v-model="noState" color='purple'></v-checkbox></v-list-tile-content></v-list-tile>
      <v-list-tile><v-list-tile-content><v-checkbox label='tiled' v-model="tiled" :color="lotIcons.stitched"></v-checkbox></v-list-tile-content></v-list-tile>
      <v-list-tile><v-list-tile-content><v-checkbox label='no tiles' v-model="noTiles" :color="lotIcons.unstitched"></v-checkbox></v-list-tile-content></v-list-tile>
    </v-list>
  </v-card>
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
  created () {
    const p = this.predicate; // to compute and initiate the predicate
    return p;
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
