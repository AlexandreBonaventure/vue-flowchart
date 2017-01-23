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
    }
  }

</script>

<template lang="jade">

vue-flowchart(:data="data")

</template>

<style lang="css">
.scene {
  width: 100%;
  height: 100%;
}

</style>
