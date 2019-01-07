// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Global variables only exist for the life of the page, so they get reset
// each time the page is unloaded.
var counter = 1;

var lastTabId = -1;
function sendMessage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, "Background page started.");
  });
}

var badge_counter = 0;

sendMessage();
chrome.browserAction.setBadgeText({text: "" + badge_counter++});
console.log("Loaded.");

chrome.runtime.onInstalled.addListener(function() {
  console.log("Installed.");

  // localStorage is persisted, so it's a good place to keep state that you
  // need to persist across page reloads.
  localStorage.counter = 1;

});


// chrome.browserAction.onClicked.addListener(function() {
//   chrome.tabs.create({url: "index.html"});
// });


//
// /**
//  * Get the current tab.
//  *
//  * @param {function(tab)} callback called when the URL of the current tab
//  *   is found.
//  */
// function getCurrentTab(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };
//
//   chrome.tabs.query(queryInfo, (tabs) => {
//     var tab = tabs[0];
//     var url = tab.url;
//     callback(tab);
//   });
//
// }
