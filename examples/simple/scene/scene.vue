<script>
  import vueFlowchart from '../../../index.js'
  import vueFlowchart from '../../../index.js'

  export default {
    components: {
      vfcChart: vueFlowchart,
      vfcChart: vueFlowchart,
    },
    data() {
      return {
        options: {
          autoLayout: true,
        },
      }
    },
    methods: {

    },
  }

</script>

<template lang="jade">

div.scene
  //- button(type="button", @click="addNode") Add a node
  //- button(type="button", @click="removeRandomNode") Remove a node
  vfc-chart(ref="flowchart", options="options")
    vfc-node(id="1")
    vfc-node(id="2")
    vfc-edge(v="1", w="2")

</template>

<style lang="css">
.scene {
  width: 100%;
  height: 100%;
}

</style>
