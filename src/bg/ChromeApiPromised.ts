//export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode
type QueryInfo = chrome.tabs.QueryInfo;
type Tab = chrome.tabs.Tab;

export default class ChromeApiPromised {
  public apiTabsQuery(queryInfo: QueryInfo):Promise<Tab[]> {
    return new Promise<Tab[]>( (resolve) => {
      chrome.tabs.query(queryInfo, (tabs: Tab[]) => resolve(tabs) );
    });
  }


}
