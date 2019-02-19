<template>

  <div>
    <table class="footmark_table">
      <template v-for="dailyData in dailydataList">
        <tr>
          <td colspan="4" >
            <b>{{ dateFormat(dailyData.day) }}</b>
          </td>
        </tr>
        <tr class="footmark_row" v-for="(item, item_index) in dailyData.markList">
          <td class="footmark_time">{{ timeFormat(item.times[0]) }}</td>
          <td class="footmark_favicon">
            <FavIcon v-bind:iconUrl='item.favicon' />
          </td>
          <td class="footmark_title">
            <p v-bind:class="linkStyle(item.count)">
              <a v-bind:href="item.url" target="_blank">{{ item.title }}</a>
            </p>
          </td>
          <td class="footmark_stamp">
            <FootmarkButton @click="stamp(dailyData.day, item.url)" />
            {{ item.count }}
          </td>
        </tr>
      </template>
    </table>

  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';
import FootmarkButton from '../coms/FootmarkButton';
import FavIcon from '../coms/FavIcon';


export default {
  name: 'FootmarkList',
  mixins: [ FootStepUtils ],
  components: { FootmarkButton, FavIcon },
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
      const me = this;
      chrome.runtime.sendMessage({
          message: "getDailydataList",
          start: 0,
          days: 2
        },
        function(dailydataList) {
          me.dailydataList = dailydataList;
        }
      );
    },
    stamp: function(day, url) {
console.log("1 day:" + day);
      const me = this;


      chrome.runtime.sendMessage({
          message: "countUpStamp",
          day: day,
          url: url
        },
        //保存後イベント
        function(dailyData) {
console.log("2 day:" + day);

          for (let i=0; i<me.dailydataList.length; i++) {
console.log("3 day:" + me.dailydataList[i].day);
            if (me.dailydataList[i].day == day) {
              me.dailydataList[i] = dailyData;
              return;
            }
          }
        }
      );

      // for (let i=0; i<me.dailydataList.length; i++) {
      //   if (me.dailydataList[i].day == day) {
      //     //データ更新
      //     me.$set(me.dailydataList, i, dailyData);
      //     break;
      //   }
      // }
      //

    },
    timeFormat : function(unixtime){
      const d = new Date(unixtime);
      const hour = d.getHours();
      const min  = d.getMinutes();
      return hour + "時" + min + "分";
    },
    dateFormat : function(ymd) {
      const WeekChars = [ "日", "月", "火", "水", "木", "金", "土"];
      const y = parseInt(ymd.substring(0, 4));
      const m = parseInt(ymd.substring(5, 7));
      const d = parseInt(ymd.substring(8, 10));

      const date = new Date( y, m-1, d );
      const w = WeekChars[date.getDay()];

      return y + "年" + m + "月" + d + "日" + "（" + w + "）";
    },
    linkStyle : function (count) {
      const styles = ["link1", "link2", "link3", "link4", "link5"];
      return styles[count-1];
    }
  }
}


</script>



<style>
@import '../styles/FootStepStyle.css';




</style>
