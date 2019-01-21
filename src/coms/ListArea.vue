<template>

  <div>

    <table>
      <tr>
        <td><img id="favIcon" v-bind:src='tabFavIconUrl' width="32px" height="32px" @error="onErrorImage" /></td>
        <td><input class="inputStyle" v-model="tabTitle"></td>
        <td><FootStampButton @click="clickNewStamp" /></td>
      </tr>
    </table>

    <table>
      <tr v-for="listdata in dailydataList">
        <td>
          <table>
            <tr v-for="item in listdata">
              <td>{{ item.times[0] }}</td>
              <td><img v-bind:src='item.favicon' width="32px" height="32px" /></td>
              <td align="left"><p class="overflow"><a href="{{ item.url }}" target="_blank">{{ item.title }}</a></p></td>
              <td><FootStampButton /></td>
            </tr>
          </table>
        </td>
      </tr>
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
    dailydataList: {
      type: Array,
      default: []
    },
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
        function(dailydataList) {
          me.dailydataList = dailydataList;
        }
      );
    },
    onErrorImage: function(event) {
      event.target.style.display='none'
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
