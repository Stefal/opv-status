<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Virtual tour viewer</v-toolbar-title>
              <v-spacer></v-spacer>
              <Menu where="Virtual tour viewer"></Menu>
            </v-toolbar>
            <v-card-text>
              <v-data-table :headers="headers" :items="virtualTour" hide-actions item-key="id_virtualtour">
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{props.item.title}}</td>
                    <td>{{props.item.decription}}</td>
                    <td>{{props.item.id_virtualtour}}</td>
                    <td>{{props.item.id_malette}}</td>
                    <td v-if="props.item.id_virtualtour in virtualTourPath">{{virtualTourPath[props.item.id_virtualtour].length}}</td>
                    <td v-else><v-progress-circular indeterminate color="primary"></v-progress-circular></td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <router-link :to="{ name: 'VirtualTourEditor', params: { id_virtualtour: props.item.id_virtualtour, id_malette: props.item.id_malette}}">
                        <v-btn color="primary">Editor</v-btn>
                      </router-link>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog">
                <v-btn slot="activator" dark color="primary">New</v-btn>
                <v-card>
                  <v-toolbar color="primary" dark>
                    <v-toolbar-title>New virtual tour</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-text-field label="Name" ref="name"></v-text-field>
                    <v-textarea label="Description" ref="description"></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="createVirtualTour">Create</v-btn>
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
import Menu from '@/components/Menu'
import apiManager from '@/apiManager'

export default {
  name: 'VirtualTourViewer',
  components: {
    Menu
  },
  data () {
    return {
      virtualTour: [],
      virtualTourPath: {},
      headers: [
        {text: 'Title', value: 'title', align: 'left', sortable: false},
        {text: 'Description', value: 'description', sortable: false},
        {text: 'ID', value: 'id_path_details'},
        {text: 'ID Malette', value: 'id_malette'},
        {text: 'Number virtual tour path', value: 'number'}
      ],
      dialog: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    getVirtualTourPath (virtualTour) {
      apiManager.getVirtualTourPathFromVirtualTour(virtualTour.id_virtualtour)
        .then((virtualTourPath) => {
          this.$set(this.virtualTourPath, virtualTour.id_virtualtour, virtualTourPath.data.objects)
        })
    },
    createVirtualTour () {
      apiManager.postVirtualTour({
        title: this.$refs.name.$refs.input.value,
        decription: this.$refs.description.$refs.input.value
      })
        .then(() => {
          this.loadData()
          this.dialog = false
        })
    },
    loadData () {
      apiManager.getAllVirtualTour()
        .then((virtualTour) => {
          this.virtualTour = virtualTour.data.objects
          for (let virtualTour in this.virtualTour) {
            this.getVirtualTourPath(this.virtualTour[virtualTour])
          }
        })
    }
  }
}
</script>
