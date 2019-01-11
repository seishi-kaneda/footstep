export default {
  methods: {
    getCurrentTab : function(callback) {
      var queryInfo = {
        active: true,
        currentWindow: true
      };

      chrome.tabs.query(queryInfo, (tabs) => {
        var tab = tabs[0];
        var url = tab.url;
        callback(tab);
      });
    },
    testmethod : function() {
      alert("test");
    }
  }
}
