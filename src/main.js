import Vue from 'vue'
import App from './App.vue'

import FootStepUtils from './mixins/FootStepUtils';

Vue.mixin(FootStepUtils);

new Vue({
  el: '#app',
  render: h => h(App)
})
