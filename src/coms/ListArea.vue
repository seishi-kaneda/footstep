<template>

  <div>
    <table>
      <tr>
        <td></td>
        <td><img id="favIcon" v-bind:src='tabFavIconUrl' width="32px" height="32px" @error="onErrorImage" /></td>
        <td><input class="inputStyle" v-model="tabTitle"></td>
        <td><FootStampButton @click="clickNewStamp" /></td>
      </tr>
      <tr height="40">
        <td> </td>
      </tr>
      <template v-for="dailyData in dailydataList">
        <tr>
          <td colspan="3" >
            <b>{{ dateFormat(dailyData.day) }}</b>
          </td>
        </tr>
        <tr v-for="item in dailyData.stampList">
          <td>{{ timeFormat(item.times[0]) }}</td>
          <td><img v-bind:src='item.favicon' width="32px" height="32px" @error="onErrorImage" /></td>
          <td align="left"><p class="overflow"><a v-bind:href="item.url" target="_blank">{{ item.title }}</a></p></td>
          <td><FootStampButton /></td>
        </tr>
      </template>
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
  props: {
    // dailydataList: {
    //   type: Array,
    //   default: []
    // },
    tabTitle : {
      type: String,
      default: ""
    },
    tabUrl : {
      type: String,
      default: ""
    },
    tabFavIconUrl : {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dailydataList : []
    }
  },
  mounted () {
    var me = this;
    this.getCurrentTab(function(tab){
       me.tabTitle = tab.title;
       me.tabFavIconUrl = tab.favIconUrl
       me.tabUrl = tab.url;
    });

    chrome.runtime.sendMessage({
        message: "getDailydataList",
        start: 0,
        days: 3
      },
      function(dailydataList) {
        console.log(dailydataList);
        me.dailydataList = dailydataList;
      }
    );


  },
  methods: {
    clickNewStamp: function () {
      var me = this;

      var ymd = this.getNowYMD();
      var stampData = {
        count:1,
        times:[new Date().getTime()],
        title:this.tabTitle,
        url:this.tabUrl,
        favicon:this.tabFavIconUrl
      }

      chrome.runtime.sendMessage({
          message: "saveNewStamp",
          day: ymd,
          stampData: stampData
        },
        function(dailyData) {

//          me.dailydataList = dailydataList;
//          me.$forceUpdate();


        }
      );
    },
    onErrorImage: function(event) {
      event.target.style.display='none'
    },
    timeFormat : function(unixtime){
      var d = new Date(unixtime);
      var hour = d.getHours();
      var min  = d.getMinutes();
      return hour + ":" + min;
    },
    dateFormat : function(ymd) {
      var WeekChars = [ "日", "月", "火", "水", "木", "金", "土"];
      var y = parseInt(ymd.substring(0, 4));
      var m = parseInt(ymd.substring(5, 7));
      var d = parseInt(ymd.substring(8, 10));

      var date = new Date( y, m-1, d );
      var w = WeekChars[date.getDay()];

      return y + "年" + m + "月" + d + "日" + "（" + w + "）";
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
