<template>
  <div id="options">
    <button @click="clearAll">保存データクリア</button>
    <button @click="openNewTab">タブで開く</button>
    <button @click="btViewStorage">保存データ表示</button>
    <button @click="btExport">エクスポート</button>

<br>
    <table>
      <tr v-for="(value, key) in storageDataList">
        <td>
          {{ key }}
        </td>
        <td>
          {{ value }}
        </td>
      </tr>
    </table>



  </div>
</template>

<script>


export default {
  name: 'options',
  data() {
    return {
      storageDataList : {a:"b"}
    }
  },
  methods: {
    clearAll: function() {
      localStorage.clear();
      localStorage.counter = 0;
    },
    openNewTab: function() {
      chrome.tabs.create({url: "index.html"});
    },
    btViewStorage: function() {
      this.$set(this.storageDataList, "key", "value");
//      this.storageDataList["key"] = "value";
      for (var i=0; i<localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage[key];
//        this.storageDataList[key] = value;
          this.$set(this.storageDataList, key, value);
      }
    },
    btExport: function() {

      var date = new Date();
      var manifest = chrome.runtime.getManifest();

      //1行目はヘッダ情報
      var exportText = "FootStep LocalStrage Data."
                    + "\tver:\t" + manifest.version
                    + "\ttime:\t" + date.getTime();
      //2行目以降本体
      for (var i=0; i<localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage[key];
        exportText += "\n" + key + "\t" + value;
      }
      var exportBlob = new Blob([exportText], {type: 'text/plain'});

      var filename = date.getFullYear()
              + ("00" + (date.getMonth()+1)).slice(-2)
              + ("00" + date.getDate()).slice(-2)
              + "_"
              + ("00" + date.getHours()).slice(-2)
              + ("00" + date.getMinutes()).slice(-2)
              + ("00" + date.getSeconds()).slice(-2)
              + ".footstep";

      var link = document.createElement('a');
      link.download = filename;
      link.target   = '_blank';
      //chromeのやり方
      link.href = window.URL.createObjectURL(exportBlob);
      link.click();

    }
  }
}

</script>

<style>
body {
  min-width: 600px;
}

#options {
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



a {
  color: #42b983;
}
</style>
