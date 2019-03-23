import {Utils} from './Utils';
import {Footmark} from './Types';
import {Dailydata} from './Types';

const STORAGE_KEY_YYMM_LIST: string = "STORAGE_KEY_YYMM_LIST";

export default class StorageAccess {

  public constructor() {
  }

  public async getStoredYmdList(): Promise<string[]> {
    const ymdList:string[] = Array();
    const yymmList:string[] = await this.getStorage(STORAGE_KEY_YYMM_LIST, Array());
console.log("bg getStoredYmdList yymmList");
console.dir(yymmList);

    for (let yymm of yymmList) {
      const ddList:string[] = await this.getStorage(yymm, Array());
      //todo ループより配列結合の関数
      for (let ymd of ddList) {
        ymdList.push(ymd);
      }
    }
console.log("getStoredYmdList");
console.dir(ymdList);
    return ymdList;
  }


  private setStorage(key:string, value:any):Promise<void> {
    return new Promise<void>( (resolve) => {
      const param:any = new Object();
      param[key] = value;
      chrome.storage.local.set(param, () => resolve());
    });
  }

  private getStorage(key:string, def:any):Promise<any> {
    return new Promise<any>( (resolve) => {
      const keys:any = new Object();
      keys[key] = def;
      chrome.storage.local.get(keys, (items:any) => {
console.log("getStorage key:" + key);
console.dir(items);


        // const item:any = tmp_item==undefined ? def : tmp_item;
        resolve(items[key]);
      });
    });
  }

  public async saveDailydata(dailydata:Dailydata) {

    //ymd登録処理
    const ymdList = await this.getStoredYmdList();
    if (!Utils.isContain(ymdList, dailydata.ymd)) {
      //未登録ymdの場合
      const yymmList:string[] = await this.getStorage(STORAGE_KEY_YYMM_LIST, Array());
      const yymm:string = dailydata.ymd.substring(0, 6);
      if (!Utils.isContain(yymmList, yymm)) {
        //新しいyymmを登録する
        yymmList.push(yymm);
        //降順ソート
        yymmList.sort( function(a:string, b:string) {
          return parseInt(b) - parseInt(a);
        });
        //yymmList保存
        await this.setStorage(STORAGE_KEY_YYMM_LIST, yymmList);
        //yymm保存
        await this.setStorage(yymm, [dailydata.ymd]);
      } else {

        const ymdListInYYMM:string[] = await this.getStorage(yymm, Array());
        ymdListInYYMM.push(dailydata.ymd);
        //降順ソート
        ymdListInYYMM.sort( function(a:string, b:string) {
          return parseInt(b) - parseInt(a);
        });
        //yymm保存
        await this.setStorage(yymm, ymdListInYYMM);
      }

    } else {
      //登録済みymdの場合
    }

    //dailydata本体を保存
    await this.setStorage(dailydata.ymd, dailydata);

  }

  public async getDailyData(ymd: string):Promise<Dailydata> {
    const todayData:Dailydata = await this.getStorage(ymd, new Dailydata(ymd));
console.log("getDailyData " + ymd);
console.dir(todayData);
    return todayData;
  }

  public async getDailyListForDays(startYmd: string, dayCount: number): Promise<Dailydata[]> {
    const dailydataList:Dailydata[] = new Array();
    const ymdList = await this.getStoredYmdList();
    console.log("bg getDailyListForDays ymdList");
    console.dir(ymdList);

    for (let ymd of ymdList) {
      if (startYmd >= ymd) {
        const dailyData:Dailydata = await this.getDailyData(ymd);
        if (dailyData.footmarks.length > 0) {
          dailydataList.push(dailyData);
          if (dailydataList.length >= dayCount) {
            break;
          }
        }
      }
    }
    return dailydataList;
  }

  public async stampFootmark(footmark:Footmark): Promise<Dailydata> {
console.log("stampFootmark 1");
    const today:Date = new Date();
    const todayYmd:string = Utils.getYmd(today);
    const todayData:Dailydata = await this.getDailyData(todayYmd);
    console.log("stampFootmark 2");
console.dir(todayData);
    //今日データに同じurlのfootmarkが無いか検索
    let sameFootmark:Footmark|undefined = undefined;
    for (let f of todayData.footmarks) {
      if (footmark.url == f.url) {
        sameFootmark = f;
        break;
      }
    }

    if (sameFootmark == undefined) {
      //今日同じデータが無い場合、footmark新規作成
      const newFootmark :Footmark = {
        'ymd': todayYmd,
        'url': footmark.url,
        'title': footmark.title,
        'originTitle': footmark.originTitle,
        'stampCount': 1,
        'faviconUrl': footmark.faviconUrl,
        'dateAdded': today.getTime()
      }

      todayData.footmarks.push(newFootmark);
      await this.saveDailydata(todayData);
    } else {
      //今日同じデータがある場合、スタンプ回数を更新
      sameFootmark.stampCount++;
      await this.saveDailydata(todayData);
    }
    return todayData;
  }
}
