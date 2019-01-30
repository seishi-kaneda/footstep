<template>
  <div id="main">
    <table>
      <tr>
        <td></td>
        <td><FavIcon v-bind:iconUrl='tabFavIconUrl' /></td>
        <td><input class="inputStyle" v-model="tabTitle"></td>
        <td><FootmarkButton @click="clickNewMark" /></td>
      </tr>
    </table>
    <template v-if="isShowFootmarkList">
      <FootmarkList ref="footmarkList" ></FootmarkList>
    </template>
    <template v-else>
      <a @click="recentFootmark">最近のフットマークを表示</a>
    </template>
  </div>
</template>

<script>
import FootmarkList from './coms/FootmarkList';
import FootmarkButton from './coms/FootmarkButton';
import FootStepUtils from './mixins/FootStepUtils';
import FavIcon from './coms/FavIcon';


export default {
  name: 'main',
  components: { FootmarkList, FootmarkButton, FavIcon },
  mixins: [ FootStepUtils ],
  props: {
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
    const me = this;
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
    clickNewMark: function () {
      const me = this;

      const ymd = this.getNowYMD();
      const markData = {
        count:1,
        times:[new Date().getTime()],
        title:this.tabTitle,
        url:this.tabUrl,
        favicon:this.tabFavIconUrl
      }

      chrome.runtime.sendMessage({
          message: "saveNewMark",
          day: ymd,
          markData: markData
        },
        //保存後イベント
        function(dailyData) {

          if (me.isShowFootmarkList) {
            me.$refs.footmarkList.reload();
//            me.$refs.footmarkList.updateDailyData(dailyData);
          } else {
            me.isShowFootmarkList = true;
          }
        }
      );
    },
  }
}


</script>

<style>
@import './styles/FootStepStyle.css';


 #main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


</style>
