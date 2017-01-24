<script>
  import canvasWidget from './components/CanvasWidget.vue'
  import basicNodeWidget from './components/BasicNodeWidget.vue'
  import Engine from './Engine.js'

  export default {
    props: {
      data: {
        required: true,
      },
    },
    components: {
      canvasWidget,
    },
    created() {
      this.engine.registerNodeFactory({
        type:'default',
        generateModel(model) {
          return {
            component: basicNodeWidget,
            propsData: {
              removeAction: () => {
                this.engine.removeNode(model)
              },
              color: model.data.color,
              node: model,
              name: model.data.name,
              inPorts: model.data.inVariables,
              outPorts: model.data.outVariables
            }
          }
        }
      });
      this.initializeModel()
    },
    watch: {
      data: {
        deep: true,
        handler() {
          this.initializeModel()
        }
      }
    },
    data() {
      return {
        engine: Engine(),
      }
    },
    methods: {
      initializeModel() {
        this.engine.loadModel(this.data)
        this.$nextTick(() => {
          this.engine.generateLinkPoints()
        })
      }
    }
  }

</script>

<template>

  <div class="vue-flowchart">
    <canvas-widget :engine="engine"></canvas-widget>
  </div>

</template>

<style lang="css">

.vue-flowchart {
  width: 100%;
  height: 100%;
}

</style>
