import { Render } from "./Render"
import { Confirm } from "./Confirm"
import { EditBox } from './EditBox'
import { switchMode, addCollect, delCollect, updateItemDOM, updateCollectData, updateCollectStatus, handleCollapse, handleJump, removeBookmark } from "./function"

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

// 卡片菜单
function handleCardMenu(e) {
  e.target.parentNode.querySelector(".menu-box").classList.toggle("menu-open")
  e.stopPropagation()
}
// 卡片Li点击
function handleMenuLiClick(e) {
  const { type } = e.target.dataset
  const option = e.target.parentNode.dataset
  const classList = Array.from(e.currentTarget.classList)
  const ele = e.target.parentNode.parentNode.parentNode
  switch(type) {
    case 'edit':
      let editBox = new EditBox(option, type, value => {
        const result = Object.assign({}, value, { id: option.id })
        if (classList.includes('collect')) {
          resetItemData(result, classList)
        } else {
          updateItemDOM(ele, value).then(() => {
            resetItemData(result, classList)
          })
        }
      })
      e.target.parentNode.classList.remove("menu-open")
      editBox.show()
      break
    case 'remove':
      let confirm = new Confirm({text:"你真的要删除吗？鸡掰",type:"warning"}, () => {
          delCollect(option.url).then(() => {
            return removeBookmark(option.id)
          }).then(() => {
            if(classList.includes('bookmark')) {
              renderer.initFavorite()
            }
            if(classList.includes('search-result')) {
              renderer.initFavorite()
              renderer.initCollect()
              renderer.initSearchResult()
            }
            if(classList.includes('collect')) {
              renderer.initCollect()
            }
            ele.remove()
          })
      })
      e.target.parentNode.classList.remove("menu-open")
      confirm.show()
      break
  }
  e.stopPropagation()
}
// 修改收藏数据
function resetItemData(value, classList) {
  updateCollectData(value).then(() => {
    if(classList.includes('collect') || classList.includes('search-result')) {
      renderer.initFavorite()
      renderer.initCollect()
    }
    if(classList.includes('bookmark')) {
      renderer.initFavorite()
    }
  })
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
    return handleMenuLiClick(e)
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


// 隐藏所有options
function hideOptions(){
  const allOptions = document.querySelectorAll('.select-container')
  allOptions.forEach(ele=>{
    ele.classList.remove('show')
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
  
}

// 全部一起注册，冚家富贵
export const initAllListener = function () {
  initIconClickListener()
  initGlobalListener()
}
