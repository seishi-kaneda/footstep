<template>
  <div>
    <img class="footmark_button"
        @click="btFootmark"
        :src="stampImage">
  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';

import enableImage from '../assets/footstep_24_red.png'
import disableImage from '../assets/footstep_24_gray.png'

export default {
  name: 'FootmarkButton',
  props: {
    enable: {
      type: Boolean,
      default: true
    }
  },
  mixins: [ FootStepUtils ],
  data() {
    return {
      stampImage: undefined
    }
  },
  mounted () {
    this.stampImage = this.enable ? enableImage : disableImage;
  },
  methods: {
    btFootmark: function () {
      if (this.enable) {
        this.$emit('click');
      }
    },
    imageUrl: function () {
//      return enableImage;
      return require('../assets/footstep_24_red.png');
      // return this.enable ? '../assets/footstep_24_red.png'
      //     : '../assets/footstep_24_gray.png';
    }
  },
  watch: {
    enable: function(newVal) {
      return newVal ? enableImage : disableImage;
    }
  }
}





</script>

<style>
@import '../styles/FootStepStyle.css';


img.footmark_button:hover{

	/* 透明度を上げることで、画像の色を薄く見せる。*/
	opacity:0.5;

	/* リンクをホバーしたときのカーソルにする。*/
	cursor: pointer;
}

/* twitter画像をクリックした瞬間 */
img.footmark_button:active{

	/* 要素を若干下に下げることで、押した感じを出す。*/

	/* 今いる位置から相対的に3px下に配置する。*/
	position: relative;
	top: 3px;

}

</style>
