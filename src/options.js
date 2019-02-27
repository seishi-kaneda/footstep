import 'babel-polyfill'
import Vue from 'vue'
import Options from './Options.vue'

import FootStepUtils from './mixins/FootStepUtils';

Vue.mixin(FootStepUtils);

new Vue({
  el: '#options',
  render: h => h(Options)
})
