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
                <Map :node="pathNode" style="width: 60%; height: 80vh; z-index: 1" class="mr-1" @node:selected="changeCurrentNode"></Map>
                <Parameter ref="parameter" :path_details="pathDetails" class="mr-1" style="width: 20%; height: 80vh; z-index: 2"></Parameter>
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
      saving: false,
      savingWorking: false,
      savingStatus: 'Done',
      currentNode: null
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    save (deleteOldOne) {
      this.saving = true
      this.savingWorking = true
      this.savingStatus = 'Creating path node'

      if (deleteOldOne) {
        this.deleteOldOne(this.realPathNodes[1])
          .then(this.postNewOne(this.realPathNodes[0]))
          .then(this.loadData())
      } else {
        this.postNewOne(this.realPathNodes[0])
          .then(this.loadData())
      }
    },
    deleteOldOne (realPathNodes) {
      return new Promise((resolve, reject) => {
        this.saving = true
        this.savingWorking = true
        this.savingStatus = 'Deleting old path node'
        let promise = []
        for (let pathNode in realPathNodes) {
          pathNode = realPathNodes[pathNode]
          promise.push(apiManager.deletePathNode(pathNode.id_path_node, pathNode.id_malette))
        }

        Promise.all(promise)
          .then(() => {
            this.savingWorking = false
            this.savingStatus = 'Done'
            resolve()
          })
          .catch((error) => {
            this.savingStatus = 'Something went wrong while deleting old path node'
            this.savingWorking = false
            reject(error)
          })
      })
    },
    postNewOne (realPathNodes) {
      return new Promise((resolve, reject) => {
        this.saving = true
        this.savingWorking = true
        this.savingStatus = 'Posting new path node'
        let promise = []
        for (let pathNode in realPathNodes) {
          pathNode = realPathNodes[pathNode]
          promise.push(apiManager.postPathNode(pathNode))
        }
        Promise.all(promise)
          .then(() => {
            this.savingWorking = false
            this.savingStatus = 'Done'
            resolve()
          })
          .catch((error) => {
            this.savingStatus = 'Something went wrong while posting new path node'
            this.savingWorking = false
            reject(error)
          })
      })
    },
    loadData () {
      apiManager.getPathDetails(this.id_path_details, this.id_malette)
        .then((pd) => {
          this.pathDetails = pd.data
          apiManager.getPathNodeExtendedFromPathDetails(this.pathDetails.id_path_details)
            .then((pn) => {
              this.pathNode = pn.data.objects
            })
        })
    },
    changeCurrentNode (node) {
      this.currentNode = node
    }
  },
  computed: {
    realPathNodes () {
      let realPathNodes = []
      let pathNodeToDelete = []
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
          }
        })
        if ('id_path_node' in pathNode && pathNode['id_path_node'] !== null) {
          pathNodeToDelete.push(pathNode)
        }
      }
      return [realPathNodes, pathNodeToDelete]
    }
  }
}
</script>
