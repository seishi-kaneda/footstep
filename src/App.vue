<template>
  <div id="app">
    <urllist></urllist>
    <button @click="buttonfunc">保存</button>
    <button @click="clearAll">クリア</button>
    <button @click="openNewTab">タブで開く</button>
    <button @click="btDebug">デバッグ</button>
  </div>
</template>

<script>
import Urllist from './urllist';

export default {
  name: 'app',
  components: {
    Urllist
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    buttonfunc: function () {
      // getCurrentTab(function(tab){
      //   if (!localStorage.dailyitems) {
      //     localStorage.dailyitems = [];
      //   }
      //
      //   var nowDate = new Date();
      //
      //   var item = {
      //     time: nowDate.getTime()
      //     , title:tab.title
      //     , url: tab.url
      //     , favIconUrl: tab.favIconUrl
      //   }
      //
      //   alert (localStorage.dailyitems.length);
      //
      //   localStorage.dailyitems.push(item);
      // });

      getCurrentTab(function(tab){
        var dailyitems;
        if (localStorage.getItem("dailyitems")) {
          dailyitems = JSON.parse(localStorage.getItem("dailyitems"));
        } else {
          dailyitems = [];
        }

        var nowDate = new Date();

        console.log("フットスタンプ:");
        console.log(JSON.stringify(tab));


        var item = {
          time: nowDate.getTime()
          , title:tab.title
          , url: tab.url
          , favIconUrl: tab.favIconUrl
        }

        dailyitems.push(item);

        localStorage.setItem("dailyitems", JSON.stringify(dailyitems));

      });

    },
    clearAll: function() {
      localStorage.clear();
      localStorage.counter = 0;
    },
    openNewTab: function() {
      chrome.tabs.create({url: "index.html"});
    },
    btDebug: function() {
      console.log("localStorage:");
      console.log(localStorage.getItem("dailyitems"));

    }
  }
}



function getCurrentTab(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    callback(tab);
  });

}



</script>

<style>
body {
  max-width: 415px;
  min-width: 380px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
