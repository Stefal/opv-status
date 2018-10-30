<template>
  <v-card>
    <v-card-text>
      <v-layout>
        <v-flex>
          <v-btn><v-icon>undo</v-icon></v-btn>
          <v-btn><v-icon>redo</v-icon></v-btn>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
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
      <v-btn color="primary" dark>Generate Graph</v-btn>
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
import apiManager from '@/apiManager'

export default {
  name: 'Parameter',
  components: {Import},
  props: ['path_details'],
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
      delete this.$parent.$parent.$parent.pathDetails.start_node
      delete this.$parent.$parent.$parent.pathDetails.stop_node
      this.$parent.$parent.$parent.pathDetails.name = this.$refs.newName.$refs.input.value
      apiManager.postPathDetails(this.$parent.$parent.$parent.pathDetails)
        .then((pathDetails) => {
          this.$parent.$parent.$parent.pathDetails = pathDetails.data
          this.$parent.$parent.$parent.save(false)
        })
    },
    deleteAll () {
      this.$parent.$parent.$parent.deleteOldOne(this.$parent.$parent.$parent.pathNode)
        .then(this.$parent.$parent.$parent.loadData())
    }
  }
}
</script>
