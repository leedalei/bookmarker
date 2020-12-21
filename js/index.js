import { Render } from "./Render"
import { SearchBar } from "./SearchBar"
import { getModeData } from "./function"
import {Setting} from "./Setting"
import { Confirm } from "./Confirm"
import { EditBox } from './EditBox'

import { initAllListener } from "./event"

async function main() {
  getModeData()
  new Render(true)
  initAllListener() //然后注册所有的事件监听器
  new SearchBar()
  new Setting()
  // let editBox = new EditBox({title: "title", url: "https://biandan.me", type: "edit", id: "123"})
  // editBox.show()
  // let confirm = new Confirm({text:"你真的要删除吗？鸡掰",type:"warning"})
  // confirm.show()
}

main()
