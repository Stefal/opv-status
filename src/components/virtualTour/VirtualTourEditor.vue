<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Virtual tour editor: {{id_virtualtour}}/{{id_malette}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <Menu></Menu>
            </v-toolbar>
            <v-card-text>
              <v-layout>
                <v-card width="400" class="mr-1 mb-1" v-for="path in virtualtourPath" :key="path.id_virtualtour_path">
                  <v-toolbar dark color="primary">
                    <v-toolbar-title>Virtualtour path: {{path.id_virtualtour_path}}/{{id_malette}}</v-toolbar-title>
                  </v-toolbar>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>Path details</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{path.path_details.id_path_details}}/{{path.path_details.id_malette}}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <v-list-tile-content>Name</v-list-tile-content>
                      <v-list-tile-content v-if="'name' in path.path_details" class="align-end">{{path.path_details.name}}</v-list-tile-content>
                      <v-list-tile-content v-else class="align-end"><v-progress-circular indeterminate color="primary"></v-progress-circular></v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <v-list-tile-content>Description</v-list-tile-content>
                      <v-list-tile-content v-if="'decription' in path.path_details" class="align-end">{{path.path_details.decription}}</v-list-tile-content>
                      <v-list-tile-content v-else class="align-end"><v-progress-circular indeterminate color="primary"></v-progress-circular></v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <v-list-tile-content>Campaign</v-list-tile-content>
                      <v-list-tile-content v-if="'campaign' in path.path_details" class="align-end">{{path.path_details.campaign.id_campaign}}/{{path.path_details.campaign.id_malette}}</v-list-tile-content>
                      <v-list-tile-content v-else class="align-end"><v-progress-circular indeterminate color="primary"></v-progress-circular></v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <v-list-tile-content>Node number</v-list-tile-content>
                      <v-list-tile-content v-if="'path_node' in path" class="align-end">{{path.path_node.length}}</v-list-tile-content>
                      <v-list-tile-content v-else class="align-end"><v-progress-circular indeterminate color="primary"></v-progress-circular></v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog v-model="creating" width="500">
                <v-btn slot="activator" dark color="primary">Create</v-btn>
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-toolbar-title>Add a virtualtour path</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-text-field label="Id path details" ref="idPathDetails"></v-text-field>
                    <v-text-field label="Id malette" ref="idMalette"></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark color="primary" @click="createPath">Create</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import apiManager from '@/apiManager'
import Menu from '@/components/Menu'

export default {
  name: 'VirtualTourEditor',
  props: ['id_virtualtour', 'id_malette'],
  components: {
    Menu
  },
  data () {
    return {
      virtualtour: {},
      virtualtourPath: [],
      creating: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      apiManager.getVirtualTour(this.id_virtualtour, this.id_malette)
        .then((virtualtour) => {
          this.virtualtour = virtualtour.data
          apiManager.getVirtualTourPathFromVirtualTour(this.id_virtualtour)
            .then((path) => {
              this.virtualtourPath = path.data.objects
              for (let vtPath in this.virtualtourPath) {
                this.getVirtualTourPath(vtPath)
              }
            })
        })
    },
    createPath () {
      apiManager.postVirtualTourPath({
        path_details: {
          id_path_details: this.$refs.idPathDetails.$refs.input.value,
          id_malette: this.$refs.idMalette.$refs.input.value
        },
        virtualtour: {
          id_virtualtour: this.id_virtualtour,
          id_malette: this.id_malette
        }
      })
        .then(this.loadData)
      this.creating = false
    },
    getVirtualTourPath (index) {
      apiManager.getPathDetails(this.virtualtourPath[index].path_details.id_path_details, this.virtualtourPath[index].path_details.id_malette)
        .then((pd) => {
          this.$set(this.virtualtourPath[index], 'path_details', pd.data)
        })
      apiManager.getPathNodeFromPathDetails(this.virtualtourPath[index].path_details.id_path_details)
        .then((node) => {
          this.$set(this.virtualtourPath[index], 'path_node', node.data.objects)
        })
    }
  }
}
</script>
