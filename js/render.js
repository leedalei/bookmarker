import { getStorageData } from "./store"
export class Render {
  constructor(autoInit) {
    if (autoInit) {
      this.init()
    }
    this.iconMenuDom = ` <svg class="icon-menu" width="16px" height="4px" viewBox="0 0 16 4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="hover" transform="translate(-264.000000, -18.000000)">
              <g id="menu-icon" transform="translate(264.000000, 18.000000)" fill-rule="nonzero">
                  <path d="M0,1.6 C0,2.4836556 0.7163444,3.2 1.6,3.2 C2.4836556,3.2 3.2,2.4836556 3.2,1.6 C3.2,0.7163444 2.4836556,0 1.6,0 C0.7163444,0 0,0.7163444 0,1.6 L0,1.6 Z" id="路径"></path>
                  <path d="M6.4,1.60000002 C6.4,2.48365561 7.1163444,3.2 8,3.2 C8.8836556,3.2 9.6,2.48365561 9.6,1.60000002 C9.6,1.02837508 9.29504174,0.500171837 8.80000001,0.214359359 C8.30495828,-0.0714531196 7.69504172,-0.0714531196 7.19999999,0.214359359 C6.70495826,0.500171837 6.4,1.02837508 6.4,1.60000002 L6.4,1.60000002 Z" id="路径"></path>
                  <path d="M12.8,1.6 C12.8,2.4836556 13.5163444,3.2 14.4,3.2 C15.2836556,3.2 16,2.4836556 16,1.6 C16,0.7163444 15.2836556,0 14.4,0 C13.5163444,0 12.8,0.7163444 12.8,1.6 Z" id="路径"></path>
              </g>
          </g>
      </g>
    </svg>`
    this.dataError = `
    <li class="no-data">
      <img src="./img/empty.svg">
      <p>暂无置顶嗷，铁汁</p>
    </li>`
  }
  async init() {
    await this.initFavorite()
    await this.initCollect()
  }
  //注册置顶栏
  async initFavorite() {
    let res = await getStorageData("collect")
    if (res.collect) {
      this.createFavoriteDom(res.collect)
    } else {
      chrome.storage.sync.set({ collect: [] })
    }
  }
  //生成制定栏dom结构
  createFavoriteDom(data) {
    let html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse unclick"></span>
    <h3 class="bookmark-title unclick">置顶收藏</h3>
  </div>
  <ul class="bookmark-ul">`
    if (data.length > 0) {
      for (let item of data) {
        html += `
      <li class="bookmark-li flow-in-from-up">
        <div class="bookmark-item" data-url="${item.url}">
          <div class="bookmark-item-bg unclick"></div>
          <img class="icon-top unclick" src="./img/collected2.svg" />
          ${this.iconMenuDom}
          <ul class="menu-box">
            <li class="menu-li">编辑</li>
            <li class="menu-li">删除</li>
          </ul>
          <div class="bookmark-item-title unclick">
            <img src="chrome://favicon/${item.url}" alt="" />
            <p class="ellipsis">${item.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${item.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">${item.category}</p>
            <img class="icon del-icon" data-url="${item.url}" src="./img/del.svg" />
          </div>
        </div>
      </li>`
      }
    } else {
      html += this.dataError
    }
    html += `</ul></div>`
    let collectEl = document.getElementById("collect")
    collectEl.innerHTML = html
  }

  //注册书签列表
  initCollect() {
    return new Promise((resolve, reject) => {
      // content-script无权限获取目录，需要和background通信
      chrome.bookmarks.getTree(async (data) => {
        let main = document.getElementById("bookmark")
        main.innerHTML = ""
        let folderList = data[0].children
        for (let item of folderList) {
          main.innerHTML += await this.createCollectDom(item)
        }
        document.body.appendChild(main)
        resolve()
      })
    })
  }
  //生成书签列表的dom结构
  async createCollectDom(data, category) {
    let storageData = await getStorageData("collect")
    storageData = JSON.stringify(storageData)
    let html = ""
    if (!data.children) {
      html += `<li class="bookmark-li flow-in-from-up">`
      html += `
        <div class="bookmark-item" data-url="${data.url}">
          <div class="bookmark-item-bg unclick"></div>
          <img class="icon-top unclick" data-url="${data.url}" src="${storageData.search(data.url) === -1
          ? "./img/collect2.svg"
          : "./img/collected2.svg"
        }" />
          ${this.iconMenuDom}
          <ul class="menu-box">
            <li class="menu-li">编辑</li>
            <li class="menu-li">删除</li>
          </ul>
          <div class="bookmark-item-title unclick">
              <img src="chrome://favicon/${data.url}" alt="" />
              <p class="ellipsis">${data.title}</p>
            </div>
            <p class="bookmark-item-url ellipsis unclick">
              ${data.url}
            </p>
            <div class="bookmark-info">
              <p class="unclick">${storageData.search(data.url) === -1 ? "未收藏" : "已收藏"
        }</p>
              <img class="icon-collect ${storageData.search(data.url) === -1 ? "" : "icon-collect--act"
        }" data-url="${data.url}" data-title="${data.title}" data-category="${category}" src="${storageData.search(data.url) === -1
          ? "./img/collect.svg"
          : "./img/collected.svg"
        }" />
            </div>
          </div>
        </li>`
      return html
    }
    html = `<div class="bookmark-folder">
    <div class="bookmark-header">
      <span class="btn-collapse btn-collapse--act unclick"></span>
      <h3 class="bookmark-title unclick">${data.title}</h3>
    </div>
    <ul class="bookmark-ul" style="display:none">`
    //先把无children的处理完
    if (data.children.length) {
      for (let item of data.children) {
        if (!item.children) {
          let category = data.title
          html += await this.createCollectDom(item, category)
        }
      }
    } else {
      html += this.dataError
    }
    html += `</ul></div>`
    for (let item of data.children) {
      if (item.children) {
        html += await this.createCollectDom(item)
      }
    }
    return html
  }

  //注册搜索结果
  initSearchResult(data) {
    this.createSearchResultDom(data)
  }
  //生成搜索结果的dom结果
  async createSearchResultDom(data) {
    let storageData = await getStorageData("collect")
    storageData = JSON.stringify(storageData)
    let html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse unclick"></span>
    <h3 class="bookmark-title unclick">搜索结果</h3>
  </div>
  <ul class="bookmark-ul">`
    if (data.length > 0) {
      for (let item of data) {
        html += `
      <li class="bookmark-li flow-in-from-up">
        <div class="bookmark-item" data-url="${item.url}">
          <div class="bookmark-item-bg unclick"></div>
          <img class="icon-top unclick" data-url="${item.url}" src="${storageData.search(item.url) === -1
            ? "./img/collect2.svg"
            : "./img/collected2.svg"
          }" />
          ${this.iconMenuDom}
          <ul class="menu-box">
            <li class="menu-li">编辑</li>
            <li class="menu-li">删除</li>
          </ul>
          <div class="bookmark-item-title unclick">
            <img src="chrome://favicon/${item.url}" alt="" />
            <p class="ellipsis">${item.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${item.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">${storageData.search(item.url) === -1 ? "未收藏" : "已收藏"
          }</p>
            <img class="icon-collect ${storageData.search(item.url) === -1 ? "" : "icon-collect--act"
          }" data-url="${item.url}" data-title="${item.title}" src="${storageData.search(item.url) === -1
            ? "./img/collect.svg"
            : "./img/collected.svg"
          }" />
          </div>
        </div>
      </li>`
      }
    } else {
      html += this.dataError
    }
    html += `</ul></div>`
    let resultEle = document.getElementById("search-result")
    resultEle.style.display = 'block'
    resultEle.innerHTML = html
  }
}


