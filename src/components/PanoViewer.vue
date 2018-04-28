<template>
   <div id="pano">
   </div>
</template>

<script>
import '../../node_modules/pannellum/build/pannellum.css'
import pannellum from '../../node_modules/pannellum/build/pannellum.js'

console.log(pannellum)

export default {
  name: 'PanoViewer',
  data () {
    return {}
  },
  watch: {
    pannellum: function () {
      console.log(pannellum)
    }
  }
}
</script>
