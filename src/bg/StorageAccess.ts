import {Utils} from './Utils';
import {Footmark} from './Types';
import {Dailydata} from './Types';

const STORAGE_KEY_YYMM_LIST: string = "STORAGE_KEY_YYMM_LIST";

export default class StorageAccess {

  private loadedYmdList: string[] = Array();

  public constructor() {
  }

  public async init() {
    const ymdList:string[] = Array();
    const yymmList:string[] = await this.getStorage("yymmList", Array());
    for (let yymm of yymmList) {
      const ddList:string[] = await this.getStorage("yymm", Array());
      //todo ループより配列結合の関数
      for (let ymd of ddList) {
        ymdList.push(ymd);
      }
    }
    this.loadedYmdList = ymdList;
  }


  private setStorage(key:string, value:any):Promise<void> {
    return new Promise<void>( (resolve) => {
      chrome.storage.local.set({key: value}, () => resolve());
    });
  }

  private getStorage(key:string, def:any):Promise<any> {
    return new Promise<any>( (resolve) => {
      chrome.storage.local.get(key, (tmp_item:any|undefined) => {
        const item:any = tmp_item==undefined ? def : tmp_item;
        resolve(item);
      });
    });
  }

  public async saveDailydata(dailydata:Dailydata) {

    //ymd登録処理
    if (!Utils.isContain(this.loadedYmdList, dailydata.ymd)) {
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

      //新しいyymmddを保持
      this.loadedYmdList.push(dailydata.ymd);
      //降順ソート
      this.loadedYmdList.sort(function(a:string, b:string) {
        return parseInt(b) - parseInt(a);
      });

    } else {
      //登録済みymdの場合
    }

    //dailydata本体を保存
    await this.setStorage(dailydata.ymd, dailydata);

  }

  public async getDailyData(ymd: string):Promise<Dailydata> {
    const def = new Dailydata(ymd);
    const todayData:Dailydata = await this.getStorage(ymd, def);
    return todayData;
  }

  public async getDailyListForDays(startYmd: string, dayCount: number): Promise<Dailydata[]> {

    const dailydataList:Dailydata[] = new Array();
    for (let ymd of this.loadedYmdList) {
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
    const today:Date = new Date();
    const todayYmd:string = Utils.getYmd(today);
    const todayData:Dailydata = await this.getDailyData(todayYmd);

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
      todayData.footmarks.push(footmark);
      await this.saveDailydata(todayData);
    } else {
      //今日同じデータがある場合、スタンプ回数を更新
      sameFootmark.stampCount++;
      await this.saveDailydata(todayData);
    }
    return todayData;
  }
}
