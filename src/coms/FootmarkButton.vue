<template>
  <div>
    <button @click="btFootmark">スタンプ</button>
  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';


export default {
  name: 'FootmarkButton',
  mixins: [ FootStepUtils ],
  data() {
    return {
    }
  },
  methods: {
    btFootmark: function () {
      this.$emit('click')
    }
  }
}





</script>

<style>
@import '../styles/FootStepStyle.css';

</style>
