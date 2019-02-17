const ExportFileHeader = "FootStep LocalStrage Data.";

const KeyFootstepFolderId = "KeyFootstepFolderId";

const MaxStampCount = 5;

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
    /**
    * ブックマーク(またディレクトリ）を作成or取得。
    *
    * @param {object{parentId,url,title}} bookmark ブックマーク情報
    * @param {bool} doCreate 無かった場合、作成する
    * @param {fuction(node)} callback コールバック
    */
    getBookmark: function(bookmark, doCreate, callback) {
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
          if (doCreate) {
            chrome.bookmarks.create(
              bookmark,
              function(newNode) {
                //見つからなかった、作った
                callback(newNode);
              }
            );
          } else {
            //見つからなかった、作らなかった
            callback(undefined);
          }
        //見つかった場合、終了
        } else {
          //見つかった
          callback(retNode);
        }
      });
    },
    getOrCreateYmdFolder: function(ymd, callback) {

      const footstepDirId = localStorage.getItem(KeyFootstepFolderId);
      const yy = ymd.substring(0, 4);
      const mm = ymd.substring(4, 6);
      const dd = ymd.substring(6, 8);

      //年ディレクトリを取得or作成
      getBookmark({'parentId':footstepDirId, 'title':yy}, true,
        function(yyNode){
          //月ディレクトリを取得or作成
          getBookmark({'parentId':yyNode.id, 'title':mm}, true,
            function(mmNode){
              //日ディレクトリを取得or作成
              getBookmark({'parentId':mmNode.id, 'title':dd}, true,
                function(ddNode){
                  callback(ddNode);
                });
            });
        });
    }, getSameBookmarkToday: function(url, callback) {

      //今日ディレクトリを取得or作成
      const today = new Date();
      const ymdToday = this.getYmd(today);
      this.getOrCreateYmdFolder(ymdToday, function(nodeToday) {

        //今日ブックマークリストを取得
        chrome.bookmarks.getSubTree(bookmark.parentId, (nodes) => {
          for (let i=0; i<nodes.length; i++) {
            const bookmark = nodes[i];
            if (bookmark.url == url) {
              //同じurlのブックマークが見つかった
              callback(nodeToday, bookmark);
              break;
            }
          }
          //見つからなかった
          callback(nodeToday, undefined);
        });
      });
    },
    stampFootmark2: function(footmark, callback) {

      const today = new Date();
      const ymdToday = this.getYmd(today);


      if (footmark.bookmarkId == undefined || footmark.ymd != ymdToday) {
        //新規または過去の場合、今日データの存在チェック。新規作成

      } else {
        //今日データの場合、スタンプをカウントアップして更新

      }

      if (footmark.ymd == ymdToday) {
        //今日データの場合、スタンプ回数アップで更新
      } else {
        //今日データではない場合、
          // 新規作成

      }


      //今日Bookmarkに同じurlがあれば取得
      this.getSameBookmarkToday(url, (nodeToday, bookmark) => {

        //今日ディレクトリ内に同じurlが無ければ、ブックマーク新規保存
        if (bookmark == undefined) {
          const newBookmark = this.bookFromFoot(footmark);
          chrome.bookmarks.create({'parentId': nodeToday.id,
                                   'title': newBookmark.title,
                                   'url': newBookmark.url
                                 },function(createdBookmark) {
            //【あとで対応】その日のリストを更新して返却
            callback(createdBookmark);
            return;
          });

          //今日ディレクトリ内に同じurlがあれば、そのスタンプ回数をカウントアップ。
        } else {
          const tmpFootmark = this.footFromBook(bookmark);

          //最大カウントチェック
          if (tmpFootmark.stampCount >= MaxStampCount) {
            //【あとで対応】その日のリストを更新して返却
            callback(bookmark);
            return;
          }

          tmpFootmark.stampCount++;
          const tmpBookmark = bookFromFoot(tmpFootmark);
          chrome.bookmarks.update(
            tmpBookmark.id,
            {'title': tmpBookmark.title},
            function(updatedBookmark) {
              //【あとで対応】その日のリストを更新して返却
              callback(updatedBookmark);
              return;
            });
        }
      });
    },
    bookFromFoot: function(footmark) {
      const bookmark = {
        'id': footmark.bookmarkId,
        'url': footmark.url,
        'dateAdded':footmark.dateAdded
      };

      bookmark.title = footmark.title
          + TitleSplitChar + footmark.title
          + TitleSplitChar + footmark.title
          ;
      return bookmark;
    },
    footFromBook: function(bookmark) {
      const footmark = {
        'bookmarkId': bookmark.id,
        'url': bookmark.url,
        'dateAdded': bookmark.dateAdded,
        'ymd': this.getYmd(new Date(bookmark.dateAdded))
      };

      const params = bookmark.title.split(TitleSplitChar);
      footmark.title = params[0];
      footmark.stampCount = parseInt(params[1]);
      footmark.faviconUrl = params[2];
      return footmark;
    },
    getYmd: function(date) {
      const yy = date.getFullYear();
      const mm = ("00" + (dt.getMonth()+1)).slice(-2);
      const dd = ("00" + dt.getDate()).slice(-2);
      const result = yy + mm + dd;
      return result;
    },
    getFootmarksByDays: function(startYmd, dayCount, callback) {
    },
    createYmdList: function() {

      const footstepDirId = localStorage.getItem(KeyFootstepFolderId);

      // //フォルダー取得
      // chrome.bookmarks.getSubTree(footstepDirId, (yNodes) => {
      //   let retNode = undefined;
      //   for (let i=0; i<yNodes.length; i++) {
      //
      //   }
      // });


      //
      // const yy = ymd.substring(0, 4);
      // const mm = ymd.substring(4, 6);
      // const dd = ymd.substring(6, 8);
      //
      // //年ディレクトリを取得or作成
      // getBookmark({'parentId':footstepDirId, 'title':yy}, true,
      //   function(yyNode){
      //     //月ディレクトリを取得or作成
      //     getBookmark({'parentId':yyNode.id, 'title':mm}, true,
      //       function(mmNode){
      //         //日ディレクトリを取得or作成
      //         getBookmark({'parentId':mmNode.id, 'title':dd}, true,
      //           function(ddNode){
      //             callback(ddNode);
      //           });
      //       });
      //   });

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
