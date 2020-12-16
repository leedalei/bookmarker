import { renderFavorite, renderCollect } from "./render"
// 收藏
function handleCollect(e) {
  const { url, title } = e.target.dataset
  chrome.storage.sync.get("collect", (res) => {
    let data = JSON.parse(JSON.stringify(res.collect))
    data.push({ url, title })
    chrome.storage.sync.set({ collect: data })
    renderFavorite() //重新渲染
    renderCollect()
    initBookmarkListener() //这里增加了dom，需要重新监听
  })
  e.stopPropagation()
}
// 删除收藏
function handleDelCollect(e) {
  const { url } = e.target.dataset
  chrome.storage.sync.get("collect", (res) => {
    let data = JSON.parse(JSON.stringify(res.collect))
    data.forEach((item, index) => {
      if (item.url === url) {
        data.splice(index, 1)
      }
    })
    chrome.storage.sync.set({ collect: data })
    renderFavorite() //重新渲染
    renderCollect()
  })
  e.stopPropagation()
}
// 跳转
function handleJump(e) {
  let url = e.currentTarget.dataset.url
  if (url) {
    window.open(url, "_blank")
  }
}
// 折叠
function handleCollapse(e) {
  let curFolder = e.currentTarget.parentNode
  let curUl = curFolder.querySelector("ul")
  curUl.style.display = curUl.style.display == "none" ? "flex" : "none"
  let icon = e.target.querySelector(".btn-collapse")
  icon.classList.toggle("btn-collapse--act")
}

// 搜索
function search(e) {
  if (e.which === 13) {
    var obj = document.querySelectorAll(".search-select")[0]
    var index = obj.selectedIndex
    var value = obj.options[index].value
    const inputValue = e.target.value
    let url = ""
    switch (value) {
      case "baidu":
        url = "https://baidu.com/s?wd="
        break
      case "google":
        url = "https://www.google.com/search?q="
        break
      case "bing":
        url = "https://www.bing.com/search?q="
        break
      case "sougou":
        url = "https://www.sogou.com/web?query="
        break
    }
    window.open(`${url}${inputValue}`, "_blank")
  }
}

function switchTabTo(e) {
  let { value } = e.currentTarget.dataset
  switch (value) {
    case "light":
      switchMode("light")
      break
    case "dark":
      switchMode("dark")
      break
    case "auto":
      switchMode("auto")
      break
  }
}

// 切换颜色模式
function switchMode(modeData) {
  chrome.storage.sync.set({ mode: modeData })
  document.querySelector("body").setAttribute("color-mode", modeData)
}

// 注册全局监听器
export const initGlobalListener = function () {}

//注册收藏列表相关监听器
export const initBookmarkListener = function () {
  Array.from(document.querySelectorAll(".bookmark-header")).forEach((e) => {
    e.addEventListener("click", handleCollapse)
  })
  Array.from(document.querySelectorAll(".bookmark-li")).forEach((e) => {
    e.addEventListener("click", handleJump)
  })
  Array.from(document.querySelectorAll(".collect-icon")).forEach((e) => {
    e.addEventListener("click", handleCollect)
  })
  Array.from(document.querySelectorAll(".del-icon")).forEach((e) => {
    e.addEventListener("click", handleDelCollect)
  })
}

//注册搜索栏相关监听器
export const initSearchListener = function () {
  document.querySelector("input").onkeypress = (e) => {
    search(e)
  }
}

//注册设置相关监听器
export const initSettingListener = function () {
  Array.from(document.querySelectorAll(".switch-tab")).forEach((e) => {
    e.addEventListener("click", switchTabTo)
  })
  document.querySelector(".form-item").addEventListener("click", (e) => {
    document.querySelector(".form-item").classList.toggle("mode-open")
  })
  Array.from(document.querySelectorAll(".form-item svg")).forEach((e) => {
    e.addEventListener("click", switchTabTo)
  })
}

// 全部一起注册，冚家富贵
export const initAllListener = function () {
  initGlobalListener()
  initBookmarkListener()
  initSearchListener()
  initSettingListener()
}
