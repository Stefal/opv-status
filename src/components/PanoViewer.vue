<template>
  <div id='pano' style="position: absolute; height: 100%; left: 0px; top: 0px">
   </div>
</template>

<script>
import '../../node_modules/pannellum/build/pannellum.css'
import {} from '../../node_modules/pannellum/build/pannellum.js'
import ApiManager from '@/apiManager'

export default {
  name: 'PanoViewer',
  props: ['id_tile', 'id_malette'],

  data () {
    return {
      pannellum: window.pannellum,
      viewer: null,
      config: null,
      tile: null
    }
  },

  created () {
    ApiManager.getTile(this.id_tile, this.id_malette).then(answer => {
      this.tile = answer.data

      this.config = {
        default: {
          author: 'Open Path View CC-BY-SA',
          title: 'Rederbro',
          autoLoad: true,
          firstScene: 'default'
        },
        scenes: {
          default: {
            type: 'multires',
            title: 'default',
            multiRes: {
              extension: answer.data.extension,
              tileResolution: answer.data.resolution,
              basePath: 'http://opv_master:5050/v1/files/' + answer.data.param_location,
              cubeResolution: answer.data.cube_resolution,
              path: '/%l/%s%y_%x',
              maxLevel: answer.data.max_level
            }
          }
        }
      }
      this.viewer = this.pannellum.viewer('pano', this.config)
    })
  }
}
</script>
