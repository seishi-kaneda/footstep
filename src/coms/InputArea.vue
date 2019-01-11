<template>
  <div>
    <button @click="btFootStamp">フットスタンプ</button>
    <input v-model="inputTitle">
{{ inputTitle }}
<!--
    <textarea v-model="inputMemo" placeholder="memo"></textarea>
-->
  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';


export default {
  name: 'InputArea',
  mixins: [ FootStepUtils ],
  data() {
    return {
      inputTitle: 'Welcome to Your Vue.js App'
    }
  },
  created () {
    // getCurrentTab(function(tab){
    //   this.inputTitle = tab.title;
    // });
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

td {
  table-layout: fixed;
}

p.overflow {
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

</style>
