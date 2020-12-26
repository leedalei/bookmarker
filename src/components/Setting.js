import { getStorageData, setStorageData } from "../util";
import { SearchBar } from "./SearchBar";
let searchBar = new SearchBar();

//switch开关
async function handleSwitchChange(e) {
  let { checked, name } = e.currentTarget;
  await setStorageData({ [name]: checked });
}

//switchTab选择
async function handleSwitchTabSelect(e) {
  let { name } = e.currentTarget.dataset;
  let { idx, value } = e.target.dataset;
  let $thumb = e.currentTarget.querySelector(".switch-tab-thumb");
  $thumb.style.transform = `translateX(${idx * 30}px)`;
  await setStorageData({ [name]: value });
  searchBar.getLocalSetting();
}

export class Setting {
  constructor() {
    this.initEvents();
    this.getLocalSetting();
    this.stop();
  }
  //获取数据回填
  async getLocalSetting() {
    let res = await getStorageData();
    if (res.engine) {
      this.setSwitchTabValue("engine", res.engine);
    }
    // if(res.language){ //目前语言是全自动获取的
    //   this.setSwitchTabValue("language", res.language)
    // }
    if (res.isOpenFolder !== undefined) {
      this.setSwitchValue("isOpenFolder", res.isOpenFolder);
    }
    if (res.isBlockCSDN !== undefined) {
      this.setSwitchValue("isBlockCSDN", res.isBlockCSDN);
    }
  }
  stop() {
    document.querySelector(".setting-box").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
  initEvents() {
    //打开设置
    document.querySelector(".setting-icon").addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("setting-icon--act");
      e.currentTarget.parentNode
        .querySelector(".setting-box")
        .classList.toggle("setting--open");
      e.stopPropagation();
    });
    //switchTab设置
    Array.from(document.querySelectorAll(".switch")).forEach((ele) => {
      ele.addEventListener("change", handleSwitchChange);
    });
    //switchTab设置
    Array.from(document.querySelectorAll(".switch-tab")).forEach((ele) => {
      ele.addEventListener("click", handleSwitchTabSelect);
    });
  }
  //设置switch开关的value
  setSwitchValue(name, value) {
    let curSwitch = document.querySelector(`.switch[name='${name}']`);
    curSwitch.checked = value;
  }
  //设置swichTab的value
  setSwitchTabValue(name, value) {
    let $curTab = document.querySelector(`.switch-tab[data-name='${name}']`);
    if (!$curTab) {
      return;
    }
    let $thumb = $curTab.querySelector(".switch-tab-thumb");
    let $switchTabItem = $curTab.querySelector(
      `.switch-tab-item[data-value='${value}']`
    );
    if (!$switchTabItem) {
      return;
    }
    let idx = $switchTabItem.dataset.idx;
    $thumb.style.transform = `translateX(${idx * 30}px)`;
  }
}
