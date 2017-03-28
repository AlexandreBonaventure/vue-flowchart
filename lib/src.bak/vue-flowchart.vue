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
    props: {
      data: {
        required: true,
      },
      nodeTemplates: {
        default: () => [
           DEFAULT_TEMPLATE
        ]
      },
      options: {
        default: () => DEFAULTS_OPTS
      },
    },
    components: {
      canvasWidget,
    },
    created() {
      ([DEFAULT_TEMPLATE, ...this.nodeTemplates]).forEach(([ type, component, opts = {}]) => {
        const engine = this.engine
        this.engine.registerNodeFactory({
          type,
          generateModel(model) {
            return {
              component,
              propsData: {
                removeAction: () => {
                  engine.removeNode(model)
                },
                // color: model.data.color,
                node: model,
                // name: model.data.name,
                // inPorts: model.data.inVariables,
                // outPorts: model.data.outVariables,
                ...model.data,
                ...opts,
              }
            }
          }
        })
      })
      const { onNodeRemove, onEdgeRemove, onEdgeUpdate } = this.options
      this.engine.registerValidators({ onNodeRemove, onEdgeRemove, onEdgeUpdate })
      this.initializeModel()
    },
    watch: {
      data: {
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
      },
      addNode(node) {
        this.engine.addNode(node)
      },
      removeNode(id, bypassValidation = false) {
        this.engine.removeNode(id, bypassValidation)
      },
      addLink(link, bypassValidation = false) {
        this.engine.addLink(link, bypassValidation)
      },
      removeLink(id) {
        this.engine.removeLink(id)
      },
    },
    destroyed() {
      this.engine.removeListener(this._listenerID)
    },
    mounted() {
      var listenerID = this.engine.registerListener(({ type, data = {} }) => {
        this.$emit(type, data)
      })
      this._listenerID = listenerID
    },
  }

</script>

<template>

  <div class="vue-flowchart">
    <canvas-widget :engine="engine"></canvas-widget>
  </div>

</template>

<style lang="scss">

.vue-flowchart {
  width: 100%;
  height: 100%;
}

</style>
