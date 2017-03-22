<script>

  import { map } from 'lodash-es'
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
    computed: {
      styles() {
        return {
          transform: `scale(${this.engine.state.zoom/100.0}) translate(${this.engine.state.offsetX}px, ${this.engine.state.offsetY}px)`,
          width: '100%',
          height: '100%',
        }
      },
    },
    render(h) {

  		return h(
        'div',
        {
  				class:'node-view',
  				style:{
  					transform: 'scale('+this.engine.state.zoom/100.0+') translate('+this.engine.state.offsetX+'px,'+this.engine.state.offsetY+'px)',
  					width: '100%',
  					height: '100%'
  				}
  			},
  			map(this.engine.state.nodes, (node) => {
          const model = this.engine.getNodeFactory(node.type).generateModel(node, this.engine)
  				return h(
  					nodeWidget,
            {
              key: node.id,
              props: { node, engine: this.engine },
            },
  					[
              h(
                model.component,
                { props: model.propsData }
              )
            ]
          )
        })
  		)
  	}
  }

</script>
<!--  <template lang="jade">

  div.node-view(:style="styles")
    node-widget(:engine="engine", v-for="(node, index) in engine.state.nodes", :key="node.id", :node="node")
      component(v-if="model", :is="models[index].component", v-bind="models[index].component")

</template> -->


<style lang="scss">

</style>
