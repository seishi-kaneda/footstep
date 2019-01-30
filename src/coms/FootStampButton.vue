<template>
  <div>
    <button @click="btFootStamp">スタンプ</button>
  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';


export default {
  name: 'FootStampButton',
  mixins: [ FootStepUtils ],
  data() {
    return {
    }
  },
  methods: {
    btFootStamp: function () {
      this.$emit('click')
    }
  }
}





</script>

<style>
@import '../styles/FootStepStyle.css';

</style>
