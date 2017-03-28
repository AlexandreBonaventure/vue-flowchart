<script>

  // import { map } from 'lodash-es'
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
			port: { default: () => 'default' },
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
        if (!this.inPorts.length && !this.outPorts.length) {
          return [this.port]
        } else {
          return Array.isArray(this.inPorts) ? this.inPorts : [this.inPorts]
        }
      },
      formattedOutPorts() {
        return Array.isArray(this.outPorts) ? this.outPorts : [this.outPorts]
      },
    },
  }

</script>

<template>

  <div class="basic-node" :style="{ backgroundColor: color }">
    <div class="title">
      <div class="name">
        {{ name }}
      </div>
      <div class="fa fa-close" @click="removeAction"></div>
    </div>
    <div class="ports">
      <div class="in">
        <div class="in-port" v-for="port in formattedInPorts" :key="port">
          <port-widget :name='getName(port)' :node='node'></port-widget>
          <div class="name">
            {{ getDisplay(port) }}
          </div>
        </div>
        <div class="out-port" v-for="port in formattedOutPorts" :key="port">
          <port-widget :name='getName(port)' :node='node'></port-widget>
          <div class="name">
            {{ getDisplay(port) }}
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<style lang="scss">

</style>
