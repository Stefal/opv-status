<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs7>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Import data</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom left>
                <v-btn slot="activator" icon dark>
                  <v-icon>more</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile>
                    <router-link to="/"><v-list-tile-title>List</v-list-tile-title></router-link>
                  </v-list-tile>
                  <v-list-tile>
                    <router-link to="/spark/"><v-list-tile-title>Spark</v-list-tile-title></router-link>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-card-text>
              <v-container fluid grid-list-sm>
                <v-layout row wrap>
                  <v-flex>
                    <v-card>
                      <v-card-text>
                        <v-text-field ref='campaignDir' label='Campaign directory'></v-text-field>
                        <v-text-field ref='campaignName' label='Campaign name'></v-text-field>
                        <v-text-field ref='idMalette' label='Id malette' value='1'></v-text-field>
                        <v-text-field ref='idRederbro' label='Id rederbro' value='1'></v-text-field>
                        <v-text-field ref='cameraNB' label='Camera number' value='6'></v-text-field>
                        <v-text-field ref='description' label='Description' value='An amazing campaign'></v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex>
                    <v-card>
                      <v-card-text>
                        <v-layout>
                          <v-btn color="primary" v-on:click='launch()'>Launch import</v-btn>
                          <v-btn color="primary" v-on:click='scan()'>Scan for end</v-btn>
                          <v-btn color="primary" v-on:click='stopScan()'>Stop scan</v-btn>
                        </v-layout>
                        <v-layout>
                          <v-flex>
                            <v-text-field ref='logFile' label="Log file"></v-text-field>
                          </v-flex>
                          <v-layout row justify-center>
                            <v-dialog v-model="dialog">
                              <v-btn slot="activator" color="primary" v-on:click='showLog()'>Show log</v-btn>
                              <v-card>
                                <v-toolbar dark color="primary">
                                  <v-toolbar-title>Import data log</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>{{log}}</v-card-text>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn color="primary" @click="dialog = false">Close</v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-layout>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-card class="mt-1">
                      <v-card-text>
                        <v-list dense>
                          <v-list-tile>
                            <v-list-tile-content>Number:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ number }}</v-list-tile-content>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile>
                            <v-list-tile-content>Status:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ status }}</v-list-tile-content>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile>
                            <v-list-tile-content>Doing:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ doing }}</v-list-tile-content>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile>
                            <v-list-tile-content>Pourcent:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ pourcent.toFixed(2) }}%</v-list-tile-content>
                          </v-list-tile>
                          <v-divider></v-divider>
                          <v-list-tile>
                            <v-list-tile-content>Time:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ time.toFixed(2) }} seconds</v-list-tile-content>
                          </v-list-tile>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
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
      time: 0,
      dialog: false
    }
  },
  methods: {
    showLog () {
      var args = '{}'
      if (this.$refs.logFile.$refs.input.value !== '') {
        args = JSON.stringify({'logFile': this.$refs.logFile.$refs.input.value})
      }
      ApiManager.postImportLog(args).then(answer => {
        this.log = answer.data.answer
      })
    },
    launch () {
      var args = JSON.stringify({
        'path': this.$refs.campaignDir.$refs.input.value,
        'id_malette': this.$refs.idMalette.$refs.input.value,
        'id_rederbro': this.$refs.idRederbro.$refs.input.value,
        'camera_number': this.$refs.cameraNB.$refs.input.value,
        'description': this.$refs.description.$refs.input.value,
        'campaign_name': this.$refs.campaignName.$refs.input.value
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
