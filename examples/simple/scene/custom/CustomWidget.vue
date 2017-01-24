<script>

  // import { map } from 'lodash-es'
  import { portWidget } from '../../../../index.js'

  export default {
    name: "BasicNodeWidget",
    components: {
      portWidget,
    },
    props: {
      name: { default: 'Node' },
			node: {},
			inOutVariables: { default: () => [] },
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
        return Array.isArray(this.inOutVariables) ? this.inOutVariables : [this.inOutVariables]
      },
    },
  }

</script>

<template>

  <div class="custom-node">
    <div class="title">
      <div class="name">
          custom: {{ name }}
      </div>
      <!-- <div class="fa fa-close" @click="removeAction"></div> -->
    </div>
    <div class="ports">
      <div class="in">
        <div class="in-port" v-for="port in formattedInPorts" :key="port">
          <port-widget :name='getName(port)' :node='node'></port-widget>
          <!-- <div class="name">
            {{ getDisplay(port) }}
          </div> -->
        </div>
      </div>
    </div>
  </div>


</template>

<style lang="scss">
  .custom-node {
    padding: 50px;
    background: white;
    text-align: center;
    border: 1px solid #000;
    .port {
      position: absolute;
      top: 0;
      right: 0;
      margin: 18px;
      background-color: rgb(1,231,231);
    }
  }

</style>
