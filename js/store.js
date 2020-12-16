let storageData = null

// 取
export const getStorageData = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, (result) =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )

// 存
export const setStorageData = (data) =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )

// 获取storage数据
// function getStorageData() {
//   chrome.storage.sync.get("collect", (res) => {
//     if (res.collect) {
//       renderFavorite(res.collect)
//       storageData = JSON.stringify(res.collect)
     
//     } else {
//       chrome.storage.sync.set({ collect: [] })
//     }
//   })
// }
