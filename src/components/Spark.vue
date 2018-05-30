<template>
   <div class='column'>
     <div style='width: 50%'>
       <h1>Spark</h1>
       Campaign id <input ref='campaignId'><br>
       Malette id <input ref='maletteId'><input type='button' value='Launch spark' v-on:click='launchSpark()'><br>
       Custom launch script <input ref='customLaunchScript'><br>
       <input type='button' value='Start scan spark' v-on:click='startScan()'> <input type='button' value='Stop scan spark' v-on:click='stopScan()'>
     </div>
     <div style='width: 50%'>
       Launch Answer : {{answer}}<br>
       Number : {{number}}<br>
       Spark api : {{sparkApiPort}}<br>
       Spark :<br>
       <div v-for="app in sparkApp" :key="app.attempts[0].startTime">
         ----------------------------------------<br>
         Name : {{app.name}}<br>
         Id : {{app.id}}<br>
         Start time : {{app.attempts[0].startTime}}<br>
         Complet : {{app.jobs.numCompletedTasks}} over {{app.jobs.numTasks}}<br>
         Working : {{app.jobs.numActiveTasks}}<br>
         ----------------------------------------<br>
       </div>
     </div>
   </div>
</template>

<script>
import ApiManager from '@/apiManager'

export default {
  name: 'Spark',
  props: ['id_campaign', 'id_malette'],

  data () {
    return {
      answer: '',
      sparkApp: [],
      scanTimeout: null,
      sparkApiPort: [],
      number: 0
    }
  },
  mounted () {
    if (this.id_campaign != null && this.id_malette != null) {
      this.$refs.campaignId.value = this.id_campaign
      this.$refs.maletteId.value = this.id_malette
    }
  },
  methods: {
    launchSpark () {
      var args = {
        'campaign_id': this.$refs.campaignId.value,
        'malette_id': this.$refs.maletteId.value
      }
      if (this.$refs.customLaunchScript.value !== '') {
        args.customLaunchScript = this.$refs.customLaunchScript.value
      }
      args = JSON.stringify(args)
      ApiManager.postSparkLaunch(args).then(answer => {
        this.answer = answer.data.answer
        this.startScan()
      })
    },
    stopScan () {
      if (this.scanTimeout != null) {
        clearInterval(this.scanTimeout)
      }
    },
    startScan () {
      this.stopScan()

      const that = this
      this.scanTimeout = setInterval(function () {
        ApiManager.getSparkPort().then(answer => {
          that.sparkApiPort = answer.data.answer
          that.sparkApp = []
          if (answer.data.answer.length === 0) {
            that.stopScan()
          }
          for (var port in answer.data.answer) {
            port = answer.data.answer[port]
            that.scanPort(port)
          }
        })
        that.number++
      }, 5000)
    },
    scanPort (port) {
      ApiManager.getSparkApp(port).then(applications => {
        ApiManager.getSparkJob(port, applications.data[0].id).then(jobs => {
          var app = applications.data[0]
          app.jobs = jobs.data[0]
          this.sparkApp.push(app)
        })
      })
    }
  },
  watch: {
    connection: function () {
      if (this.connection === 'Network Error') {
        this.stopScan()
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
