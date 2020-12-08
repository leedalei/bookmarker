let data = []
getBookmarks()
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse(JSON.stringify(data)) //必须同步
})
function getBookmarks() {
  chrome.bookmarks.getTree((res) => {
    data = res
  })
}

// 点击icon进入新的页面
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: chrome.runtime.getURL("/index.html") })
})
