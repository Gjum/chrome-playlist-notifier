function sendDataToServer(data) {
  encodedData = encodeURIComponent(JSON.stringify(data))
  var x = new XMLHttpRequest();
  x.open('GET', 'http://localhost:8080?data=' + encodedData);
  x.send();
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("onUpdated: tab: ",tabId, ", changeInfo: ",changeInfo,", tab: ",tab)
  if (tab.audible) {
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
})
