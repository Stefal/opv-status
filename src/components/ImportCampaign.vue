<template>
  <div class='column'>
    <div style='width: 50%'>
      <h1>Import data</h1>
      Campaign dir : <input ref='campaignDir'><br>
      Campaign name : <input ref='campaignName'><br>
      Id malette : <input ref='idMalette' value='1'><br>
      Id rederbro : <input ref='idRederbro' value='1'><br>
      Camera number : <input ref='cameraNB' value='6'><br>
      Description : <input ref='description' value='An amazing campaign'><br>
      <input type='button' value='Launch import' v-on:click='launch()'><br>
      Log file : <input ref='logFile'>
      <input type='button' value='Show log' v-on:click='showLog()'><br>
      <input type='button' value='Scan for end' v-on:click='scan()'><br>
      <input type='button' value='Stop scan' v-on:click='stopScan()'><br>
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
      Time : {{ time }}<br>
      Log : {{ log }}<br>
    </div>
  </div>
</template>

<script>
import ApiManager from '@/apiManager'

export default {
  name: 'ImportCampaign',
  data () {
    return {
      number: 0,
      status: 'down',
      doing: 'nothing',
      pourcent: 0,
      log: '',
      doScan: null,
      time: 0
    }
  },
  methods: {
    showLog () {
      var args = '{}'
      if (this.$refs.logFile.value !== '') {
        args = JSON.stringify({'logFile': this.$refs.logFile.value})
      }
      ApiManager.postImportLog(args).then(answer => {
        this.log = answer.data.answer
      })
    },
    launch () {
      var args = JSON.stringify({
        'path': this.$refs.campaignDir.value,
        'id_malette': this.$refs.idMalette.value,
        'id_rederbro': this.$refs.idRederbro.value,
        'camera_number': this.$refs.cameraNB.value,
        'description': this.$refs.description.value,
        'campaign_name': this.$refs.campaignName.value
      })

      ApiManager.postImportLaunch(args).then(answer => {
        this.scan()
      })
    },
    scan () {
      this.stopScan()
      const that = this
      this.doScan = setInterval(function () {
        that.status = 'up'
        ApiManager.getImportStatus().then(answer => {
          that.number++
          that.doing = answer.data.answer.doing
          that.pourcent = answer.data.answer.pourcent
          that.status = answer.data.answer.status
          that.time = answer.data.answer.time
        })
      }, 1000)
    },
    stopScan () {
      if (this.doScan != null) {
        clearInterval(this.doScan)
      }
    }
  },
  watch: {
    status: function () {
      if (this.status === 'down') {
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
