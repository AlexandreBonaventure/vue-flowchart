<script>

  import _ from 'lodash-es'
  import linkWidget from './LinkWidget.vue'

  export default {
    name: "SVGWidget",
    components: {
      linkWidget,
    },
    props: {
			engine: {
        required: true,
      },
      newPoint: {
        default(link,pointID) {

  			}
      }
		},
    data() {
      return {}
    },
    computed: {
      styles() {
        return {
          transform: `scale(${this.engine.state.zoom/100.0}) translate(${this.engine.state.offsetX}px, ${this.engine.state.offsetY}px)`,
          width: '100%',
          height: '100%',
        }
      },
    },
  }

</script>

<template>

  <svg class="storm-flow-canvas" :style="styles">
    <link-widget :engine="engine" v-for="link in engine.state.links" :key="link.id" :link="link" :new-point="newPoint"></link-widget>
  </svg>

</template>

<style lang="scss">
  .iframe {
    pointer-events: none;
    background-color: grey;
  }
</style>
