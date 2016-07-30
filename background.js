function getTabs(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    // active: true,
    // currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // https://developer.chrome.com/extensions/tabs#type-Tab
    // tab.url is only available if the "activeTab" permission is declared.
    callback(tabs);
    // var tab = tabs[0];
    // var url = tab.url;
    // console.assert(typeof url == 'string', 'tab.url should be a string');
    // callback(url);
  });
}

function sendDataToServer(encodedData) {
  var x = new XMLHttpRequest();
  x.open('GET', 'http://localhost:8080?' + encodedData);
  x.send();
}

var notifyIdCounter = 0;

function showNotification(title, message) {
  chrome.notifications.create("id"+notifyIdCounter++, {
    "title": title,
    "message": message,
    "type": "basic",
    "iconUrl": "icon.png",
  }, function(notifyId) {console.log("hi from "+notifyId)})
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("onUpdated: tab: ",tabId, ", changeInfo: ",changeInfo,", tab: ",tab)
  sendDataToServer()
})
