<template>
   <div class='column'>
     <div style='width: 50%'>
       <h1>Spark</h1>
       Campaign dir <input ref='campaignName'><input type='button' value='Launch spark' v-on:click='launchSpark()'><br>
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
import axios from 'axios'

export default {
  name: 'Spark',
  data () {
    return {
      answer: '',
      sparkApp: [],
      scanTimeout: null,
      sparkApiPort: [],
      number: 0
    }
  },
  methods: {
    launchSpark () {
      var args = {
        'campaignName': this.$refs.campaignName.value
      }
      if (this.$refs.customLaunchScript.value !== '') {
        args.customLaunchScript = this.$refs.customLaunchScript.value
      }
      args = JSON.stringify(args)
      axios.post('http://opv_master:5001/spark/launch', args)
        .then(answer => {
          this.answer = answer.data.answer
        })
        .catch(error => {
          this.answer = error.response.data.error
        })
    },
    stopScan () {
      if (this.scanTimeout != null) {
        clearInterval(this.scanTimeout)
      }
    },
    startScan () {
      const that = this
      this.scanTimeout = setInterval(function () {
        axios.get('http://opv_master:5001/spark/port')
          .then(answer => {
            that.sparkApiPort = answer.data.answer
            that.sparkApp = []
            for (var port in answer.data.answer) {
              port = answer.data.answer[port]
              that.scanPort(port)
            }
          })
          .catch(error => {
            that.sparkApiPort = error.response.data.error
          })
        that.number++
      }, 5000)
    },
    scanPort (port) {
      axios.get('http://opv_master:' + port + '/api/v1/applications')
        .then(applications => {
          axios.get('http://opv_master:' + port + '/api/v1/applications/' + applications.data[0].id + '/jobs')
            .then(jobs => {
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
