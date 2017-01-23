import Vue from 'vue'

//PLUGINS


import app from './app.vue'

const App = Vue.extend(app)
const vm = new App().$mount('#app')
