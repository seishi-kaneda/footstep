import ChromeApiPromised from './ChromeApiPromised';

type QueryInfo = chrome.tabs.QueryInfo;
type Tab = chrome.tabs.Tab;

//console.dir(FootStepUtils);

new ChromeApiPromised().test()

const hoge: string = 'aaa'
console.log(hoge)


// タブが切り替わった時のイベント
chrome.tabs.onActivated.addListener(function (tabId) {
    chrome.tabs.query({"active": true}, async function (tab) {
        console.log("onActivated " + tab[0].url); // 切り替わったタブのURL

        const queryInfo:QueryInfo = {
          active: true,
          currentWindow: true
        };
        const tabs:Tab[] = await new ChromeApiPromised().apiTabsQuery(queryInfo);
        console.log("apiTabsQuery " + tabs[0].url); // 切り替わったタブのURL


//        chrome.tabs.remove(tab[0].id); //切り替わったタブを削除
    });
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
