<script>
  import vueFlowchart from '../../../lib/src/vue-flowchart.vue'
  import fixtureDatas from '../../../test/fixtureDatas.js'

  export default {
    components: {
      vueFlowchart,
    },
    data() {
      return {
        data: fixtureDatas(),
      }
    },
    mounted() {
      setInterval(() => {
        this.data = fixtureDatas()
      }, 5000)
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
  @link:add="log",
  @link:remove="log",
  @node:add="log",
  @node:remove="log",
)

</template>

<style lang="css">
.scene {
  width: 100%;
  height: 100%;
}

</style>
