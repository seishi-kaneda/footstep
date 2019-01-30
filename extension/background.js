

const KeyFootstepDays = "stampedDays";

let footstepDays = [];
const footstepDays_map = [];
if (localStorage.getItem(KeyFootstepDays)) {
  footstepDays = JSON.parse(localStorage.getItem(KeyFootstepDays));
}

for (let i=0; i<footstepDays.length; i++) {
  const day = footstepDays[i];
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

  const ret = [];
  for (let i=start; i<days; i++) {
    const j = footstepDays.length - 1 - i;
    const day = footstepDays[j];

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
    const dailyData = {
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
  const dailyData = {
    day:day,
    markList:JSON.parse(localStorage.getItem(day))
  }
  return dailyData;
}

function saveDailyData(dailyData) {
  localStorage.setItem(dailyData.day, JSON.stringify(dailyData.markList));
}
