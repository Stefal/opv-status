<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs7>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Spark</v-toolbar-title>
              <v-spacer></v-spacer>
              <Menu :where="'Spark'"></Menu>
            </v-toolbar>
            <v-card-text>
              <v-container fluid grid-list-sm>
                <v-layout row wrap>
                  <v-flex>
                    <v-card>
                      <v-card-text>
                        <v-text-field ref='campaignId' label='Campaign id'></v-text-field>
                        <v-text-field ref='maletteId' label='Malette id'></v-text-field>
                        <v-text-field ref='customLaunchScript' label='Custom launch script'></v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex>
                    <v-card>
                      <v-card-text>
                        <v-btn color="primary" @click="launchSpark()">Launch spark</v-btn>
                        <v-btn color="primary" @click="startScan()">Start scan</v-btn>
                        <v-btn color="primary" @click="stopScan()">Stop scan</v-btn>
                      </v-card-text>
                    </v-card>
                    <v-card class="mt-1">
                      <v-card-text>
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-content>Answer:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{answer}}</v-list-tile-content>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile>
                            <v-list-tile-content>Number:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{number}}</v-list-tile-content>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile>
                            <v-list-tile-content>Spark port:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{sparkApiPort}}</v-list-tile-content>
                          </v-list-tile>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-card class="mt-1">
                  <v-card-text>
                    <v-layout>
                      <v-flex row layout>
                        <v-card v-for="props in sparkApp" :key="props.attempts[0].startTime" style="max-width: 400px;" class="mr-1">
                          <v-toolbar dark color="primary">
                            <v-toolbar-title>{{props.name}}</v-toolbar-title>
                          </v-toolbar>
                          <v-list>
                            <v-list-tile>
                              <v-list-tile-content>Id:</v-list-tile-content>
                              <v-list-tile-content class="align-end">{{props.id}}</v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>Start time:</v-list-tile-content>
                              <v-list-tile-content class="align-end">{{props.attempts[0].startTime}}</v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>Complet:</v-list-tile-content>
                              <v-list-tile-content class="align-end">{{props.jobs.numCompletedTasks}} over {{props.jobs.numTasks}}</v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                              <v-list-tile-content>Working:</v-list-tile-content>
                              <v-list-tile-content class="align-end">{{props.jobs.numActiveTasks}}</v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import ApiManager from '@/apiManager'
import Menu from '@/components/Menu'

export default {
  name: 'Spark',
  components: {
    Menu
  },
  props: ['id_campaign', 'id_malette'],

  data () {
    return {
      answer: 'You must ask something before =)',
      sparkApp: [],
      scanTimeout: null,
      sparkApiPort: [],
      number: 0
    }
  },
  mounted () {
    if (this.id_campaign != null && this.id_malette != null) {
      this.$refs.campaignId.$refs.input.value = this.id_campaign
      this.$refs.maletteId.$refs.input.value = this.id_malette
    }
  },
  methods: {
    launchSpark () {
      var args = {
        'campaign_id': this.$refs.campaignId.$refs.input.value,
        'malette_id': this.$refs.maletteId.$refs.input.value
      }
      if (this.$refs.customLaunchScript.$refs.input.value !== '') {
        args.customLaunchScript = this.$refs.customLaunchScript.$refs.input.value
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
