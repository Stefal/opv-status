<template>
   <div>
     <h1>Campaign : {{ campaign.id_campaign }}-{{ campaign.id_malette }} -->  {{ campaign.name }}</h1>
     <p>Assembled : {{ assemledPourcent }}% Geoloc : {{ geolocPourcent }}% <span v-on:click='calculateCompletPourcent()'>Complet : {{ completPourcent }}</span></p>
   </div>
</template>

<script>
import ApiManager from '@/apiManager'

export default {
  name: 'CampaignInfo',
  props: ['lots', 'campaign'],

  data () {
    return {
      pictureNumber: [],
      canUse: false,
      completLot: null,
      minPic: 6
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
      ApiManager.getLotPicturesPath(lot.pictures_path).then(answer => {
        if (answer.data.length >= this.minPic) {
          this.completLot++
        } else {
          this.$parent.$refs.map.setIncomplet(lot.id_lot)
          this.$parent.$refs.lotList.setIncomplet(lot.id_lot)
        }
      })
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
