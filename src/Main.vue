<template>
  <div id="main">
    <table>
      <tr>
        <td></td>
        <td><img id="favIcon" v-bind:src='tabFavIconUrl' class='favicon' @error="onErrorImage" @load="onLoadImage" /></td>
        <td><input class="inputStyle" v-model="tabTitle"></td>
        <td><FootStampButton @click="clickNewStamp" /></td>
      </tr>
    </table>
    <template v-if="isShowFootmarkList">
      <ListArea ref="footMarkList" ></ListArea>
    </template>
    <template v-else>
      <a @click="recentFootmark">最近のフットマークを表示</a>
    </template>
  </div>
</template>

<script>
import ListArea from './coms/ListArea';
import FootStampButton from './coms/FootStampButton';
import FootStepUtils from './mixins/FootStepUtils';

export default {
  name: 'main',
  components: { ListArea, FootStampButton },
  mixins: [ FootStepUtils ],
  props: {
    // isShowFootmarkList : {type: Boolean, default: false},
    // tabTitle : {type: String, default: ""},
    // tabUrl : {type: String,default: ""},
    // tabFavIconUrl : {type: String,default: ""}
  },
  data () {
    return {
      isShowFootmarkList : false,
      tabTitle: "",
      tabUrl: "",
      tabFavIconUrl: undefined
    }
  },
  mounted () {
    var me = this;
    this.getCurrentTab(function(tab){
       me.tabTitle = tab.title;
       me.tabFavIconUrl = tab.favIconUrl
       me.tabUrl = tab.url;
    });
  },
  methods: {
    recentFootmark: function() {
      this.isShowFootmarkList = true;
    },
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
        //保存後イベント
        function(dailyData) {

          if (me.isShowFootmarkList) {
            me.$refs.footMarkList.reload();
//            me.$refs.footMarkList.updateDailyData(dailyData);
          } else {
            me.isShowFootmarkList = true;
          }
        }
      );
    },
    onErrorImage: function(event) {
      event.target.style.visibility='hidden'
    },
    onLoadImage: function(event) {
      event.target.style.visibility='visible'
    }
  }
}


</script>

<style>
body {
  min-width: 600px;
}
a {
  cursor:pointer;
  text-decoration: underline;
  color: #42b983;
}


 #main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


img.favicon {
  width: 24px;
  height: 24px;
}

input.inputStyle {
  width: 400px;
}

td {
  table-layout: fixed;
}

/* h1, h2 {
  font-weight: normal;
}  */

</style>
