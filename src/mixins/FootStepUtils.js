const ExportFileHeader = "FootStep LocalStrage Data.";

const KeyFootstepFolderId = "KeyFootstepFolderId";

const TitleSplitChar = '^';

export default {
  methods: {
    getCurrentTab : function(callback) {
      const queryInfo = {
        active: true,
        currentWindow: true
      };

      chrome.tabs.query(queryInfo, (tabs) => {
        callback(tabs[0]);
      });
    },
    saveFootmark: function(footmark, callback) {

    },
    /**
    * ブックマーク(またhディレクトリ）を作成or取得。
    *
    * @param {object{parentId,url,title}} bookmark ブックマーク情報
    * @param {fuction(node)} callback コールバック
    */
    getOrCreateBookmark: function(bookmark, callback) {
      //フォルダー取得
      chrome.bookmarks.getSubTree(bookmark.parentId, (nodes) => {
        let retNode = undefined;
        for (let i=0; i<nodes.length; i++) {
          const node = nodes[i];
          //url指定が無いならフォルダー:title一致
          if (bookmark.url == undefined) {
            if (node.title == bookmark.title) {
              retNode = node;
              break;
            }
          //url指定なら、ブックマーク:url一致
          } else {
            if (node.url == bookmark.url) {
              retNode = node;
              break;
            }
          }
        }
        //見つからなかった場合、作成
        if (retNode == undefined) {
          chrome.bookmarks.create(
            bookmark,
            function(newNode) {
              callback[newNode];
            }
          );
        //見つかった場合、終了
        } else {
          callback[retNode];
        }
      });
    },
    getOrCreateYmdFolder: function(ymd, callback) {

      const footstepDirId = localStorage.getItem(KeyFootstepFolderId);
      const yy = ymd.substring(0, 4);
      const mm = ymd.substring(4, 6);
      const dd = ymd.substring(6, 8);

      //年ディレクトリを取得
      getOrCreateBookmark({'parentId':footstepDirId, 'title':yy},
        function(yyNode){
          //月ディレクトリを取得
          getOrCreateBookmark({'parentId':yyNode.id, 'title':mm},
            function(mmNode){
              //日ディレクトリを取得
              getOrCreateBookmark({'parentId':mmNode.id, 'title':dd},
                function(ddNode){
                  callback(ddNode);
                });
            });
        });
    },
    stampFootmark2: function(footmark) {

      //今日ディレクトリを検索
      const today = new Date();
      const ymdToday = this.getYmd(today);
      this.getOrCreateYmdFolder(ymdToday, function(nodeToday) {

        //今日ディレクトリ内に、同じurlが無いか検索
        

      });


      //bookmarkオブジェクトに変換
      const bookmark = this.bookFromFoot(footmark);


      //今日のデータの場合、日付はそのまま
      if (footmark.ymd == ymdToday) {

      //昨日以前データの場合、日付を今日に変更。
      } else {

      }
    },
    bookFromFoot: function(footmark) {
      const bookmark = {
        'id': footmark.bookmarkId,
        'url': footmark.URL,
        'dateAdded':footmark.dateAdded
      };

      bookmark.title = footmark.title
          + TitleSplitChar + footmark.title
          + TitleSplitChar + footmark.title
          ;

    },
    getYmd: function(date) {
      const yy = date.getFullYear();
      const mm = ("00" + (dt.getMonth()+1)).slice(-2);
      const dd = ("00" + dt.getDate()).slice(-2);
      const result = yy + mm + dd;
      return result;
    },
    getNowYMD: function(){
      const dt = new Date();
      const y = dt.getFullYear();
      const m = ("00" + (dt.getMonth()+1)).slice(-2);
      const d = ("00" + dt.getDate()).slice(-2);
      const result = y + "/" + m + "/" + d;
      return result;
    },
    getExportFileHeader : function(){

      const date = new Date();
      const manifest = chrome.runtime.getManifest();

      //1行目はヘッダ情報
      const exportText = ExportFileHeader
                    + "\tver:\t" + manifest.version
                    + "\ttime:\t" + date.getTime();
      return exportText;

    },
    checkImportFile : function(importText){
      return importText.startsWith(ExportFileHeader);
    }
  }
}
