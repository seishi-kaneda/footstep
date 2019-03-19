<template>
  <div id="main">
    <div id="header">
      <a class="method" href="options.html">設定</a>
    </div>

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
    <FootmarkList ref="footmarkList" ></FootmarkList>
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
  mixins: [ FootStepUtils],
  props: {
  },
  data () {
    return {
      tabTitle: "",
      tabUrl: "",
      tabFavIconUrl: undefined
    }
  },
  async mounted () {
    console.log("mounted 0");
    const res = await this.apiRuntimeSendMessage("apiRuntimeSendMessage");
    console.log("mounted 1");
    console.log("res:" + res);
    console.log("mounted 2");

    const tab = await this.getCurrentTab();
    this.tabTitle = tab.title;
    this.tabFavIconUrl = tab.favIconUrl;
    this.tabUrl = tab.url;
},
  methods: {
    clickNewMark: async function () {

      const footmark = {
        'title':this.tabTitle,
        'url':this.tabUrl,
        'faviconUrl':this.tabFavIconUrl,
        'stampCount':1
      };
      //作成
      const newFootmark = await this.stampFootmark(footmark);

      //リロード
      this.$refs.footmarkList.reloadToday();
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
  margin-top: 0px;
}

#header {
  text-align: right;
  margin-bottom: 40px;
  color: #2c3e50;
}

</style>
