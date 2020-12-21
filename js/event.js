import { Render } from "./Render"
import { Confirm } from "./Confirm"
import { EditBox } from './EditBox'
import { switchMode, addCollect, delCollect, updateCollectStatus, handleCollapse, handleJump, removeBookmark } from "./function"

let renderer = new Render(false)

// 切换颜色模式
function handleSwitchClick(e) {
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

// 添加收藏
function handleCollect(e) {
  addCollect(e.target.dataset).then(() => {
    renderer.initFavorite()
    updateCollectStatus(true)
  })
  e.stopPropagation()
}
// 删除收藏
function handleDelCollect(e) {
  const { url } = e.target.dataset
  delCollect(url).then(() => {
    renderer.initFavorite() //重新渲染
    updateCollectStatus(false, url)
  })
  e.stopPropagation()
}

// 获取value/options 元素
function getOptionsEle(e) {
  const childrenNode = e.parentNode.childNodes
  const children = []
  childrenNode.forEach(item=>{
    if(item.nodeType === 1){
      children.push(item)
    }
  })
  return children
}

// 卡片菜单
function handleCardMenu(e) {
  e.target.parentNode.querySelector(".menu-box").classList.toggle("menu-open")
  e.stopPropagation()
}
// 卡片Li点击
function handleMenuLi(e) {
  const { type } = e.target.dataset
  const option = e.target.parentNode.dataset
  const classList = Array.from(e.currentTarget.classList)
  const ele = e.target.parentNode.parentNode.parentNode
  switch(type) {
    case 'edit':
      let editBox = new EditBox(option, type)
      e.target.parentNode.classList.remove("menu-open")
      editBox.show()
      break
    case 'remove':
      let confirm = new Confirm({text:"你真的要删除吗？鸡掰",type:"warning"}, () => {
        if(classList.includes('collect')) {
          delCollect(option.url).then(() => {
            return removeBookmark(option.id)
          }).then(() => {
            ele.remove()
          })
          return
        }
        if(classList.includes('bookmark')) {
          removeBookmark(option.id).then(() => {
            return delCollect(option.url)
          }).then(() => {
            renderer.initFavorite()
            ele.remove()
          })
          return
        }
        if(classList.includes('search-result')) {
          removeBookmark(option.id).then(() => {
            return delCollect(option.url)
          }).then(() => {
            renderer.initFavorite()
            renderer.initCollect()
            renderer.initSearchResult()
            ele.remove()
          })
          return
        }
      })
      e.target.parentNode.classList.remove("menu-open")
      confirm.show()
      break
  }
  e.stopPropagation()
}

//bookmark item事件代理 Event delegation
export const bookmarkEventDelegation = (e) => {
  let classList = Array.from(e.target.classList)
  if (classList.includes("icon-collect")) {
    if (classList.includes("icon-collect--act")) {
      return handleDelCollect(e)
    }
    return handleCollect(e)
  }
  if (classList.includes("icon-menu")) {
    return handleCardMenu(e)
  }
  if (classList.includes("menu-li")) {
    return handleMenuLi(e)
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
//setting-box事件代理 Event delegation
export const settingBoxEventDelegation = (e) => {
  let classList = Array.from(e.target.classList)
  e.stopPropagation()
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
  e.stopPropagation()
}
// 点击select
function onSelect(e){
	const { value } = e.target.dataset
	const label = e.target.innerText
	const optionsEle = e.target.parentNode
	optionsEle.style.display = 'none'
	const valueEl = getOptionsEle(optionsEle)[0]
	valueEl.dataset.value = value
	valueEl.querySelector("span").innerText = label
	valueEl.classList.remove('show')
  e.stopPropagation()
}
// 隐藏所有options
function hideOptions(){
  const allOptions = document.querySelectorAll('.select-options')
  allOptions.forEach(e=>{
    e.style.display = 'none'
    const valueEle = getOptionsEle(e)
    valueEle[0].classList.remove('show')
  })
}

// 注册全局监听器
export const initGlobalListener = function () {
  document.body.addEventListener('click', () => {
    hideOptions()
    document.querySelector(".setting-icon").classList.toggle("setting-icon--act")
    document.querySelector(".setting-box").classList.remove("setting-open")
    document.querySelector(".form-item").classList.remove("mode-open")
  })
}

// 注册按钮点击相关监听
export const initIconClickListener = () => {
  Array.from(document.querySelectorAll("#bookmark,#collect")).forEach((ele) => {
    ele.addEventListener("click", bookmarkEventDelegation)
  })
  Array.from(document.querySelectorAll(".setting-box")).forEach((ele) => {
    ele.addEventListener("click", settingBoxEventDelegation)
  })
  Array.from(document.querySelectorAll(".form-item svg")).forEach((ele) => {
    ele.addEventListener("click", handleSwitchClick)
  })
  document.querySelector(".form-item").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("mode-open")
    e.stopPropagation()
  })
  document.querySelector(".setting-icon").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("setting-icon--act")
    e.currentTarget.parentNode.querySelector(".setting-box").classList.toggle("setting-open")
    e.stopPropagation()
  })
}

//注册select监听器
export const initSelectListener = function () {
	Array.from(document.querySelectorAll(".select-value")).forEach((ele) => {
    ele.addEventListener("click", handleSelect)
  })
	Array.from(document.querySelectorAll(".select-option")).forEach((ele) => {
    ele.addEventListener("click", onSelect)
  })
}

// 全部一起注册，冚家富贵
export const initAllListener = function () {
  initIconClickListener()
  initGlobalListener()
  initSelectListener()
}
