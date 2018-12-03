<template>
  <v-card>
    <v-card-text>
      <v-layout>
        <Import :path_details="path_details"></Import>
        <v-btn @click="deleteAll" dark color="primary">Delete all</v-btn>
      </v-layout>
      <v-divider></v-divider>
      <v-radio-group v-model="mode" :mandatory="true">
        <v-radio label="View" value="view"></v-radio>
        <v-radio label="Hotspot" value="hotspot"></v-radio>
        <v-radio label="End Point" value="endpoint"></v-radio>
        <v-radio label="Add edge" value="edge"></v-radio>
        <v-radio label="Delete" value="delete"></v-radio>
        <v-radio label="Delete edge" value="deleteedge"></v-radio>
      </v-radio-group>
      <v-divider></v-divider>
      <Generate @update:pathNode="updatePathNode" @update:pathEdge="updatePathEdge" :path_details="path_details" :path_node="path_node" :path_edge="path_edge"></Generate>
      <v-divider></v-divider>
      <v-layout>
        <v-flex>
          <v-btn color="primary" @click="save" dark>Save</v-btn>
          <v-layout>
            <v-btn color="primary" @click="saveAsNew" dark>Save as</v-btn>
            <v-text-field ref="newName" label="Name" :value="path_details.name + '.copy'"></v-text-field>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Import from '@/components/pathDetails/Import'
import Generate from '@/components/pathDetails/Generate'
import apiManager from '@/apiManager'

export default {
  name: 'Parameter',
  components: {Import, Generate},
  props: ['path_details', 'path_node', 'path_edge'],
  data () {
    return {
      mode: 'view'
    }
  },
  methods: {
    save () {
      this.$parent.$parent.$parent.save(true)
    },
    saveAsNew () {
      delete this.$parent.$parent.$parent.pathDetails.id_path_details
      delete this.$parent.$parent.$parent.pathDetails.id_malette
      this.$parent.$parent.$parent.pathDetails.name = this.$refs.newName.$refs.input.value
      debugger
      apiManager.postPathDetails(this.$parent.$parent.$parent.pathDetails)
        .then((pathDetails) => {
          debugger
          this.$parent.$parent.$parent.pathDetails = pathDetails.data
          this.$parent.$parent.$parent.save(false)
        })
    },
    deleteAll () {
      debugger
      this.$parent.$parent.$parent.deleteOldOne(this.$parent.$parent.$parent.pathNode)
        .then(this.$parent.$parent.$parent.loadData)
    },
    updatePathNode (event) {
      this.$emit('update:pathNode', event)
    },
    updatePathEdge (event) {
      this.$emit('update:pathEdge', event)
    }
  }
}
</script>
