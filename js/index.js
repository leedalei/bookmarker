import { Render } from "./Render"
import { SearchBar } from "./SearchBar"

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
  new Render(true)
  initAllListener() //然后注册所有的事件监听器
  new SearchBar()
  getModeData()
}

main()
