import { renderFavorite } from "./render"
import { getStorageData } from './store'
// 收藏
function handleCollect(e) {
  const { url, title } = e.target.dataset
  chrome.storage.sync.get("collect", (res) => {
    let data = JSON.parse(JSON.stringify(res.collect))
    data.push({ url, title })
    chrome.storage.sync.set({ collect: data })
    renderFavorite(url,title)
    updateCollectStatus(true)
  })
  e.stopPropagation()
}

async function  updateCollectStatus(isAddCollect){
  let storageData = await getStorageData("collect")
  storageData = JSON.stringify(storageData)
  // 更新icon-top src
  Array.from(document.querySelectorAll('.icon-top')).forEach(ele=>{
    ele.src = storageData.search(ele.dataset.url) === -1 ? "./img/collect2.svg": "./img/collected2.svg"
  })
  // 更新icon-collect class以及src
  Array.from(document.querySelectorAll('.icon-collect')).forEach(ele=>{
    if(isAddCollect){
      ele.classList.add("icon-collect--act")
    }else{
      ele.classList.remove("icon-collect--act")
    }
    ele.src = storageData.search(ele.dataset.url) === -1 ? "./img/collect.svg": "./img/collected.svg"
  })
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
    updateCollectStatus(false)
  })
  e.stopPropagation()
}
// 跳转
function handleJump(e) {
  let url = e.target.dataset.url
  if (url) {
    window.open(url, "_blank")
  }
}
// 折叠
function handleCollapse(e) {
  let curFolder = e.target.parentNode
  let curUl = curFolder.querySelector("ul")
  curUl.style.display = curUl.style.display == "none" ? "flex" : "none"
  let icon = e.target.querySelector(".btn-collapse")
  icon.classList.toggle("btn-collapse--act")
}

//bookmark item点击事件，需要分别处理下面的不同子元素点击
function handleBookmarkItemClick(e) {
  let classList = Array.from(e.target.classList)
  if (classList.includes("icon-collect")) {
    if(classList.includes("icon-collect--act")){
      return;
    }
    return handleCollect(e)
  }
  if (classList.includes("del-icon")) {
    return handleDelCollect(e)
  }
  if (classList.includes("bookmark-header")) {
    return handleCollapse(e)
  }
  if (classList.includes("bookmark-item")) {
    return handleJump(e)
  }
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

// 切换颜色模式
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
  Array.from(document.querySelectorAll("#bookmark,#collect")).forEach((e) => {
    e.addEventListener("click", handleBookmarkItemClick)
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
