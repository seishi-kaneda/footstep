<template>

  <div class="list_div">
    <template v-for="dailyData in dailydataList">
      <div v-bind:class="dayboxStyle(dailyData.ymd)" >
        <table class="footmark_table">
          <tr>
            <td colspan="4" >
              <p class="datetitle">{{ dateFormat(dailyData.ymd) }}</p>
            </td>
          </tr>
          <tr class="footmark_row" v-for="(item, item_index) in dailyData.footmarks">
            <td class="footmark_time">{{ timeFormat(item.dateAdded) }}</td>
            <td class="footmark_favicon">
              <FavIcon v-bind:iconUrl='item.faviconUrl' />
            </td>
            <td class="footmark_title">
              <p v-bind:class="linkStyle(item.stampCount)">
                <a @click="linkFootmark(item)">{{ item.title }}</a>
              </p>
            </td>
            <td class="footmark_stamp">
              <FootmarkButton :enable="item.canStamp" @click="stamp(item)" />
            </td>
          </tr>
        </table>
      </div>
    </template>

    <table>
      <tr>
        <td colspan="4" >
          <a class="method" @click="showMore" v-show="showMoreVisible">続きを表示</a>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>

import FootStepUtils from '../mixins/FootStepUtils';
import MessageDeliver from '../mixins/MessageDeliver';
import FootmarkButton from '../coms/FootmarkButton';
import FavIcon from '../coms/FavIcon';

const MaxStampCount = 4;

export default {
  name: 'FootmarkList',
  mixins: [ FootStepUtils, MessageDeliver ],
  components: { FootmarkButton, FavIcon },
  props: {
  },
  data() {
    return {
      dailydataList : [],
      showMoreVisible: true
    }
  },
  async created () {
    const todayYmd = this.getYmd(new Date());
    this.dailydataList = await this.getDailyListForDays(todayYmd, 2);
    this.updateCanStamp(this.dailydataList);
  },
  methods: {
    reloadToday: async function() {
      const todayYmd = this.getYmd(new Date());
      const todayData = await this.getDailyData(todayYmd);

      let found = false;
      for (let i=0; i<this.dailydataList.length; i++) {
        if (this.dailydataList[i].ymd == todayYmd) {
          found = true;
          if (todayData == undefined) {
            //今日データが無くなった場合
            this.dailydataList.splice(i, 1);
          } else {
            //今日データが更新された場合
            this.dailydataList.splice(i, 1, todayData);
          }
          break;
        }
      }

      //今日データが作成された
      if (!found) {
        if (todayData != undefined) {
          this.dailydataList.unshift(todayData);
        }
      }
      this.updateCanStamp(this.dailydataList);
    },
    //スタンプボタンの可・不可を切り替え
    updateCanStamp: async function(dailyList) {
      let todayData = undefined;
      const todayYmd = this.getYmd(new Date());
      for (let i=0; i<dailyList.length; i++) {
        if (dailyList[i].ymd == todayYmd) {
          todayData = dailyList[i];
        }
      }

      const todayUrlMap = [];
      if (todayData != undefined) {
        for (let footmark of todayData.footmarks) {
//          this.todayUrlMap.splice(footmark.url, 1, footmark);
//          this.$set(this.todayUrlMap, footmark.url, footmark);
          todayUrlMap[footmark.url] = footmark;
        }
      }

      for (let daily of dailyList) {
        for (let footmark of daily.footmarks) {

          if (daily.ymd == todayYmd) {
            //今日
            if (footmark.stampCount >= MaxStampCount) {
              //最大スタンプカウント
              footmark.canStamp = false;
            } else {
              footmark.canStamp = true;
            }
          } else {
            //過去
            if (todayUrlMap[footmark.url] == undefined) {
              //今日に未登録
              footmark.canStamp = true;
            } else {
              //今日に登録済み
              footmark.canStamp = false;
            }
          }

        }
      }
    },
    stamp: async function(footmark) {
      //スタンプ
      const todayData = await this.stampFootmark(footmark);
      //今日データリロード
      await this.reloadToday();

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
    dayboxStyle : function (ymd) {
      const todayYmd = this.getYmd(new Date());
      if (ymd ==todayYmd) {
        return "todaybox";
      } else {
        return "daybox";
      }
    },
    showMore: async function () {
      //最後の日
      const lastYmd = this.dailydataList[this.dailydataList.length - 1].ymd;
      const nextYmd = String(parseInt(lastYmd) - 1); //日付として不正であっても良い

      const addList = await this.getDailyListForDays(nextYmd, 3);

      if (addList.length == 0) {
        this.showMoreVisible = false;
      } else {
        for (let dailyData of addList) {
          this.dailydataList.push(dailyData);
        }

        this.updateCanStamp(this.dailydataList);
      }
    },
    linkFootmark: async function (item) {
      await this.apiTabsCreate({'url':item.url, 'active':false});
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
