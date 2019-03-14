//export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode
type QueryInfo = chrome.tabs.QueryInfo;
type Tab = chrome.tabs.Tab;

export default class ChromeApiPromised {
 public test() {
  console.log("ChromeApiPromised")
 }

 public apiTabsQuery(queryInfo: QueryInfo):Promise<Tab[]> {
   return new Promise<Tab[]>( (resolve) => {
     chrome.tabs.query(queryInfo, (tabs: Tab[]) => resolve(tabs) );
   });
 }
/*
 public apiTabsCreate(createProperties: CreateProperties) {
   return new Promise( (resolve) => {
     chrome.tabs.create(createProperties
         , (tab: Tab) => resolve(tab));
   });
 }
 public apiBookmarksGet(idList: string[]): Promise<BookmarkTreeNode[]> {
   return new Promise<BookmarkTreeNode[]>( (resolve: any) => {
     chrome.bookmarks.get(idList, (bookmarks: BookmarkTreeNode[]) => resolve(bookmarks) );
   });
 }
 public apiBookmarksGetChildren(id: string): Promise<BookmarkTreeNode[]> {
   return new Promise<BookmarkTreeNode[]>( (resolve: any) => {
     chrome.bookmarks.getChildren(id, (bookmarks: BookmarkTreeNode[]) => resolve(bookmarks) );
   });
 }
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
 */
}
