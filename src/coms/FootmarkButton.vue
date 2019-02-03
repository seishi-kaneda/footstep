<template>
  <div>
    <img class="footmark_button" @click="btFootmark" src="../assets/footstep_24_red.png">
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
