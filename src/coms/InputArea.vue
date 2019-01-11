<template>
  <div>
    <button @click="btFootStamp">フットスタンプ</button>
  </div>
</template>

<script>

export default {
  name: 'InputArea',
  data() {
    return {
      listdata: JSON.parse(localStorage.dailyitems)
    }
  },
  methods: {
    btFootStamp: function () {
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

    }
  }
}



function getCurrentTab(callback) {
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
