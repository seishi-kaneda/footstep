export default {
  methods: {
    apiBookmarksGet: function(idOrIdList) {
      return new Promise( (resolve) => {
        chrome.bookmarks.get(idOrIdList, (bookmarks) => resolve(bookmarks) );
      });
    },
    apiBookmarksGetChildren: function(id) {
      return new Promise( (resolve) => {
        chrome.bookmarks.getChildren(id, (bookmarks) => resolve(bookmarks) );
      });
    },
    apiBookmarksCreate: function(argBookmark) {
      return new Promise( (resolve) => {
        chrome.bookmarks.create(argBookmark, (retBookmark) => resolve(retBookmark) );
      });
    },
    apiBookmarksUpdate: function(id, changes) {
      return new Promise( (resolve) => {
        chrome.bookmarks.update(id, changes, (retBookmark) => resolve(retBookmark) );
      });
    },
    apiBookmarksRemove: function(id) {
      return new Promise( (resolve) => {
        chrome.bookmarks.update(id, () => resolve() );
      });
    },
    apiBookmarksRemove: function(id) {
      return new Promise( (resolve) => {
        chrome.bookmarks.update(id, () => resolve() );
      });
    },
    apiRuntimeSendMessage: function(message) {
      return new Promise( (resolve) => {
        chrome.runtime.sendMessage(message, (response) => resolve(response) );
      });
    },
    apiTabsQuery: function(queryInfo) {
      return new Promise( (resolve) => {
        chrome.tabs.query(queryInfo, (tabs) => resolve(tabs) );
      });
    },
    apiTabsCreate: function(createProperties) {
      return new Promise( (resolve) => {
        chrome.tabs.create(createProperties
            , (createProperties) => resolve(createProperties));
      });
    }
  }
}
