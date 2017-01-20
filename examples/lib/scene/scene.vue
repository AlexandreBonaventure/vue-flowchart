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
  div
    |test
    canvas-widget(:engine="engine")

</template>

<style lang="css">

</style>
