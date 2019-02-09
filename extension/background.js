

const KeyFootstepDays = "stampedDays";

let footstepDays = [];
const footstepDays_map = [];
if (localStorage.getItem(KeyFootstepDays)) {
  footstepDays = fromSaveString(localStorage.getItem(KeyFootstepDays));
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

    } else if (request.message == "countUpStamp") {
      dailyData = countUpStamp(request.day, request.url);
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

    if (!localStorage.getItem(day)) {
      //不整合データ
      continue;
    }
    ret.push(getDailyData(day));
  }
  return ret;
}

function countUpStamp(day, url) {
  const dailyData = getDailyData(day);
  const markList = dailyData.markList;
  for (let i=0; i<markList.length; i++) {
    if (markList[i].url == url) {
      markList[i].count += 1;
      markList[i].times.push(new Date().getTime());
      saveDailyData(dailyData);
      return dailyData;
    }

    return dailyData;
  }
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

  let dailyData;
  if (!footstepDays_map[day]) {
    //未登録日の場合、日を登録
    footstepDays_map[day] = 1;
    footstepDays.push(day);
    footstepDays.sort();

    localStorage.setItem(KeyFootstepDays, toSaveString(footstepDays));

    //１件登録
    dailyData = {
      day:day,
      markList:[markData]
    };

  } else {
    dailyData = getDailyData(day);
    dailyData.markList.unshift(markData);
  }

  saveDailyData(dailyData);
  return dailyData;
}

function getDailyData(day) {
  if (!localStorage.getItem(day)) {
    return null;
  }

  const loadData = fromSaveString(localStorage.getItem(day));

  const dailyData = {
    day:day,
    markList:loadData
  }
  return dailyData;
}

function saveDailyData(dailyData) {
  localStorage.setItem(dailyData.day, toSaveString(dailyData.markList));
}

function toSaveString(obj) {
//  return toBase64(JSON.stringify(obj));
  return JSON.stringify(obj);
}

function fromSaveString(str) {
  return JSON.parse(str);
//  return JSON.parse(fromBase64(str));
}

//to base64
function toBase64(str) {
  return window.btoa( unescape(encodeURIComponent( str )) );
}

//from base64
function fromBase64(str) {
  return decodeURIComponent( escape(window.atob( str )) );
}
