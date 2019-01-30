<template>

  <div>
    <table>
      <template v-for="dailyData in dailydataList">
        <tr>
          <td colspan="3" >
            <b>{{ dateFormat(dailyData.day) }}</b>
          </td>
        </tr>
        <tr v-for="item in dailyData.stampList">
          <td align="left">{{ timeFormat(item.times[0]) }}</td>
          <td><FavIcon v-bind:iconUrl='item.favicon' /></td>
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
import FavIcon from '../coms/FavIcon';


export default {
  name: 'FootmarkList',
  mixins: [ FootStepUtils ],
  components: { FootStampButton, FavIcon },
  props: {
    // dailydataList: {
    //   type: Array,
    //   default: []
    // },
  },
  data() {
    return {
      dailydataList : []
    }
  },
  mounted () {
    this.reload();
  },
  methods: {
    reload: function() {
      var me = this;
      chrome.runtime.sendMessage({
          message: "getDailydataList",
          start: 0,
          days: 3
        },
        function(dailydataList) {
          me.dailydataList = dailydataList;
        }
      );
    },
    // updateDailyData: function(dailyData) {
    //   for (var i=0; i<me.dailydataList.length; i++) {
    //     if (me.dailydataList[i].day == ymd) {
    //       //データ更新
    //       me.$set(me.dailydataList, i, dailyData);
    //       break;
    //     }
    //   }
    // },
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

          for (var i=0; i<me.dailydataList.length; i++) {
            if (me.dailydataList[i].day == ymd) {
              //データ更新
              me.$set(me.dailydataList, i, dailyData);
              break;
            }
          }
        }
      );
    },
    timeFormat : function(unixtime){
      var d = new Date(unixtime);
      var hour = d.getHours();
      var min  = d.getMinutes();
      return hour + "時" + min + "分";
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
@import '../styles/FootStepStyle.css';


</style>
