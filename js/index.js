import { renderCollect, renderFavorite } from "./render"
import { initAllListener } from "./event"

// 获取颜色模式
function getModeData() {
  chrome.storage.sync.get('mode',(res)=>{
    let {mode} = res
    if(!mode) {
      mode = 'auto'
      chrome.storage.sync.set({'mode': mode})
    }
    document.querySelector('body').setAttribute("color-mode", mode)
  })
}

async function main() {
  await renderCollect() //先渲染收藏列表
  await renderFavorite() //再渲染我的最爱
  initAllListener() //然后注册所有的事件监听器
  getModeData()
}

main()
