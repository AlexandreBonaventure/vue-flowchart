<script>

  import { map } from 'lodash-es'
  import nodeWidget from './NodeWidget.vue'

  export default {
    name: "NodeViewWidget",
    components: {
      nodeWidget,
    },
    inject: ['engine'],
    computed: {
      styles() {
        return {
          transform: `scale(${this.engine.state.zoom/100.0}) translate(${this.engine.state.offsetX}px, ${this.engine.state.offsetY}px)`,
          width: '100%',
          height: '100%',
        }
      },
    },
    // render(h) {
    //
  	// 	return h(
    //     'div',
    //     {
  	// 			class:'node-view',
  	// 			style:{
  	// 				transform: 'scale('+this.engine.state.zoom/100.0+') translate('+this.engine.state.offsetX+'px,'+this.engine.state.offsetY+'px)',
  	// 				width: '100%',
  	// 				height: '100%'
  	// 			}
  	// 		},
  	// 		map(this.engine.state.nodes, (node) => {
    //       const model = this.engine.getNodeFactory(node.type).generateModel(node, this.engine)
  	// 			return h(
  	// 				nodeWidget,
    //         {
    //           key: node.id,
    //           props: { node, engine: this.engine },
    //         },
  	// 				[
    //           h(
    //             model.component,
    //             { props: model.propsData }
    //           )
    //         ]
    //       )
    //     })
  	// 	)
  	// }
  }

</script>
<template>
  <div class="node-view" :style="styles">
    <slot></slot>
  </div>
</template>


<style lang="scss">

</style>
