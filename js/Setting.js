import { getStorageData, setStorageData } from "./store"
import { SearchBar } from "./SearchBar"
let searchBar = new SearchBar()

async function handleSwitchTabSelect(e) {
  let { name } = e.currentTarget.dataset
  let { idx, value } = e.target.dataset
  let thumb = e.currentTarget.querySelector(".switch-tab-thumb")
  thumb.style.transform = `translateX(${idx * 30}px)`
  await setStorageData({ [name]: value })
  searchBar.getLocalSetting()
}

export class Setting {
  constructor() {
    this.initEvents()
    this.getLocalSetting()
  }
  //获取数据回填
  async getLocalSetting() {
    let res = await getStorageData("engine")
    if(res.engine){
      this.setSwitchTabValue("engine", res.engine)
    }
    let res2 = await getStorageData("language")
    if(res2.language){
      this.setSwitchTabValue("language", res2.language)
    }
  }
  initEvents() {
    //打开设置
    document.querySelector(".setting-icon").addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("setting-icon--act")
      e.currentTarget.parentNode
        .querySelector(".setting-box")
        .classList.toggle("setting-open")
      e.stopPropagation()
    })
    //switchTab设置
    Array.from(document.querySelectorAll(".switch-tab")).forEach((ele) => {
      ele.addEventListener("click", handleSwitchTabSelect)
    })
  }
  //设置swichTab的value
  setSwitchTabValue(tabName, value) {
    let curTab = document.querySelector(`.switch-tab[data-name='${tabName}']`)
    let thumb = curTab.querySelector(".switch-tab-thumb")
    let switchTabItem = curTab.querySelector(
      `.switch-tab-item[data-value='${value}']`
    )
    if (!switchTabItem) {
      return
    }
    let idx = switchTabItem.dataset.idx
    thumb.style.transform = `translateX(${idx * 30}px)`
  }
}
