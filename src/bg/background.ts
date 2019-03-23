import ChromeApiPromised from './ChromeApiPromised';
import StorageAccess from './StorageAccess';

import {Utils} from './Utils';
import {Footmark} from './Types';
import {Dailydata} from './Types';


type QueryInfo = chrome.tabs.QueryInfo;
type Tab = chrome.tabs.Tab;
type TabActiveInfo = chrome.tabs.TabActiveInfo;
type MessageSender = chrome.runtime.MessageSender;


chrome.runtime.onMessage.addListener(
  function(message: any, sender: MessageSender, sendResponse: any) {

    (async () => {

      const storageAccess: StorageAccess = new StorageAccess();

      switch (message.eventType) {
        case "getDailyListForDays": {
          console.log("bg.getDailyListForDays");
          const startYmd:string = message.params.startYmd;
          const dayCount:number = message.params.dayCount;
          const dailydataList:Dailydata[] = await storageAccess.getDailyListForDays(startYmd, dayCount);
          sendResponse(dailydataList);
console.log("bg sendResponse  dailydataList");
console.dir(dailydataList);

          break;
        }
        case "getDailyData": {
          console.log("bg.getDailyData");
          const ymd:string = message.params.ymd;
          const dailydata:Dailydata = await storageAccess.getDailyData(ymd);
          sendResponse(dailydata);
          break;
        }
        case "stampFootmark": {
          console.log("bg.stampFootmark");
          const footmark:Footmark = message.params.footmark;
          const dailydata:Dailydata = await storageAccess.stampFootmark(footmark);
          sendResponse(dailydata);
          break;
        }
      }

      console.log("message:" + message)
    })();
    return true; // keep the messaging channel open for sendResponse
  }
);


// タブが切り替わった時のイベント
chrome.tabs.onActivated.addListener(async function (tab:TabActiveInfo) {
//  console.dir(tab);

  // const queryInfo:QueryInfo = {
  //   active: true,
  //   currentWindow: true
  // };
  // const tabs:Tab[] = await new ChromeApiPromised().apiTabsQuery(queryInfo);
  // console.log("apiTabsQuery " + tabs[0].url); // 切り替わったタブのURL
});

// タブが更新された時のイベント
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    // console.log("onUpdated " + tab.url); // → 更新されたURL
    // console.log(info.status); //→ loading,complete
//    chrome.tabs.remove(tabId); // 更新されたタブのidを削除
});


chrome.windows.onFocusChanged.addListener(function (windowId:number) {
//  console.log("onFocusChanged " + windowId);

//  chrome.windows.getCurrent(object getInfo, function callback)
});
