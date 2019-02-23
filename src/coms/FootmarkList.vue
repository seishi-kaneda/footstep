<template>

  <div class="list_div">
    <table class="footmark_table">
      <template v-for="dailyData in dailydataList">
        <tr>
          <td colspan="4" >
            <b>{{ dateFormat(dailyData.ymd) }}</b>
          </td>
        </tr>
        <tr class="footmark_row" v-for="(item, item_index) in dailyData.footmarkList">
          <td class="footmark_time">{{ timeFormat(item.dateAdded) }}</td>
          <td class="footmark_favicon">
            <FavIcon v-bind:iconUrl='item.faviconUrl' />
          </td>
          <td class="footmark_title">
            <p v-bind:class="linkStyle(item.stampCount)">
              <a v-bind:href="item.url" target="_blank">{{ item.title }}</a>
            </p>
          </td>
          <td class="footmark_stamp">
            <FootmarkButton @click="stamp(item)" />
          </td>
        </tr>
      </template>
      <tr>
        <td colspan="4" >
          <a @click="showMore">続きを表示</a>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>

import BookmarksStorage from '../mixins/BookmarksStorage';
import FootStepUtils from '../mixins/FootStepUtils';
import FootmarkButton from '../coms/FootmarkButton';
import FavIcon from '../coms/FavIcon';


export default {
  name: 'FootmarkList',
  mixins: [ FootStepUtils, BookmarksStorage ],
  components: { FootmarkButton, FavIcon },
  props: {
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
    reload: async function() {
      const todayYmd = this.getYmd(new Date());
      this.dailydataList = await this.getDailyListForDays(todayYmd, 2);
    },
    stamp: async function(item) {
      console.dir(item);
      //スタンプ
      const newFootmark = await this.stampFootmark(item);
      //リロード
      this.dailydataList = await this.getDailyListForDays(0, 2);
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
      const m = parseInt(ymd.substring(4, 6));
      const d = parseInt(ymd.substring(6, 8));

      const date = new Date( y, m-1, d );
      const w = WeekChars[date.getDay()];

      return y + "年" + m + "月" + d + "日" + "（" + w + "）";
    },
    linkStyle : function (count) {
      const styles = ["link1", "link2", "link3", "link4", "link5"];
      return styles[count-1];
    },
    showMore: function () {
      //最後の日
      const lastYmd = dailydataList[dailydataList.length - 1].ymd;
      const nextYmd = String(parseInt(lastYmd) - 1); //日付として不正であっても良い

//      this.dailydataList = await this.getDailyListForDays(0, 2);

    }
  }
}


</script>



<style>
@import '../styles/FootStepStyle.css';

div.list_div {
  width: 700px;
  height: 400px;
  overflow-y: scroll;
}


</style>
