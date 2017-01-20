<script>

  import { map } from 'lodash'
  import nodeWidget from './NodeWidget.vue'

  export default {
    name: "NodeViewWidget",
    components: {
      nodeWidget,
    },
    props: {
			engine: {
        required: true,
      },
		},
    data() {
      return {
        models: [],
      }
    },
    created() {
      // this.generateModels(this.engine.state.nodes)
    },
    methods: {
      generateModels(nodes) {
        return this.model = nodes.map((node) => this.engine.getNodeFactory(node.type).generateModel(node, this.engine))
      },
    },
    computed: {
      styles() {
        return {
          transform: `scale(${this.engine.state.zoom/100.0}) translate(${this.engine.state.offsetX}px, ${this.engine.state.offsetY}px)`,
          width: '100%',
          height: '100%',
        }
      },
      nodeComponent() {
        return this.model && this.model.component
      },
      nodePropsData() {
        return this.model && this.model.propsData
      },
    },
    render(h) {

  		return h(
        'div',
        {
  				className:'node-view',
  				style:{
  					transform: 'scale('+this.engine.state.zoom/100.0+') translate('+this.engine.state.offsetX+'px,'+this.engine.state.offsetY+'px)',
  					width: '100%',
  					height: '100%'
  				}
  			},
  			map(this.engine.state.nodes, (node) =>
  				h(
  					nodeWidget,
            {
              props: { key: node.id, node, engine: this.engine },
            },
  					[
              h(
                this.engine.getNodeFactory(node.type).generateModel(node, this.engine).component,
                { props: { key: node.id, node, engine: this.engine } }
              )
            ]
          )
  			)
  		)
  	}
  }

</script>
<!--  <template lang="jade">

  div.node-view(:style="styles")
    node-widget(:engine="engine", v-for="(node, index) in engine.state.nodes", :key="node.id", :node="node")
      component(v-if="model", :is="models[index].component", v-bind="models[index].component")

</template> -->


<style lang="css">

</style>
