<template>
  <div>
    <table>
      <tr>
        <td><img v-bind:src='inputFavIconUrl' width="32px" height="32px" /></td>
        <td><input class="inputStyle" v-model="inputTitle"></td>
        <td><FootStampButton /></td>
      </tr>

      <tr v-for="item in listdata">
        <td><img v-bind:src='item.favIconUrl' width="32px" height="32px" /></td>
        <td align="left"><p class="overflow"><a href="{{ item.url }}" target="_blank">{{ item.title }}</a></p></td>
        <td><FootStampButton /></td>
      </tr>
    </table>
  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';
import FootStampButton from '../coms/FootStampButton';


export default {
  name: 'ListArea',
  mixins: [ FootStepUtils ],
  components: { FootStampButton },
  data() {
    return {
      listdata: JSON.parse(localStorage.dailyitems),
      inputTitle: '',
      inputFavIconUrl: ''
    }
  },
  mounted () {
    var me = this;
    this.getCurrentTab(function(tab){
       me.inputTitle = tab.title;
       me.inputFavIconUrl = tab.favIconUrl
    });
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

input.inputStyle {
  width: 400px;
}

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
