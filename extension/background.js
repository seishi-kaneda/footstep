

const KeyStampedDays = "stampedDays";

var stampedDays = [];
var stampedDays_map = [];
if (localStorage.getItem(KeyStampedDays)) {
  stampedDays = JSON.parse(localStorage.getItem(KeyStampedDays));
}

for (var i=0; i<stampedDays.length; i++) {
  var day = stampedDays[i];
  stampedDays_map[day] = 1;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.message == "getDailydataList") {
      dailydataList = getDailydataList(request.start, request.days);
      sendResponse(dailydataList);

    } else if (request.message == "saveNewStamp") {
      dailyData = saveNewStamp(request.day, request.stampData);
      sendResponse(dailyData);
    }
    return true;
  }
);


function getDailydataList(start, days) {

  var ret = [];
  for (var i=start; i<days; i++) {
    var j = stampedDays.length - 1 - i;
    var day = stampedDays[j];

    if (!localStorage[day]) {
      //不整合データ
      continue;
    }
    ret.push(getDailyData(day));
  }
  return ret;
}


/*
stampData
- count : Number //スタンプカウント
- times : Array(Number) // フットスタンプした時点のUNIXタイムスタンプ
- title : String //タイトル
- url : String
- favicon : String //お気に入りアイコンurl
*/
function saveNewStamp(day, stampData) {

  var dailyData = [];
  if (!stampedDays_map[day]) {
    //未登録日の場合、日を登録
    stampedDays_map[day] = 1;
    stampedDays.push(day);
    stampedDays.sort();
    localStorage.setItem(KeyStampedDays, JSON.stringify(stampedDays));

    //１件登録
    dailyData = [stampData];

  } else {
    dailyData = getDailyData(day);
    //先頭に追加
    dailyData.unshift(stampData);
  }

  saveDailyData(day, dailyData);
  return dailyData;
}

function getDailyData(day) {
  return JSON.parse(localStorage.getItem(day));
}

function saveDailyData(day, dailyData) {
  localStorage.setItem(day, JSON.stringify(dailyData));
}
