<template>
  <img id="favIcon" v-bind:src='iconUrl' class='favicon' @error="onErrorImage" @load="onLoadImage" />
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';


export default {
  name: 'FavIcon',
  components: { },
  mixins: [ FootStepUtils ],
  props: {
    iconUrl: {type: String, default: ""}
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    onErrorImage: function(event) {
      event.target.style.visibility='hidden'
    },
    onLoadImage: function(event) {
      event.target.style.visibility='visible'
    }
  }
}


</script>

<style>
@import '../styles/FootStepStyle.css';

img.favicon {
  width: 24px;
  height: 24px;
}


</style>
