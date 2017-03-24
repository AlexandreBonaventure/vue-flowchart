<script>
  import vueFlowchart from '../../../index.js'
  import fixtureDatas from '../../../test/fixtureDatas.js'
  import customWidget from './custom/CustomWidget.vue'
  export default {
    components: {
      vueFlowchart,
    },
    data() {
      return {
        data: fixtureDatas(),
        // data: null,
        templates: [
          ['custom', customWidget],
        ],
        options: {
          onEdgeRemove() {
            const confirm = window.confirm('Are you sure to delete this link ?')
            return Promise.resolve(confirm)
          },
          onNodeRemove() {
            const confirm = window.confirm('Are you sure to delete this node ?')
            return Promise.resolve(confirm)
          },
          onEdgeUpdate() {
            const confirm = window.confirm('Are you sure you want to connect ?')
            return Promise.resolve(confirm)
          },
        },
      }
    },
    mounted() {
      // setInterval(() => {
      //   this.data = fixtureDatas()
      //   console.log(this.data);
      // }, 1000)
    },
    methods: {
      log(...args) {
        console.log(...args);
      },
      addNode() {
        const flowchart = this.$refs.flowchart
        const node = {
          id: flowchart.engine.UID(),
          type: 'default',
          data: {
            name: "New node",
          },
          x: Math.random(5) * 100 ,
          y: Math.random(5) * 100,
        }
        flowchart.addNode(node)
      },
      removeRandomNode() {
        const flowchart = this.$refs.flowchart
        const nodes = Object.values(flowchart.engine.state.nodes)
        const id = nodes[Math.round(Math.random(nodes.length - 1))]
        flowchart.removeNode(id)
      },
    },
  }

</script>

<template lang="jade">

div.scene
  button(type="button", @click="addNode") Add a node
  button(type="button", @click="removeRandomNode") Remove a node
  vue-flowchart(
    ref="flowchart",
    :data="data",
    :node-templates="templates",
    :options="options",
    @link:select="log('selected link', $arguments)",
    @link:add="log('new link', $arguments)",
    @link:remove="log('deleted link', $arguments)",
    @node:select="log('selected node', $arguments)",
    @node:add="log('new node', $arguments)",
    @node:remove="log('deleted node', $arguments)",
  )
  //- customWidget(slot="custom")

</template>

<style lang="css">
.scene {
  width: 100%;
  height: 100%;
}

</style>
