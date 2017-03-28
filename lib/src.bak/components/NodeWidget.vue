<script>

  // import { map } from 'lodash-es'

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
          top: `${this.node.y}px`,
          left: `${this.node.x}px`,
        }
      },
      classes() {
        return 'node'+ (this.engine.state.selectedNode && this.engine.state.selectedNode.id == this.node.id ? ' selected' : '')
      },
    },
  }

</script>

<template>

  <div :style="styles" :class="classes" :data-nodeid="node.id" @mousedown="onMouseDown">
    <slot></slot>
  </div>


</template>

<style lang="scss">

</style>
