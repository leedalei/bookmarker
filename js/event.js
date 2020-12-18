import { renderFavorite } from "./render"
import { getStorageData } from "./store"
// 收藏
function  handleCollect(e) {
  const { url, title, category } = e.target.dataset
  chrome.storage.sync.get("collect", async (res) => {
    let data = JSON.parse(JSON.stringify(res.collect))
    data.push({ url, title, category })
    chrome.storage.sync.set({ collect: data })
    await renderFavorite(url, title, category)
    initMouseLeaveListener() //重新注册监听器
    updateCollectStatus(true)
  })
  e.stopPropagation()
}

// 更新收藏的状态
async function updateCollectStatus(isAddCollect, url) {
  let storageData = await getStorageData("collect")
  if (!isAddCollect) {
    document.querySelector(`.icon-top[data-url='${url}']`).src =
      "./img/collect2.svg"
    document.querySelector(`.icon-collect[data-url='${url}']`).src =
      "./img/collect.svg"
    document
      .querySelector(`.icon-collect[data-url='${url}']`)
      .classList.remove("icon-collect--act")
    return
  }
  storageData.collect.forEach((obj) => {
    // 更新icon-top src
    Array.from(
      document.querySelectorAll(`.icon-top[data-url='${obj.url}']`)
    ).forEach((ele) => {
      ele.src = "./img/collected2.svg"
    })
    // 更新icon-collect class以及src
    Array.from(
      document.querySelectorAll(`.icon-collect[data-url='${obj.url}']`)
    ).forEach((ele) => {
      ele.src = "./img/collected.svg"
      ele.classList.add("icon-collect--act")
    })
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
    updateCollectStatus(false, url)
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
// 卡片菜单
function handleOCardMenu(e) {
  let curFolder = e.target.parentNode
  curFolder.querySelector(".menu-box").classList.toggle("menu-open")
}

// bookmark-item失去hover事件
function handleBookmarkItemBlur(e){
  e.currentTarget.querySelector(".menu-box").classList.remove("menu-open")
}

//bookmark item事件代理
function handleBookmarkItemClick(e) {
  let classList = Array.from(e.target.classList)
  if (classList.includes("icon-collect")) {
    if (classList.includes("icon-collect--act")) {
      return handleDelCollect(e)
    }
    return handleCollect(e)
  }
  if (classList.includes("icon-menu")) {
    return handleOCardMenu(e)
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

//注册收藏列表相关监听器
export const initClickListener = function () {
  Array.from(document.querySelectorAll("#bookmark,#collect")).forEach((e) => {
    e.addEventListener("click", handleBookmarkItemClick)
  })
  document.querySelector(".form-item").addEventListener("click", (e) => {
    document.querySelector(".form-item").classList.toggle("mode-open")
  })
  Array.from(document.querySelectorAll(".form-item svg")).forEach((e) => {
    e.addEventListener("click", switchTabTo)
  })
}
// 注册mouseleave相关监听器
export const initMouseLeaveListener = ()=>{
  Array.from(document.querySelectorAll(".bookmark-item")).forEach((e) => {
    e.addEventListener("mouseleave", handleBookmarkItemBlur)
  })
}

//注册键盘相关监听器
export const initKeyListener = function () {
  document.querySelector("input").onkeypress = (e) => {
    search(e)
  }
}


// 全部一起注册，冚家富贵
export const initAllListener = function () {
  initClickListener()
  initMouseLeaveListener()
  initKeyListener()
}
