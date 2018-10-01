<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title>{{ campaign.name }}</v-toolbar-title>
    <v-toolbar-title>{{ campaign.id_campaign }} - {{ campaign.id_malette }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-title>Assembled : {{ assemledPourcent }}%</v-toolbar-title>
    <v-toolbar-title>Geoloc : {{ geolocPourcent }}%</v-toolbar-title>
    <v-toolbar-title @click='calculateCompletPourcent()'>Complet : {{ completPourcent }}</v-toolbar-title>
    <Menu></Menu>
  </v-toolbar>
</template>

<script>
import ApiManager from '@/apiManager'
import Config from '@/config.json'
import Menu from '@/components/Menu'

export default {
  name: 'CampaignInfo',
  props: ['lots', 'campaign'],
  components: {
    Menu
  },

  data () {
    return {
      pictureNumber: [],
      canUse: false,
      completLot: null,
      minPic: Config.picture
    }
  },

  watch: {
    lots: function () {
      this.canUse = true
    }
  },
  computed: {
    assemledPourcent: function () {
      var value = 0
      if (this.canUse === true) {
        for (var i in this.lots) {
          i = this.lots[i]
          if (i.tile.id_tile != null) { value++ }
        }
        value = Math.round(value / this.lots.length * 100)
      }

      return value
    },
    geolocPourcent: function () {
      var value = 0
      if (this.canUse === true) {
        for (var i in this.lots) {
          i = this.lots[i].sensors
          if (i.gps_pos.coordinates[0] !== 0 && i.gps_pos.coordinates[1] !== 0 && i.gps_pos.coordinates[2] !== 0) { value++ }
        }
        value = Math.round(value / this.lots.length * 100)
      }

      return value
    },
    completPourcent: function () {
      if (this.completLot == null) {
        return 'Click to compute'
      } else {
        return Math.round(this.completLot / this.lots.length * 100) + '%'
      }
    }
  },
  methods: {
    calculateCompletPourcent: function () {
      this.completLot = 0
      for (var i in this.lots) {
        this.isComplet(this.lots[i])
      }
    },
    isComplet: function (lot) {
      ApiManager.getLotPicturesPath(lot.pictures_path)
        .then(answer => {
          if (answer.data.length === 6) {
            this.completLot++
          } else {
            this.setBad(lot)
          }
        })
        .catch(answer => {
          this.setBad(lot)
        })
    },
    setBad: function (lot) {
      console.log('Setting bad for : ', lot.id_lot)
      lot.isComplet = false
      this.$parent.$parent.$parent.$refs.lotList.setIncomplet(lot.id_lot)
      this.$parent.$parent.$parent.$refs.map.setIncomplet(lot.id_lot)
    }
  }
}
</script>

<style>
.column{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
