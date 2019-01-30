<template>
  <div id="options">
    <button @click="clearAll">保存データクリア</button>
    <button @click="openNewTab">タブで開く</button>
<br>
<br>
    <button @click="btExport">エクスポート</button>
    <button @click="btImport">インポート</button>
    <input @change="btFileSelector" id="fileSelector" type="file" style="display: none">

<br>
<br>



  </div>
</template>

<script>

import FootStepUtils from './mixins/FootStepUtils';


export default {
  name: 'options',
  mixins: [ FootStepUtils ],
  data() {
    return {
      storageDataList : {}
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

      //1行目はヘッダ情報
      var exportText = this.getExportFileHeader();
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

      alert("エクスポートを終了しました。");

    },
    btImport: function() {
      var ok = confirm("【警告】"
            + "\nこの操作は現在のデータを全て消去し、"
            + "\nインポートファイルのデータで置き換えます。"
            + "\n実施してもよろしいですか？");
      if (!ok) {
        return;
      }

      document.getElementById('fileSelector').click();


    },
    btFileSelector: function(e) {
      const targetFile = e.target.files[0];

      //FileReaderの作成
      const reader = new FileReader();

      //読込終了後の処理
      const me = this;
      reader.onload = function(ev){
        const fileText = reader.result;

        if (!me.checkImportFile(fileText)) {
          alert("無効なファイルです。");
          return;
        }

        //全クリア
        localStorage.clear();

        //これ5MBあったら重いだろうな・・ライン読み込み要調査
        const lines = fileText.split(/\n/);
        //本体は２行目から
        for (var i=1; i<lines.length; i++) {
          let keyvalue = lines[i].split(/\t/);
          localStorage.setItem(keyvalue[0], keyvalue[1]);
        }

        alert("インポートを終了しました。");
      }
      //テキスト形式で読み込む
      reader.readAsText(targetFile);


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
