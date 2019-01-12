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
      // getCurrentTab(function(tab){
      //   var dailyitems;
      //   if (localStorage.getItem("dailyitems")) {
      //     dailyitems = JSON.parse(localStorage.getItem("dailyitems"));
      //   } else {
      //     dailyitems = [];
      //   }
      //
      //   var nowDate = new Date();
      //
      //   console.log("フットスタンプ:");
      //   console.log(JSON.stringify(tab));
      //
      //   var item = {
      //     time: nowDate.getTime()
      //     , title:tab.title
      //     , url: tab.url
      //     , favIconUrl: tab.favIconUrl
      //   }
      //
      //   dailyitems.push(item);
      //
      //   localStorage.setItem("dailyitems", JSON.stringify(dailyitems));
      //
      // });

    }
  }
}





</script>

<style>

</style>
