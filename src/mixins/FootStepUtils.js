import ApiPromised from './ApiPromised';
import MessageDeliver from './MessageDeliver';

export default {
  mixins: [ ApiPromised, MessageDeliver ],
  methods: {
    getCurrentTab : async function(callback) {
      const queryInfo = {
        active: true,
        currentWindow: true
      };

      const tabs = await this.apiTabsQuery(queryInfo);
      return tabs[0];
    },
    getYmd: function(date) {
      const yy = date.getFullYear();
      const mm = ("00" + (date.getMonth()+1)).slice(-2);
      const dd = ("00" + date.getDate()).slice(-2);
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
