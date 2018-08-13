<template>
  <div id='pano' style="position: absolute; height: 100%; left: 0px; top: 0px">
   </div>
</template>

<script>
import '../../node_modules/pannellum/build/pannellum.css'
import {} from '../../node_modules/pannellum/build/pannellum.js'
import ApiManager from '@/apiManager'

const REDERBRO_OFFSET_ANGLE = 120 // In degrees, this should be in a configuration file but as this project isn't based on @vue-cli it will be more difficult

export default {
  name: 'PanoViewer',
  props: ['id_lot', 'id_malette'],

  data () {
    return {
      pannellum: window.pannellum,
      viewer: null,
      config: null,
      tile: null
    }
  },

  created () {
    async function getConfig (idLot, idMalette) {
      const lot = (await ApiManager.getLot(idLot, idMalette)).data
      const tile = (await ApiManager.getTile(lot.tile.id_tile, lot.tile.id_malette)).data
      const sensors = (await ApiManager.getSensors(lot.sensors.id_sensors, lot.sensors.id_malette)).data

      console.log(process.env)
      console.log('Northoffset ', sensors.degrees + process.env.VUE_APP_REDERBRO_OFFSET_NORTH_ANGLE)

      const config = {
        default: {
          author: 'Open Path View CC-BY-SA',
          title: 'Rederbro',
          autoLoad: true,
          firstScene: 'default'
        },
        scenes: {
          default: {
            compass: true,
            northOffset: sensors.degrees + REDERBRO_OFFSET_ANGLE,
            type: 'multires',
            title: 'default',
            multiRes: {
              extension: tile.extension,
              tileResolution: tile.resolution,
              basePath: 'http://opv_master:5050/v1/files/' + tile.param_location,
              cubeResolution: tile.cube_resolution,
              path: '/%l/%s%y_%x',
              maxLevel: tile.max_level
            }
          }
        }
      }

      return config
    }

    getConfig(this.id_lot, this.id_malette).then(config => {
      this.viewer = this.pannellum.viewer('pano', config)
    })
  }
}
</script>
