
export class Footmark {
  public ymd: string = "";      //YYYYMMDD
  public url: string = "";      //URL
  public title: string = "";    //タイトル
  public originTitle: string = "";    //タイトル
  public stampCount: number = 0; //スタンプ回数
  public faviconUrl: string = ""; //お気に入りアイコンURL
  public dateAdded: number = 0; //作成日時　unix time stamp[ms]

}

export class Dailydata {
  public ymd:string = "";
  public footmarks: Footmark[] = Array();


//  constructor(ymd: string, footmarks: Footmark[] = Array()) {
  constructor(ymd: string) {
    this.ymd = ymd;
  }
}
