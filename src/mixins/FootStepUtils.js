const ExportFileHeader = "FootStep LocalStrage Data.";

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
