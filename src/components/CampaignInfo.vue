<template>
   <div>
     <h1>Campaign : {{ campaign.id_campaign }}-{{ campaign.id_malette }} -->  {{ campaign.name }}</h1>
     <p>Assembled : {{ assemledPourcent }}% Geoloc : {{ geolocPourcent }}% Complet : {{ completPourcent }}%</p>
   </div>
</template>

<script>

export default {
  name: 'CampaignInfo',
  props: ['lots', 'sensors', 'campaign'],

  data () {
    return {
      pictureNumber: [],
      canUse: false
    }
  },

  watch: {
    lots: function () {
      if (this.canUse === true) {
        if (this.campaign.lots.length === this.lots.length) {
          for (var i in this.lots) {
            i = this.lots[i]
            fetch('http://opv_master:5050/v1/files/' + i.pictures_path)
              .then(answer => answer.json())
              .then(json => {
                this.pictureNumber.push(json.length)
              })
          }
        }
      }
    },

    campaign: function () {
      this.canUse = true
    }
  },
  computed: {
    assemledPourcent: function () {
      var value = 0
      if (this.canUse === true) {
        if (this.campaign.lots.length === this.lots.length) {
          for (var i in this.lots) {
            i = this.lots[i]
            if (i.tile.id_tile != null) { value++ }
          }
          value = Math.round(value / this.lots.length * 100)
        }
      }

      return value
    },
    geolocPourcent: function () {
      var value = 0
      if (this.canUse === true) {
        if (this.campaign.lots.length === this.sensors.length) {
          for (var i in this.sensors) {
            i = this.sensors[i]
            if (i.gps_pos.coordinates[0] !== 0 && i.gps_pos.coordinates[1] !== 0 && i.gps_pos.coordinates[2] !== 0) { value++ }
          }
          value = Math.round(value / this.sensors.length * 100)
        }
      }

      return value
    },
    completPourcent: function () {
      var value = 0

      if (this.canUse === true) {
        if (this.campaign.lots.length === this.pictureNumber.length) {
          for (var i in this.pictureNumber) {
            i = this.pictureNumber[i]
            if (i >= 6) { value++ }
          }
          value = Math.round(value / this.sensors.length * 100)
        }
      }

      return value
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
