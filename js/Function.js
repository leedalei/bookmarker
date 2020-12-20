import { getStorageData } from "./store"

export class DefaultFunc {
  // 获取颜色模式
  getModeData() {
    chrome.storage.sync.get('mode',(res)=>{
      let {mode} = res
      if(!mode) {
        mode = 'auto'
        chrome.storage.sync.set({'mode': mode})
      }
      document.querySelector('body').setAttribute("color-mode", mode)
    })
  }
  // 切换颜色模式
  switchMode(modeData) {
    chrome.storage.sync.set({ mode: modeData })
    document.querySelector("body").setAttribute("color-mode", modeData)
  }
  // 跳转
  handleJump(e) {
    const url = e.target.dataset.url
    if (url) {
      window.open(url, "_blank")
    }
  }
  // 折叠
  handleCollapse(e) {
    let curFolder = e.target.parentNode
    let curUl = curFolder.querySelector("ul")
    curUl.style.display = curUl.style.display == "none" ? "flex" : "none"
    let icon = e.target.querySelector(".btn-collapse")
    icon.classList.toggle("btn-collapse--act")
  }
}

export class ItemFunc {
  // 删除收藏
  delCollect(url) {
    return new Promise(resolve => {
      chrome.storage.sync.get("collect", (res) => {
        let data = JSON.parse(JSON.stringify(res.collect))
        data.forEach((item, index) => {
          if (item.url === url) {
            data.splice(index, 1)
          }
        })
        chrome.storage.sync.set({ collect: data })
        resolve()
      })
    })
  }
  // 添加收藏
  addCollect(data) {
    const { url, title, category } = data
    return new Promise(resolve => {
      chrome.storage.sync.get("collect", (res) => {
        let data = JSON.parse(JSON.stringify(res.collect))
        data.push({ url, title, category })
        chrome.storage.sync.set({ collect: data })
        resolve()
      })
    })
  }
  // 更新收藏的状态
  async updateCollectStatus(isAddCollect, url) {
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
}