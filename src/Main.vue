<template>
  <div id="main">
    <a href="options.html">オプション</a>
    <br>
    <br>

    <table class="footmark_table">
      <tr>
        <td class="footmark_time"></td>
        <td class="footmark_favicon">
          <FavIcon v-bind:iconUrl='tabFavIconUrl' />
        </td>
        <td class="footmark_title">
          <input class="input_title" v-model="tabTitle">
        </td>
        <td class="footmark_stamp">
          <FootmarkButton @click="clickNewMark" />
        </td>
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
import BookmarksStorage from './mixins/BookmarksStorage';
import FavIcon from './coms/FavIcon';


export default {
  name: 'main',
  components: { FootmarkList, FootmarkButton, FavIcon },
  mixins: [ FootStepUtils, BookmarksStorage ],
  props: {
  },
  data () {
    return {
      isShowFootmarkList : true,
      tabTitle: "",
      tabUrl: "",
      tabFavIconUrl: undefined
    }
  },
  async mounted () {
    const tab = await this.getCurrentTab();
    this.tabTitle = tab.title;
    this.tabFavIconUrl = tab.favIconUrl;
    this.tabUrl = tab.url;
},
  methods: {
    recentFootmark: function() {
      this.isShowFootmarkList = true;
    },
    clickNewMark: async function () {

      const footmark = {
        'title':this.tabTitle,
        'url':this.tabUrl,
        'favicon':this.tabFavIconUrl,
        'stampCount':1
      };

      const newFootmark = await this.stampFootmark(footmark);

      //リロード
      this.$refs.footmarkList.reload();
    }
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
