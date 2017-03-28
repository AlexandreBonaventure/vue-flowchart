<script>
  import canvasWidget from './components/CanvasWidget.vue'
  import basicNodeWidget from './components/BasicNodeWidget.vue'
  import Engine from './Engine.js'

  const DEFAULT_TEMPLATE = ['default', basicNodeWidget, {}]

  const validatorNoop = (node) => { return Promise.resolve(true) }

  const DEFAULTS_OPTS = {
    onNodeRemove: validatorNoop,
    onEdgeRemove: validatorNoop,
    onEdgeUpdate: validatorNoop,
  }


  export default {
    components: {
      canvasWidget,
    },
    provide: {
      engine: Engine
    },
    render(h) {
      debugger
      const nodeComponents = this.slots.default.map(slot => typeof slot)
      return h('canvas-widget', {
        props: { zoom: 100 },

      })
    }
  }

</script>

<!--template>
  <div class="vue-flowchart">
    <h1>test</h1>
    <canvas-widget></canvas-widget>
  </div>
</template-->

<style lang="scss">

.vue-flowchart {
  width: 100%;
  height: 100%;
}

</style>
