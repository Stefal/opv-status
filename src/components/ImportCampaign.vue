<template>
  <div class='column'>
    <div style='width: 50%'>
      <h1>Import data</h1>
      Campaign dir : <input ref="campaignDir">
      <input type='button' value='Launch import' v-on:click='launch()'><br>
      Log file : <input ref="logFile">
      <input type='button' value='Show log' v-on:click='showLog()'><br>
      <input type='button' value='Scan for end' v-on:click='scan()'><br>
      Your campaign dir must have a tree like that : <br>
      campaign<br>
        ├── picturesInfo.csv<br>
        └── SD<br>
    </div>
    <div style='width: 50%'>
      Number : {{ number }}<br>
      Status : {{ status }}<br>
      Doing : {{ doing }}<br>
      Pourcent : {{ pourcent }}<br>
      Error : {{ error }}<br>
      Log : {{ log }}<br>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ImportCampaign',
  data () {
    return {
      number: 0,
      status: 'down',
      doing: 'nothing',
      pourcent: 0,
      error: 0,
      log: '',
      doScan: null
    }
  },
  methods: {
    showLog () {
      var args = '{}'
      if (this.$refs.logFile.value !== '') {
        args = JSON.stringify({'logFile': this.$refs.logFile.value})
      }
      axios.post('http://opv_master:5001/import/log', args)
        .then(answer => {
          this.log = answer.data.answer
        })
        .catch(error => {
          this.log = error.response.data.error
        })
    },
    launch () {
      var args = JSON.stringify({'campaignDir': this.$refs.campaignDir.value})

      axios.post('http://opv_master:5001/import/launch', args)
    },
    scan () {
      const that = this
      this.doScan = setInterval(function () {
        fetch('http://opv_master:5001/import/status')
          .then(answer => answer.json())
          .then(json => {
            json = json.answer
            that.number++
            that.doing = json.doing
            that.pourcent = json.pourcent
            that.status = json.status
          })
      }, 1000)
    }
  },
  watch: {
    status: function () {
      if (this.doScan != null && this.status === 'down') {
        clearInterval(this.doScan)
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
