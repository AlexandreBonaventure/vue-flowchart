<script>
  import canvasWidget from './components/CanvasWidget.vue'
  import Engine from './Engine.js'
  import engineFactory from './test/engineFactory.js'


  export default {
    components: {
      canvasWidget,
    },
    data() {
      return {
        engine: engineFactory(),
      }
    }
  }

</script>

<template lang="jade">
  div.scene
    canvas-widget(:engine="engine")

</template>

<style lang="css">
.scene {
  width: 100%;
  height: 100%;
}

</style>
