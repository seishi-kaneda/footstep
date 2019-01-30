

const KeyFootstepDays = "stampedDays";

var footstepDays = [];
var footstepDays_map = [];
if (localStorage.getItem(KeyFootstepDays)) {
  footstepDays = JSON.parse(localStorage.getItem(KeyFootstepDays));
}

for (var i=0; i<footstepDays.length; i++) {
  var day = footstepDays[i];
  footstepDays_map[day] = 1;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.message == "getDailydataList") {
      dailydataList = getDailydataList(request.start, request.days);
      sendResponse(dailydataList);

    } else if (request.message == "saveNewMark") {
      dailyData = saveNewMark(request.day, request.markData);
      sendResponse(dailyData);
    }
    return true;
  }
);


function getDailydataList(start, days) {

  var ret = [];
  for (var i=start; i<days; i++) {
    var j = footstepDays.length - 1 - i;
    var day = footstepDays[j];

    if (!localStorage[day]) {
      //不整合データ
      continue;
    }
    ret.push(getDailyData(day));
  }
  return ret;
}


/*
markData
- count : Number //スタンプカウント
- times : Array(Number) // フットスタンプした時点のUNIXタイムスタンプ
- title : String //タイトル
- url : String
- favicon : String //お気に入りアイコンurl
*/
function saveNewMark(day, markData) {

  if (!footstepDays_map[day]) {
    //未登録日の場合、日を登録
    footstepDays_map[day] = 1;
    footstepDays.push(day);
    footstepDays.sort();
    localStorage.setItem(KeyFootstepDays, JSON.stringify(footstepDays));

    //１件登録
    var dailyData = {
      day:day,
      markList:[markData]
    };

  } else {
    dailyData = getDailyData(day);
    //先頭に追加
    dailyData.markList.unshift(markData);
  }

  saveDailyData(dailyData);
  return dailyData;
}

function getDailyData(day) {
  var dailyData = {
    day:day,
    markList:JSON.parse(localStorage.getItem(day))
  }
  return dailyData;
}

function saveDailyData(dailyData) {
  localStorage.setItem(dailyData.day, JSON.stringify(dailyData.markList));
}
