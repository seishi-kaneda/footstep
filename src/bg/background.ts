import ChromeApiPromised from './ChromeApiPromised';
import StorageAccess from './StorageAccess';


type QueryInfo = chrome.tabs.QueryInfo;
type Tab = chrome.tabs.Tab;
type TabActiveInfo = chrome.tabs.TabActiveInfo;
type MessageSender = chrome.runtime.MessageSender;


const storageAccess: StorageAccess = new StorageAccess();
storageAccess.init();


chrome.runtime.onMessage.addListener(
  function(message: any, sender: MessageSender, sendResponse: any) {

    (async () => {
       console.log("message:" + message)
       sendResponse("sendResponse");
     })();
     return true; // keep the messaging channel open for sendResponse
  }
);


// タブが切り替わった時のイベント
chrome.tabs.onActivated.addListener(async function (tab:TabActiveInfo) {
  console.dir(tab);

  // const queryInfo:QueryInfo = {
  //   active: true,
  //   currentWindow: true
  // };
  // const tabs:Tab[] = await new ChromeApiPromised().apiTabsQuery(queryInfo);
  // console.log("apiTabsQuery " + tabs[0].url); // 切り替わったタブのURL
});

// タブが更新された時のイベント
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    console.log("onUpdated " + tab.url); // → 更新されたURL
    console.log(info.status); //→ loading,complete
//    chrome.tabs.remove(tabId); // 更新されたタブのidを削除
});


chrome.windows.onFocusChanged.addListener(function (windowId:number) {
  console.log("onFocusChanged " + windowId);

//  chrome.windows.getCurrent(object getInfo, function callback)
});
