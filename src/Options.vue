<template>
  <div id="options">
    <button @click="viewStorage">保存データ　確認</button>
    <button @click="clearAll">保存データ　クリア</button>

<br>
<!--
<br>
<button @click="openNewTab">タブで開く</button>
    <button @click="btExport">エクスポート</button>
    <button @click="btImport">インポート</button>
    <input @change="btFileSelector" id="fileSelector" type="file" style="display: none">

<br>
<br>
<button @click="newBookmarks">ブックマーク作成</button>
<button @click="clearBookmarks">ブックマーク　クリア</button>

<br>
<br>
<button @click="testFunc">test</button>

-->

  </div>
</template>

<script>
import FootStepUtils from './mixins/FootStepUtils';
import ApiPromised from './mixins/ApiPromised';


export default {
  name: 'options',
  mixins: [ FootStepUtils, ApiPromised ],
  data() {
    return {
      storageDataList : {}
    }
  },
  methods: {
    viewStorage: function() {
      chrome.storage.local.get(null, function (data) {
        console.dir(data);
      });
    },
    clearAll: function() {
      chrome.storage.local.clear();
    },
    openNewTab: function() {
      chrome.tabs.create({url: "index.html"});
    },
    btViewStorage: function() {
      this.$set(this.storageDataList, "key", "value");
//      this.storageDataList["key"] = "value";
      for (let i=0; i<localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage[key];
//        this.storageDataList[key] = value;
          this.$set(this.storageDataList, key, value);
      }
    },
    btExport: function() {

      const date = new Date();

      //1行目はヘッダ情報
      let exportText = this.getExportFileHeader();
      //2行目以降本体
      for (let i=0; i<localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage[key];
        exportText += "\n" + key + "\t" + value;
      }
      const exportBlob = new Blob([exportText], {type: 'text/plain'});

      const filename = date.getFullYear()
              + ("00" + (date.getMonth()+1)).slice(-2)
              + ("00" + date.getDate()).slice(-2)
              + "_"
              + ("00" + date.getHours()).slice(-2)
              + ("00" + date.getMinutes()).slice(-2)
              + ("00" + date.getSeconds()).slice(-2)
              + ".footstep";

      const link = document.createElement('a');
      link.download = filename;
      link.target   = '_blank';
      //chromeのやり方
      link.href = window.URL.createObjectURL(exportBlob);
      link.click();

      alert("エクスポートを終了しました。");

    },
    btImport: function() {
      const ok = confirm("【警告】"
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
        for (let i=1; i<lines.length; i++) {
          let keyvalue = lines[i].split(/\t/);
          localStorage.setItem(keyvalue[0], keyvalue[1]);
        }

        alert("インポートを終了しました。");
      }
      //テキスト形式で読み込む
      reader.readAsText(targetFile);


    },
    newBookmarks: async function(e) {

      //Footstepディレクトリ取得
      const KeyFootstepFolderId = "KeyFootstepFolderId";
      const footstepDirId = localStorage.getItem(KeyFootstepFolderId);

      const startTime = Date.now();

      for (let y=2017; y<=2018; y++) {
        await chrome.bookmarks.create(
          {'parentId': footstepDirId, 'title': String(y)},
          async function(yearFolder) {

            for (let m=1; m<=12; m++) {
              await chrome.bookmarks.create(
                {'parentId': yearFolder.id, 'title': String(m)},
                async function(monthFolder) {

                  for (let d=1; d<=30; d++) {
                    await chrome.bookmarks.create(
                      {'parentId': monthFolder.id, 'title': String(d)},
                      async function(dayFolder) {

                        for (let i=1; i<=100; i++) {
                          await chrome.bookmarks.create(
                            {'parentId': dayFolder.id,
                            'title': 'RGBと16進数カラーコードの相互変換ツール - PEKO STEP',
                            'url': 'https://stackoverflow.com/questions/10257301/where-to-read-console-messages-from-background-js-in-a-chrome-extension?arg=' + y + "." + m + "." + d + "." + i},
                            async function(obj) {
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    },
    clearBookmarks: function(e) {
      const KeyFootstepFolderId = "KeyFootstepFolderId";
      localStorage.removeItem(KeyFootstepFolderId);

    },
    testFunc: async function(e) {
      const start = new Date().getTime();

      const nodes0 = await this.apiBookmarksGetChildren("0");

      for (let i=0; i<nodes0.length; i++) {
        const nodes1 = await this.apiBookmarksGetChildren(nodes0[i].id);
        for (let j=0; j<nodes1.length; j++) {
          if(nodes1[j].title == "Footstep") {
            break;
          }
        }
      }
      const end = new Date().getTime();
    }

  }
}




</script>

<style>
@import './styles/FootStepStyle.css';


#options {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
