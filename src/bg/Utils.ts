
export class Utils {

  public static getYmd(date:Date):string {
    const yy:string = String(date.getFullYear());
    const mm:string = ("00" + (date.getMonth()+1)).slice(-2);
    const dd:string = ("00" + date.getDate()).slice(-2);
    const result = yy + mm + dd;
    return result;
  }

  public static isContain(ary:string[], target:string):boolean {
    for (let value of ary) {
      if (value == target) {
        return true;
      }
    }
    return false;
  }
}
