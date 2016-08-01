var port = 1234;

var watched = new Set();

function sendDataToServer(data) {
  encodedData = encodeURIComponent(JSON.stringify(data))
  var x = new XMLHttpRequest();
  x.open('GET', 'http://localhost:' + port + '/?data=' + encodedData);
  x.send();
};

function checkTab(tab) {
  if (watched.has(tab.id)) {
    sendDataToServer({
      "id": tab.id,
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
          checkTab(tab);
        }
        updateContextMenu(tab.id);
      }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  checkTab(tab);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  updateContextMenu(activeInfo.tabId);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  watched.delete(tabId);
  sendDataToServer({
      "id": tabId,
      "audible": false,
  })
});
