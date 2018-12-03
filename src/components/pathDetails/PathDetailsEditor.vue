<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Path details editor : <span v-if="'id_path_details' in pathDetails">{{pathDetails.id_path_details}}/{{pathDetails.id_malette}} --> {{pathDetails.name}}</span> {{pathNode.length}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <Menu></Menu>
            </v-toolbar>
            <v-card-text>
              <v-layout>
                <Map :path_details="pathDetails" :node="pathNode" :edge="pathEdge" style="width: 60%; height: 80vh; z-index: 1" class="mr-1" @node:selected="changeCurrentNode"></Map>
                <Parameter ref="parameter" :path_edge="pathEdge" :path_details="pathDetails" :path_node="pathNode" @update:pathNode="pathNode = $event" @update:pathEdge="pathEdge = $event" class="mr-1" style="width: 20%; height: 80vh; z-index: 2"></Parameter>
                <NodeInfo :node="currentNode" style="width: 20%; height: 80vh; z-index: 2"></NodeInfo>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog :width="500" v-model="saving">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Saving</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap align-center>
            <v-flex class="text-xs-center">
              <p style="font-size: 20px;" v-if="savingWorking">This may be long please do not touch anything until it's finish</p>
              <v-progress-circular :size="100" v-if="savingWorking" indeterminate color="primary"></v-progress-circular>
              <p style="font-size: 15px;">{{savingStatus}}</p>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Menu from '@/components/Menu'
import apiManager from '@/apiManager'
import Parameter from '@/components/pathDetails/Parameter'
import Map from '@/components/pathDetails/Map'
import NodeInfo from '@/components/pathDetails/NodeInfo'

export default {
  name: 'PathDetailsEditor',
  props: ['id_path_details', 'id_malette'],
  components: {Menu, Parameter, Map, NodeInfo},
  data () {
    return {
      pathDetails: {},
      pathNode: [],
      pathEdge: [],
      saving: false,
      savingWorking: false,
      savingStatus: 'Done',
      currentNode: null,
      nodeNewId: {}
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    save (deleteOld) {
      this.saving = true
      this.savingWorking = true
      this.savingStatus = 'Saving path node / path edge'

      console.log(deleteOld)
      if (deleteOld) {
        this.deleteOldOne()
          .then(this.postNewOne)
          .then(this.loadData)
      } else {
        this.postNewOne()
          .then(this.loadData)
      }
    },
    deleteOldOne (realPathNodes) {
      return new Promise((resolve, reject) => {
        console.log('delete')
        this.saving = true
        this.savingWorking = true
        this.savingStatus = 'Deleting old path node / path edge'
        // debugger
        apiManager.deletePathEdgeFromPathDetails(this.pathDetails.id_path_details)
          .then(() => {
            // debugger
            apiManager.deletePathNodeFromPathDetails(this.pathDetails.id_path_details)
          })
          .then(() => {
            this.savingWorking = false
            this.savingStatus = 'Done'
            resolve()
          })
          .catch((error) => {
            this.savingStatus = 'Something went wrong while deleting old path node / path edge'
            this.savingWorking = false
            reject(error)
          })
      })
    },
    postNewOne () {
      return new Promise((resolve, reject) => {
        console.log('post')
        this.saving = true
        this.savingWorking = true
        this.savingStatus = 'Posting new path node'
        let promisePathNode = []
        for (let pathNode in this.realPathNodes) {
          // debugger
          promisePathNode.push(this.postPathNode(this.realPathNodes[pathNode]))
        }
        Promise.all(promisePathNode)
          .then(() => {
            this.savingStatus = 'Posting new path edge'
            let promisePathEdge = []
            for (let pathEdge in this.pathEdge) {
              this.pathEdge[pathEdge].source_path_node.id_path_node = this.nodeNewId[this.pathEdge[pathEdge].source_path_node.id_path_node]
              this.pathEdge[pathEdge].dest_path_node.id_path_node = this.nodeNewId[this.pathEdge[pathEdge].dest_path_node.id_path_node]
              this.pathEdge[pathEdge].path_details = this.pathDetails
              delete this.pathEdge[pathEdge].id_path_edge
              delete this.pathEdge[pathEdge].id_malette
              promisePathEdge.push(apiManager.postPathEdge(this.pathEdge[pathEdge]))
            }
            Promise.all(promisePathEdge)
              .then(() => {
                this.savingStatus = 'Done'
                this.savingWorking = false
                resolve()
              })
              .catch((error) => {
                this.savingStatus = 'Something went wrong while posting new path edge'
                this.savingWorking = false
                reject(error)
              })
          })
          .catch((error) => {
            this.savingStatus = 'Something went wrong while posting new path node'
            this.savingWorking = false
            reject(error)
          })
      })
    },
    loadData () {
      this.pathDetails = {}
      this.pathNode = []
      this.pathEdge = []
      // debugger
      apiManager.getPathDetails(this.id_path_details, this.id_malette)
        .then((pd) => {
          // debugger
          this.pathDetails = pd.data
          apiManager.getPathNodeExtendedFromPathDetails(this.pathDetails.id_path_details)
            .then((pn) => {
              // debugger
              this.pathNode = pn.data.objects
            })
          // debugger
          apiManager.getPathEdgeFromPathDetails(this.pathDetails.id_path_details)
            .then((pe) => {
              // debugger
              this.pathEdge = pe.data.objects
            })
        })
    },
    changeCurrentNode (node) {
      this.currentNode = node
    },
    postPathNode (node) {
      return new Promise((resolve, reject) => {
        apiManager.postPathNode(node)
          .then((newNode) => {
            this.nodeNewId[node.old_id_path_node] = newNode.data.id_path_node
            resolve(newNode)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  },
  computed: {
    realPathNodes () {
      let realPathNodes = []
      for (let pathNode in this.pathNode) {
        pathNode = this.pathNode[pathNode]
        realPathNodes.push({
          panorama: {
            id_panorama: pathNode.id_panorama,
            id_malette: pathNode.id_panorama_malette
          },
          disabled: pathNode.disabled,
          hotspot: pathNode.hotspot,
          endpoint: pathNode.endpoint,
          path_details: {
            id_path_details: this.pathDetails.id_path_details,
            id_malette: this.pathDetails.id_malette
          },
          old_id_path_node: pathNode.id_path_node
        })
      }
      return realPathNodes
    }
  }
}
</script>
