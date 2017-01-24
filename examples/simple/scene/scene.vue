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
        templates: [
          ['custom', customWidget],
        ]
      }
    },
    mounted() {
      // setInterval(() => {
      //   this.data = fixtureDatas()
      // }, 5000)
    },
    methods: {
      log(...args) {
        console.log(...args);
      }
    },
  }

</script>

<template lang="jade">

vue-flowchart(
  :data="data",
  :node-templates="templates",
  @link:add="log('new link', $arguments)",
  @link:remove="log('deleted link', $arguments)",
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
