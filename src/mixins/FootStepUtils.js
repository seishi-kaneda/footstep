const ExportFileHeader = "FootStep LocalStrage Data.";

export default {
  methods: {
    getCurrentTab : function(callback) {
      var queryInfo = {
        active: true,
        currentWindow: true
      };

      chrome.tabs.query(queryInfo, (tabs) => {
        callback(tabs[0]);
      });
    },
    getNowYMD: function(){
      var dt = new Date();
      var y = dt.getFullYear();
      var m = ("00" + (dt.getMonth()+1)).slice(-2);
      var d = ("00" + dt.getDate()).slice(-2);
      var result = y + "/" + m + "/" + d;
      return result;
    },
    getExportFileHeader : function(){

      var date = new Date();
      var manifest = chrome.runtime.getManifest();

      //1行目はヘッダ情報
      var exportText = ExportFileHeader
                    + "\tver:\t" + manifest.version
                    + "\ttime:\t" + date.getTime();
      return exportText;

    },
    checkImportFile : function(importText){
      return importText.startsWith(ExportFileHeader);
    }
  }
}
