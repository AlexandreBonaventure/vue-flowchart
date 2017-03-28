<script>
  import scene from './scene/scene.vue'

  export default {
    components: {
      scene,
    },
    name: 'app',
  }
</script>

<template lang="jade">
  div#app
    scene
</template>

<style lang="css">
* {

	margin: 0;
	padding: 0;
}
html,body, #app{
	width: 100%;
	height: 100%;
	background: rgb(60,60,60);
	display: flex;
}
</style>
