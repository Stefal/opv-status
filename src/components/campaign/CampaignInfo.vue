<template>
   <div>
     <h1>Campaign : {{ campaign.id_campaign }}-{{ campaign.id_malette }} -->  {{ campaign.name }}</h1>
     <p>Assembled : {{ assemledPourcent }}% Geoloc : {{ geolocPourcent }}% <span v-on:click='calculateCompletPourcent()'>Complet : {{ completPourcent }}%</span></p>
   </div>
</template>

<script>

export default {
  name: 'CampaignInfo',
  props: ['lots', 'campaign'],

  data () {
    return {
      pictureNumber: [],
      canUse: false,
      lotPicture: []
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
      if (this.lotPicture.length >= this.lots.length) {
        var completLot = 0
        for (var i in this.lotPicture) {
          i = this.lotPicture[i]
          if (i >= 6) {
            completLot++
          }
        }
        return Math.round(completLot / this.lots.length * 100)
      } else {
        return 'Click to calculate'
      }
    }
  },
  methods: {
    calculateCompletPourcent: function () {
      this.lotPicture = []
      for (var i in this.lots) {
        i = this.lots[i]
        fetch('http://opv_master:5050/v1/files/' + i.pictures_path)
          .then(answer => answer.json())
          .then(json => {
            this.lotPicture.push(json.length)
          })
      }
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
