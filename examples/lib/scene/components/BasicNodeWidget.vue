<script>

  // import { map } from 'lodash'
  import portWidget from './PortWidget.vue'

  export default {
    name: "BasicNodeWidget",
    components: {
      portWidget,
    },
    props: {
      name: { default: 'Node' },
			node: {},
			inPorts: { default: () => [] },
			outPorts: { default: () => [] },
			color: { default: 'rgb(50,50,50)' },
			removeAction: { default: () => (() => { console.log("remove node")}) },
		},
    data() {
      return {}
    },
    methods: {
      onMouseDown(){
        this.engine.setSelectedNode(this.node)
      },
      getName(port) {
        return typeof port === 'object' ? port.name : port
      },
      getDisplay(port) {
        return typeof port === 'object' ? port.display : port

      },
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
      formattedInPorts() {
        return Array.isArray(this.inPorts) ? this.inPorts : [this.inPorts]
      },
      formattedOutPorts() {
        return Array.isArray(this.outPorts) ? this.outPorts : [this.outPorts]
      },
    },
  }

</script>

<template lang="jade">

  div.basic-node(:style="{ backgroundColor: color }")
    .title
      .name {{ name }}
      .fa.fa-close(@click="removeAction")
    .ports
      .in
        .in-port(v-for="port in formattedInPorts", :key="port")
          port-widget(:name='getName(port)', :node='node')
          .name {{ getDisplay(port) }}
      .out
        .out-port(v-for="port in formattedOutPorts", :key="port")
          port-widget(:name='port', :node='node')
          .name {{ getDisplay(port) }}

</template>

<style lang="css">

</style>
