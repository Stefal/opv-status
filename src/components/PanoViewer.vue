<template>
  <div id='pano' style="position: absolute; height: 100%; left: 0px; top: 0px">
   </div>
</template>

<script>
import '../../node_modules/pannellum/build/pannellum.css'
import {} from '../../node_modules/pannellum/build/pannellum.js'

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
    fetch('http://opv_master:5000/tile/' + this.id_tile + '/' + this.id_malette)
      .then(answer => answer.json())
      .then(json => {
        this.tile = json

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
                extension: json.extension,
                tileResolution: json.resolution,
                basePath: 'http://opv_master:5050/v1/files/' + json.param_location,
                cubeResolution: json.cube_resolution,
                path: '/%l/%s%y_%x',
                maxLevel: json.max_level
              }
            }
          }
        }
        this.viewer = this.pannellum.viewer('pano', this.config)
      })
  }
}
</script>
