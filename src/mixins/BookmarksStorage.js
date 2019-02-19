import ApiPromised from './ApiPromised';


const FootstepFolderName = "Footstep System Folder [Don't touch]";


const MaxStampCount = 5;

const TitleSplitChar = '^';

export default {
  mixins: [ ApiPromised ],
  methods: {
    createYmdList: async function() {
      const ymdList = [];

      const footstepDirNode = this.getFootstepSystemFolder();

      const yyNodes = await this.apiBookmarksGetChildren(footstepDirNode.id);
      for (let y=0; y<yyNodes.length; y++) {
        const yNode = yyNodes[y];
        const mmNodes = await this.apiBookmarksGetChildren(yNode.id);
        for (let m=0; m<mmNodes.length; m++) {
          const mNode = mmNodes[m];
          const ddNodes = await this.apiBookmarksGetChildren(mNode.id);
          for (let d=0; d<ddNodes.length; d++) {
            const dNode = ddNodes[d];
            if (!this.checkYmd(yNode.title, mNode.title, dNode.title)) {
              //ymdエラー。消した方がいい？
            } else {
              const ymd = yNode.title + mNode.title + dNode.title;
              ymdList.push(ymd);
            }
          }
        }
      }

      //降順ソート
      ymdList.sort(function(a, b) {
        return a > b;
      })
      return ymdList;
    },
    getDailyListForDays: async function(startYmd, dayCount) {

      const targetYmdList = [];
      const allYmdList = this.createYmdList();

      for (let i=0; i<allYmdList.length; i++) {
        const ymd = allYmdList[i];
        if (startYmd <= ymd) {
          targetYmdList.push(ymd);
        }
        if (targetYmdList.count >= dayCount) {
          break;
        }
      }

      const dailyList = [];
      for (let i=0; i<targetYmdList.length; i++) {
        const ymd = targetYmdList[i];
        const dailyData = {
          'ymd': ymd,
          'footmarkList': this.getFootmarkListOnDay(ymd)
        }
        dailyList.push(dailyData);
      }
      return dailyList;
    },
    getFootmarkListOnDay: async function(ymd) {

      const footmarks = [];
      const dir = this.getOrCreateYmdDir(ymd, false);
      if (dir != undefined) {
        const bookmarks = await this.apiBookmarksGetChildren(dir.id);
        for (let i=0; i<bookmarks.length; i++) {
          footmarks.push(this.footFromBook(bookmarks[i]));
        }
      }
      return footmarks;
    },
    /**
    * ブックマーク(またディレクトリ）を作成or取得。
    *
    * @param {object{parentId,url,title}} bookmark ブックマーク情報
    * @param {bool} doCreate 無かった場合、作成する
    * @param {fuction(node)} callback コールバック
    */
    getOrCreateBookmark: async function(bookmark, doCreate) {

      //子ノード取得
      const nodes = await apiBookmarksGetChildren(bookmark.parentId);
      for (let i=0; i<nodes.length; i++) {
        const node = nodes[i];
        //url指定が無いならフォルダー:title一致
        if (bookmark.url == undefined) {
          if (node.title == bookmark.title) {
            return node;
          }
        //url指定なら、ブックマーク:url一致
        } else {
          if (node.url == bookmark.url) {
            return node;
          }
        }
      }

      //見つからなかった場合
      if (doCreate) {
        //作成
        const node = await this.apiBookmarksCreate(bookmark);
        return node;
      } else {
        return undefined;
      }
    },
    getFootstepSystemFolder : async function() {
      const nodes0 = await this.apiBookmarksGetChildren("0");

      for (let i=0; i<nodes0.length; i++) {
        const nodes1 = await this.apiBookmarksGetChildren(nodes0[i].id);
        for (let j=0; j<nodes1.length; j++) {
          if(nodes1[j].title == FootstepFolderName) {
            return nodes1[j];
          }
        }
      }

      //見つからなかったら作成
      const newNode = await apiBookmarksCreate({'title':FootstepFolderName}});
      return newNode;
    },
    getOrCreateYmdDir: async function(ymd, doCreate) {
      const yy = ymd.substring(0, 4);
      const mm = ymd.substring(4, 6);
      const dd = ymd.substring(6, 8);

      const footstepDirNode = this.getFootstepSystemFolder();

      if (doCreate) {

        const yyNode = getOrCreateBookmark({'parentId':footstepDirNode.id, 'title':yy}, false);
        if (yyNode == undefined) {
          return undefined;
        }
        const mmNode = getOrCreateBookmark({'parentId':yyNode.id, 'title':mm}, false);
        if (mmNode == undefined) {
          return undefined;
        }
        const ddNode = getOrCreateBookmark({'parentId':mmNode.id, 'title':dd}, false);
        return ddNode;

      } else {

        const yyNode = getOrCreateBookmark({'parentId':footstepDirNode.id, 'title':yy}, true);
        const mmNode = getOrCreateBookmark({'parentId':yyNode.id, 'title':mm}, true);
        const ddNode = getOrCreateBookmark({'parentId':mmNode.id, 'title':dd}, true);
        return ddNode;
      }

    },
    //スタンプ処理
    stampFootmark: async function(footmark) {

      //今日ディレクトリを取得or作成
      const today = new Date();
      const ymdToday = this.getYmd(today);
      const todayDir = this.getOrCreateYmdDir(ymdToday, true);

      //今日ディレクトリから同じurlのブックマークを探索
      const todayBookmarks = await apiBookmarksGetChildren(todayDir.id);
      let sameBookmark = undefined;
      for (let i=0; i<todayBookmarks.length; i++) {
        const node = todayBookmarks[i];
        if (node.url == footmark.url) {
          sameBookmark = node;
          break;
        }
      }

      //今日同じデータが無い場合、新規作成
      if (sameBookmark == undefined) {

        const newBookmark = this.bookFromFoot(footmark);
        const createdBookmark = await this.apiBookmarksCreate(
                              {'parentId': ddNode.id,
                                 'title': newBookmark.title,
                                 'url': newBookmark.url
                               });
        return createdBookmark;

      //今日同じデータがある場合、それを更新
      } else {

        //最大カウントチェック
        const tmpFootmark = this.footFromBook(bookmark);
        if (tmpFootmark.stampCount >= MaxStampCount) {
          //最大の場合、更新せず終了
          return;
        }

        //カウントアップ
        tmpFootmark.stampCount++;
        const tmpBookmark = bookFromFoot(tmpFootmark);

        const updatedBookmark = await this.apiBookmarksUpdate(
                      tmpBookmark.id,
                      {'title': tmpBookmark.title});
        return updatedBookmark;
      }
    },

    bookFromFoot: function(footmark) {
      const bookmark = {
        'id': footmark.bookmarkId,
        'url': footmark.url,
        'dateAdded':footmark.dateAdded
      };

      bookmark.title = footmark.title
          + TitleSplitChar + "" //予約1
          + TitleSplitChar + "" //予約2
          + TitleSplitChar + "" //予約3
          + TitleSplitChar + "" //予約4
          + TitleSplitChar + "" //予約5
          + TitleSplitChar + "" //予約6
          + TitleSplitChar + "" //予約7
          + TitleSplitChar + footmark.faviconUrl
          + TitleSplitChar + footmark.stampCount
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

      //ブックマークはユーザーにより修正できる。
      //修正されているかもしれないことを前提にチェックし、可能な限り動作させる。

      const params = bookmark.title.split(TitleSplitChar);
      const TitleParamLength = 10;
      if (params.length < TitleParamLength) {
        //エラー。パラメータが足りない。おそらく^が消された。
        footmark['title'] = bookmark.title;
        footmark['stampCount'] = 1;
        footmark['faviconUrl'] = "";
      } else {

        //tileには、^が含まれる可能性がある。なので、数が多ければ連結する。
        const join_count = params.length-TitleParamLength+1;
        let title = "";
        for (let i=0; i<join_count; i++) {
          title += params[i];
        }
        footmark['title'] = title;

        //favIconUrl。エラーの場合は画像が表示されないので、ここではチェックしない。
        footmark['faviconUrl'] = params[TitleParamLength-2];

        //stampCountの数値チェック
        let stampCount = parseInt(params[TitleParamLength-1]);
        if (isNan(stampCount)
            || stampCount < 1
            || stampCount > MaxStampCount) {
          stampCount = 1;
        }
        footmark['stampCount'] = stampCount;
      }
      return footmark;
    },
    getYmd: function(date) {
      const yy = date.getFullYear();
      const mm = ("00" + (dt.getMonth()+1)).slice(-2);
      const dd = ("00" + dt.getDate()).slice(-2);
      const result = yy + mm + dd;
      return result;
    },
    checkYmd: function(yy, mm, dd) {
      if(yy==null || yy.length != 4 || isNaN(yy)){
        return false;
      }
      if(mm==null || mm.length != 2 || isNaN(mm)){
        return false;
      }
      if(dd==null || dd.length != 2 || isNaN(dd)){
        return false;
      }

      var y = parseInt(yy);
      var m = parseInt(mm)-1;  //月は0～11で指定するため-1しています。
      var d = parseInt(dd);
      var dt = new Date(y, m, d);

      return (y == dt.getFullYear() && m == dt.getMonth() && d == dt.getDate());
    }
  }
}