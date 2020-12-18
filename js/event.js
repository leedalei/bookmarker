import { renderFavorite } from "./render"
import { getStorageData } from "./store"
// 收藏
function handleCollect(e) {
  const { url, title } = e.target.dataset
  chrome.storage.sync.get("collect", (res) => {
    let data = JSON.parse(JSON.stringify(res.collect))
    data.push({ url, title })
    chrome.storage.sync.set({ collect: data })
    renderFavorite(url, title)
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

//bookmark item点击事件，需要分别处理下面的不同子元素点击
function handleBookmarkItemClick(e) {
  let classList = Array.from(e.target.classList)
  if (classList.includes("icon-collect")) {
    if (classList.includes("icon-collect--act")) {
      return handleDelCollect(e)
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
    const {value} = obj.dataset
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

// 获取value/options 元素
function getOptionsEle(e){
	const childrenNode = e.parentNode.childNodes
	const children = []
	childrenNode.forEach(item=>{
		if(item.nodeType === 1){
			children.push(item)
		}
	})
	return children
}

// 显示隐藏 select
function handleSelect(e){
	const valueEle = getOptionsEle(e.target)[0]
	const optionsEle = getOptionsEle(e.target)[1]
	const optionsStatus = optionsEle.style.display
	if(optionsStatus === '' || optionsStatus === 'none'){
		optionsEle.style.display = 'block'
		valueEle.classList.add('show')
	} else {
		optionsEle.style.display = 'none'
		valueEle.classList.remove('show')
	}
}

// 点击select
function onSelect(e){
	const { value } = e.target.dataset
	const label = e.target.innerText
	const optionsEle = e.target.parentNode
	optionsEle.style.display = 'none'
	const valueEl = getOptionsEle(optionsEle)[0]
	valueEl.dataset.value = value
	valueEl.innerText = label
	valueEl.classList.remove('show')
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

//注册select监听器
export const initSelectListener = function () {
	Array.from(document.querySelectorAll(".select-value")).forEach((e) => {
    e.addEventListener("click", handleSelect)
  })
	Array.from(document.querySelectorAll(".select-option")).forEach((e) => {
    e.addEventListener("click", onSelect)
  })
}

// 全部一起注册，冚家富贵
export const initAllListener = function () {
  initGlobalListener()
  initBookmarkListener()
  initSearchListener()
  initSettingListener()
  initSelectListener()
}
