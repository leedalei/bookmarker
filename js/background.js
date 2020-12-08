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
