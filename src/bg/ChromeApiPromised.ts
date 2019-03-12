export default class ChromeApiPromised {
 public test() {
  console.log("ChromeApiPromised")
 }
/*
 public apiBookmarksGet(idOrIdList: string | string[]) {
   return new Promise( (resolve: any) => {
     chrome.bookmarks.get(idOrIdList, (bookmarks: BookmarkTreeNode[]) => resolve(bookmarks) );
   });
 }
 */
 public apiBookmarksGetChildren(id: string) {
   return new Promise( (resolve: any) => {
     chrome.bookmarks.getChildren(id, (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => resolve(bookmarks) );
   });
 }
 /*
 public apiBookmarksCreate(argBookmark: BookmarkCreateArg) {
   return new Promise( (resolve) => {
     chrome.bookmarks.create(argBookmark, (retBookmark) => resolve(retBookmark) );
   });
 }
 public apiBookmarksUpdate(id: string, changes: BookmarkChangesArg) {
   return new Promise( (resolve) => {
     chrome.bookmarks.update(id, changes, (retBookmark) => resolve(retBookmark) );
   });
 }
 public apiBookmarksRemove(id: string) {
   return new Promise( (resolve) => {
     chrome.bookmarks.remove(id, () => resolve() );
   });
 }
 public apiRuntimeSendMessage(message: any) {
   return new Promise( (resolve) => {
     chrome.runtime.sendMessage(message, (response: any) => resolve(response) );
   });
 }
 public apiTabsQuery(queryInfo: QueryInfo) {
   return new Promise( (resolve) => {
     chrome.tabs.query(queryInfo, (tabs: Tab[]) => resolve(tabs) );
   });
 }
 public apiTabsCreate(createProperties: CreateProperties) {
   return new Promise( (resolve) => {
     chrome.tabs.create(createProperties
         , (tab: Tab) => resolve(tab));
   });
 }
 */
}
