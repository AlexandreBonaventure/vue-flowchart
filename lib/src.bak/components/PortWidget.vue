<script>

  // import { map } from 'lodash-es'

  export default {
    name: "PortWidget",
    props: {
			name: {
        default: 'unknown'
      },
			node: {},
		},
    data() {
      return {
        selected: false,
      }
    },
    methods: {
      onMouseEnter(){
        this.selected = true
      },
      onMouseLeave(){
        this.selected = false
      },
    },
    computed: {
      classes() {
        return `port${this.selected ? ' selected' : ''}`
      },
    },
  }

</script>

<template >

  <div :class="classes" :data-nodeid="node.id" :data-name="name" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
  </div>

</template>

<style lang="scss">

</style>
