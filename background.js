var watched = new Set();

function sendDataToServer(data) {
  encodedData = encodeURIComponent(JSON.stringify(data))
  var x = new XMLHttpRequest();
  x.open('GET', 'http://localhost:8080?data=' + encodedData);
  x.send();
};

function checkAudible(tab) {
  if (tab.audible && watched.has(tab.id)) {
    sendDataToServer({
      "title": tab.title,
      "url": tab.url,
      "faviconUrl": tab.faviconUrl,
      "muted": tab.mutedInfo.muted,
      "audible": tab.audible,
      "active": tab.active,
      "pinned": tab.pinned,
      "incognito": tab.incognito,
    })
  }
};

function updateContextMenu(tabId) {
  if (watched.has(tabId)) {
    chrome.contextMenus.update("menu", {"title": "unwatch this music"})
  } else {
    chrome.contextMenus.update("menu", {"title": "watch this music"})
  }
};

chrome.runtime.onInstalled.addListener(function() {
  var id = chrome.contextMenus.create({
      "title": "watch this music",
      "id": "menu",
      "onclick": function(info, tab) {
        if (watched.has(tab.id)) {
          watched.delete(tab.id);
        } else {
          watched.add(tab.id);
          checkAudible(tab);
        }
        updateContextMenu(tab.id);
      }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("onUpdated: tab: ",tabId, ", changeInfo: ",changeInfo,", tab: ",tab)
  checkAudible(tab);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  updateContextMenu(activeInfo.tabId);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  watched.delete(tabId);
  console.log("closed tab", tabId);
});
