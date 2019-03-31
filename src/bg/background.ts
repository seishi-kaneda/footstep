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
          const startYmd:string = message.params.startYmd;
          const dayCount:number = message.params.dayCount;
          const dailydataList:Dailydata[] = await storageAccess.getDailyListForDays(startYmd, dayCount);
          sendResponse(dailydataList);

          break;
        }
        case "getDailyData": {
          const ymd:string = message.params.ymd;
          const dailydata:Dailydata = await storageAccess.getDailyData(ymd);
          sendResponse(dailydata);
          break;
        }
        case "stampFootmark": {
          const footmark:Footmark = message.params.footmark;
          const dailydata:Dailydata = await storageAccess.stampFootmark(footmark);
          changeIcon();
          sendResponse(dailydata);
          break;
        }
      }
    })();
    return true; // keep the messaging channel open for sendResponse
  }
);


// タブが切り替わった時のイベント
chrome.tabs.onActivated.addListener(async function (tab:TabActiveInfo) {
  changeIcon();
});

// タブが更新された時のイベント
chrome.tabs.onUpdated.addListener(async function (tabId: number, info: any, tab: Tab) {
  changeIcon();
});
// windowが変更された時のイベント
chrome.windows.onFocusChanged.addListener(async function (windowId:number) {
  changeIcon();
});

async function changeIcon() {

  const storageAccess: StorageAccess = new StorageAccess();
  const today:Date = new Date();
  const todayYmd:string = Utils.getYmd(today);
  const todayData:Dailydata = await storageAccess.getDailyData(todayYmd);
  const currentTab:Tab = await getCurrentTab();
  if (currentTab == undefined) {
    return;
  }

  let isToday: boolean = false;
  for (let f of todayData.footmarks) {
    if (currentTab.url == f.url) {
      isToday = true;
      break;
    }
  }

  if (isToday) {
    chrome.browserAction.setIcon({path:"images/footmark_cat_red1_48.png"});
  } else {
    chrome.browserAction.setIcon({path:"images/shironuki_48.png"});
  }
}


async function getCurrentTab():Promise<Tab> {
  return new Promise<Tab>( (resolve) => {
    const queryInfo: QueryInfo = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(queryInfo, (tabs: Tab[]) => {
      resolve(tabs[0])
    });
  });
}
