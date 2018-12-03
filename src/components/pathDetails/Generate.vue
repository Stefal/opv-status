<template>
  <v-dialog width="700" :v-model="generating">
    <v-btn dark color="primary" slot="activator">Generate path</v-btn>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Generate path</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="!working">
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <v-layout>
              <v-slider :thumb-size="24" thumb-label="always" v-model="perimeter" label="Perimeter: "></v-slider>
              <v-btn color="primary" dark @click="perimeter = 40.1">Default</v-btn>
            </v-layout>
            <v-layout>
              <v-slider :max="200" :thumb-size="24" thumb-label="always" v-model="radialSpace" label="Radial space: "></v-slider>
              <v-btn color="primary" dark @click="radialSpace = 90.2">Default</v-btn>
            </v-layout>
            <v-layout>
              <v-slider :thumb-size="24" thumb-label="always" v-model="reduce" label="Reduce: "></v-slider>
              <v-btn color="primary" dark @click="reduce = 15">Default</v-btn>
            </v-layout>
            <v-layout>
              <v-slider :thumb-size="24" thumb-label="always" v-model="minPath" label="Min Path: "></v-slider>
              <v-btn color="primary" dark @click="minPath = 0">Default</v-btn>
            </v-layout>
            <v-btn dark color="primary" @click="generate">Generate path</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text v-else>
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <p style="font-size: 20px;">This may be long please do not touch anything until it's finish</p>
            <v-progress-circular :size="100" indeterminate color="primary"></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import apiManager from '@/apiManager'

export default {
  name: 'Generate',
  props: ['path_node', 'path_edge', 'path_details'],
  data () {
    return {
      generating: false,
      perimeter: 40.1,
      radialSpace: 90.2,
      reduce: 15,
      minPath: 0,
      working: false
    }
  },
  methods: {
    generate () {
      this.working = true
      apiManager.postGraphAll(this.perimeter, this.radialSpace, this.reduce, this.minPath, this.graphPathDetails)
        .then((graph) => {
          graph = graph.data
          this.working = false
          let newPathNode = []
          for (let node in graph.nodes) {
            node = graph.nodes[node]
            let index = newPathNode.push(
              this.path_node[node.data.index]
            ) - 1
            newPathNode[index].data = node.data
            if (node.id in graph.end_points) {
              newPathNode[index].endpoint = true
            }
            if (node.id in graph.hotpoints) {
              newPathNode[index].hotpoints = true
            }
          }
          let newPathEdge = []
          for (let edge in graph.edges) {
            edge = graph.edges[edge]
            newPathEdge.push({
              source_path_node: {
                id_path_node: parseInt(edge.source.split('/')[0]),
                id_malette: parseInt(edge.source.split('/')[1])
              },
              dest_path_node: {
                id_path_node: parseInt(edge.dest.split('/')[0]),
                id_malette: parseInt(edge.dest.split('/')[1])
              },
              data: edge.data,
              path_details: {
                id_path_details: this.path_details.id_path_details,
                id_malette: this.path_details.id_malette
              }
            })
          }
          this.$emit('update:pathEdge', newPathEdge)
          this.$emit('update:pathNode', newPathNode)
        })
        .catch((error) => {
          this.working = false
          console.log(error)
        })
    },
    getSensorsType (node) {
      if (node.reconstructed_gps_pos !== null) {
        return 'reconstructed_'
      } else {
        return 'original_'
      }
    }
  },
  computed: {
    graphPathDetails () {
      let nodes = []
      let edges = []
      let endpoints = []
      let hotspots = []

      for (let node in this.path_node) {
        if (!this.path_node[node].disabled) {
          let cord = this.path_node[node][this.getSensorsType(this.path_node[node]) + 'gps_pos'].coordinates
          let id = this.path_node[node].id_path_node + '/' + this.path_node[node].id_malette

          if (!('data' in this.path_node[node])) {
            let newPathNode = this.path_node.slice()
            newPathNode[node].data = {}
            this.$emit('update:pathNode', newPathNode)
          }

          let data = this.path_node[node].data
          data.index = node

          nodes.push({
            data: data,
            id: id,
            x: cord[0],
            y: cord[1],
            z: cord[2]
          })

          if (this.path_node[node].hotspot) {
            hotspots.push(id)
          }
          if (this.path_node[node].endpoint) {
            endpoints.push(id)
          }
        }
      }
      for (let edge in this.path_edge) {
        if (!('data' in this.path_edge[edge])) {
          let newPathEdge = this.path_edge.slice()
          newPathEdge[edge].data = {}
          this.$emit('update:pathEdge', newPathEdge)
        }

        edge = this.path_edge[edge]

        edges.push({
          source: edge.source_path_node.id_path_node + '/' + edge.source_path_node.id_malette,
          dest: edge.dest_path_node.id_path_node + '/' + edge.dest_path_node.id_malette,
          data: edge.data
        })
      }

      return {
        nodes: nodes,
        edges: edges,
        end_points: endpoints,
        hotpoints: hotspots
      }
    }
  }
}
</script>
