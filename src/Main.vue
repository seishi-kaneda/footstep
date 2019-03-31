<template>
  <div id="main">
<!--
    <div id="header">
      <a class="method" href="options.html">設定</a>
    </div>
-->
    <div class="maintitle">Footstep</div>

    <table class="footmark_table">
      <tr>
        <td class="footmark_time"></td>
        <td class="footmark_favicon">
          <FavIcon v-bind:iconUrl='pageFavIconUrl' />
        </td>
        <td class="footmark_title">
          <input class="input_title" v-model="inputTitle">
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
      inputTitle: "",
      pageTitle: "",
      pageFavIconUrl: "",
      pageUrl: ""
    }
  },
  created () {
    this.logtime("Main.created start");
    this.getCurrentTab().then((tab) => {
      this.inputTitle = tab.title;
      this.pageTitle = tab.title;
      this.pageFavIconUrl = tab.favIconUrl;
      this.pageUrl = tab.url;
      this.logtime("Main.getCurrentTab end");
    });
    this.logtime("Main.created end");
  },
  mounted () {
    this.logtime("Main.mounted start");
    this.logtime("Main.mounted end");
  },
  methods: {
    clickNewMark: async function () {

      const footmark = {
        'title':this.inputTitle,
        'originTitle':this.pageTitle,
        'url':this.pageUrl,
        'faviconUrl':this.pageFavIconUrl,
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



</style>
