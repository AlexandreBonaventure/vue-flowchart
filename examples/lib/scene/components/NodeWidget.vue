<script>

  // import { map } from 'lodash'

  export default {
    name: "NodeWidget",
    props: {
			engine: {
        required: true,
      },
			node: {
        required: true,
      },
		},
    data() {
      return {
        mouseDown: false,
      }
    },
    methods: {
      onMouseDown(){
        this.engine.setSelectedNode(this.node)
      }
    },
    computed: {
      styles() {
        return {
          top: this.node.y,
          left: this.node.x,
        }
      },
      classes() {
        return 'node'+ (this.engine.state.selectedNode && this.engine.state.selectedNode.id == this.node.id ? ' selected' : '')
      },
    },
  }

</script>

<template lang="jade">

  div(:style="styles", :class="classes", :data-nodeid="node.id", @mousedown="onMouseDown")
    slot

</template>

<style lang="css">

</style>
