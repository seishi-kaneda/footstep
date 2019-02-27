import 'babel-polyfill'

import Vue from 'vue'
import Main from './Main.vue'

import FootStepUtils from './mixins/FootStepUtils';

Vue.mixin(FootStepUtils);

new Vue({
  el: '#main',
  render: h => h(Main)
})
