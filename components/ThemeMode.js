import { setStorageData } from "../js/util";

export class ThemeMode {
  constructor() {
    this.init();
  }
  init() {
    this.getModeData();
    Array.from(document.querySelectorAll("#theme svg")).forEach((ele) => {
      ele.addEventListener("click", this.handleThemeChange);
    });
    document.querySelector("#theme").addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("mode--open");
      e.stopPropagation();
    });
  }
  //获取主题数据
  getModeData() {
    chrome.storage.sync.get("mode", (res) => {
      let { mode } = res;
      if (!mode) {
        mode = "auto";
        setStorageData({ mode });
      }
      document.querySelector("body").setAttribute("color-mode", mode);
    });
  }
  // 手动切换颜色模式
  handleThemeChange(e) {
    let { value } = e.currentTarget.dataset;
    let mode;
    switch (value) {
      case "light":
        mode = "light";
        break;
      case "dark":
        mode = "dark";
        break;
      case "auto":
        mode = "auto";
        break;
    }
    setStorageData({ mode });
    document.querySelector("body").setAttribute("color-mode", mode);
  }
}
