import { Render } from "./Render"
import { SearchBar } from "./SearchBar"
import { Confirm } from "./Confirm"

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
  getModeData()
  new Render(true)
  initAllListener() //然后注册所有的事件监听器
  new SearchBar()
  // let confirm = new Confirm({text:"你真的要删除吗？鸡掰",type:"warning"})
  // confirm.show()
}

main()
