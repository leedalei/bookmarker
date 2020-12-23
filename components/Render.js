import { getStorageData } from "../js/util";
export class Render {
  constructor(autoInit) {
    if (autoInit) {
      this.init();
    }
    this.isOpenFolder = false;
    this.ids = [];
  }
  // 初始化
  async init() {
    await this.initFavorite();
    await this.initCollect();
  }
  dataError(value) {
    return `
    <li class="no-data">
      <img src="./img/empty.svg">
      <p>${value}</p>
    </li>`;
  }
  itemMenuDOM(dataset) {
    let data = "";
    if (dataset) {
      for (let key in dataset) {
        data += ` data-${key}="${dataset[key]}"`;
      }
    }
    return ` <svg class="icon-menu" width="16px" height="4px" viewBox="0 0 16 4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="hover" transform="translate(-264.000000, -18.000000)">
              <g id="menu-icon" transform="translate(264.000000, 18.000000)" fill-rule="nonzero">
                  <path d="M0,1.6 C0,2.4836556 0.7163444,3.2 1.6,3.2 C2.4836556,3.2 3.2,2.4836556 3.2,1.6 C3.2,0.7163444 2.4836556,0 1.6,0 C0.7163444,0 0,0.7163444 0,1.6 L0,1.6 Z" id="路径"></path>
                  <path d="M6.4,1.60000002 C6.4,2.48365561 7.1163444,3.2 8,3.2 C8.8836556,3.2 9.6,2.48365561 9.6,1.60000002 C9.6,1.02837508 9.29504174,0.500171837 8.80000001,0.214359359 C8.30495828,-0.0714531196 7.69504172,-0.0714531196 7.19999999,0.214359359 C6.70495826,0.500171837 6.4,1.02837508 6.4,1.60000002 L6.4,1.60000002 Z" id="路径"></path>
                  <path d="M12.8,1.6 C12.8,2.4836556 13.5163444,3.2 14.4,3.2 C15.2836556,3.2 16,2.4836556 16,1.6 C16,0.7163444 15.2836556,0 14.4,0 C13.5163444,0 12.8,0.7163444 12.8,1.6 Z" id="路径"></path>
              </g>
          </g>
      </g>
    </svg>
    <ul class="menu-box"${data}>
      <li class="menu-li" data-type="edit">编辑</li>
      <li class="menu-li" data-type="remove">删除</li>
    </ul>`;
  }
  // 创建 booomarkeItem
  async createBookmarkItem(data, category, isRefs = false) {
    let html = ""
    if (isRefs) await this.initData();
    if (!isRefs) html += `<li class="bookmark-li flow-in-from-up">`;
    html += `
      <div class="bookmark-item" data-url="${data.url}">
        <div class="bookmark-item-bg unclick"></div>
        <img class="icon-top unclick" data-url="${data.url}" src="${
      this.ids.indexOf(data.id) === -1
        ? "./img/collect2.svg"
        : "./img/collected2.svg"
    }" />
      ${this.itemMenuDOM({
        id: data.id,
        title: data.title,
        url: data.url,
      })}
        <div class="bookmark-item-title unclick">
            <img src="chrome://favicon/${data.url}" alt="" />
            <p class="ellipsis">${data.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${data.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">&nbsp;</p>
            <img class="icon icon-collect ${
              this.ids.indexOf(data.id) === -1 ? "" : "icon-collect--act"
            }" data-id="${data.id}" data-url="${data.url}" data-title="${
      data.title
    }" data-category="${category}" src="${
      this.ids.indexOf(data.id) === -1
        ? "./img/collect.svg"
        : "./img/collected.svg"
    }" />
          </div>
        </div>`;
    if (!isRefs) html += '</li>'
    return html;
  }

  // 获取初始化数据
  async initData() {
    let storageDataOrigin = await getStorageData();
    this.isOpenFolder = storageDataOrigin.isOpenFolder;
    this.ids = storageDataOrigin.collect.map(item => item.id)
  }

  //注册置顶栏
  async initFavorite() {
    let res = await getStorageData("collect");
    if (res.collect) {
      await this.initData();
      this.createFavoriteDom(res.collect);
    } else {
      chrome.storage.sync.set({ collect: [] });
    }
  }
  //生成置顶栏dom结构
  createFavoriteDom(data) {
    let html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse unclick"></span>
    <h3 class="bookmark-title unclick">${chrome.i18n.getMessage(
      "stickyFolderName"
    )}</h3>
  </div>
  <ul class="bookmark-ul">`;
    if (data.length > 0) {
      for (let item of data) {
        html += `
      <li class="bookmark-li flow-in-from-up">
        <div class="bookmark-item" data-url="${item.url}">
          <div class="bookmark-item-bg unclick"></div>
          <img class="icon-top unclick" src="./img/collected2.svg" />
          ${this.itemMenuDOM({
            id: item.id,
            title: item.title,
            url: item.url,
          })}
          <div class="bookmark-item-title unclick">
            <img src="chrome://favicon/${item.url}" alt="" />
            <p class="ellipsis">${item.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${item.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">${item.category}</p>
            <img class="icon del-icon" data-url="${
              item.url
            }" src="./img/del.svg" />
          </div>
        </div>
      </li>`;
      }
    } else {
      html += this.dataError(chrome.i18n.getMessage("noStickyData"));
    }
    html += `</ul></div>`;
    let collectEl = document.getElementById("collect");
    collectEl.innerHTML = html;
  }
  // 隐藏item的menu
  handleBookmarkItemBlur(e) {
    e.currentTarget.querySelector(".menu-box").classList.remove("menu--open");
  }
  // 监听鼠标移动
  initMouseLeaveListener() {
    Array.from(document.querySelectorAll(".bookmark-item")).forEach((e) => {
      e.addEventListener("mouseleave", this.handleBookmarkItemBlur);
    });
  }

  //注册书签列表
  initCollect() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(async (data) => {
        let main = document.getElementById("bookmark");
        main.innerHTML = "";
        let folderList = data[0].children;
        await this.initData();
        for (let item of folderList) {
          main.innerHTML += await this.createCollectDom(item);
        }
        document.body.appendChild(main);
        this.initMouseLeaveListener();
        resolve();
      });
    });
  }
  //生成书签列表的dom结构
  async createCollectDom(data, category) {
    let html = "";
    if (!data.children) {
      return this.createBookmarkItem(data, category)
    }
    html = `<div class="bookmark-folder">
    <div class="bookmark-header">
      <span class="btn-collapse ${
        this.isOpenFolder ? "" : "btn-collapse--act"
      } unclick"></span>
      <h3 class="bookmark-title unclick">${data.title}</h3>
    </div>
    <ul class="bookmark-ul" style="display:${
      this.isOpenFolder ? "flex" : "none"
    }">`;
    //先把无children的处理完
    if (data.children.length) {
      for (let item of data.children) {
        if (!item.children) {
          let category = data.title;
          html += await this.createCollectDom(item, category);
        }
      }
    } else {
      html += this.dataError(chrome.i18n.getMessage("noData"));
    }
    html += `</ul></div>`;
    for (let item of data.children) {
      if (item.children) {
        html += await this.createCollectDom(item);
      }
    }
    return html;
  }

  //注册搜索结果
  async initSearchResult(data) {
    await this.initData();
    await this.createSearchResultDom(data);
  }
  //生成搜索结果的dom结果
  async createSearchResultDom(data) {
    let storageData = await getStorageData("collect");
    storageData = JSON.stringify(storageData);
    let html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse unclick"></span>
    <h3 class="bookmark-title unclick">搜索结果</h3>
  </div>
  <ul class="bookmark-ul">`;
    if (data.length > 0) {
      for (let item of data) {
        html += `
      <li class="bookmark-li flow-in-from-up">
        <div class="bookmark-item" data-url="${item.url}">
          <div class="bookmark-item-bg unclick"></div>
          <img class="icon-top unclick" data-url="${item.url}" src="${
            this.ids.indexOf(item.id) === -1
            ? "./img/collect2.svg"
            : "./img/collected2.svg"
        }" />
          ${this.itemMenuDOM({
            id: item.id,
            title: item.title,
            url: item.url,
          })}
          <div class="bookmark-item-title unclick">
            <img src="chrome://favicon/${item.url}" alt="" />
            <p class="ellipsis">${item.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${item.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">&nbsp;</p>
            <img class="icon icon-collect ${
              this.ids.indexOf(item.id) === -1 ? "" : "icon-collect--act"
            }" data-url="${item.url}" data-title="${item.title}" src="${
              this.ids.indexOf(item.id) === -1
            ? "./img/collect.svg"
            : "./img/collected.svg"
        }" />
          </div>
        </div>
      </li>`;
      }
    } else {
      html += this.dataError(chrome.i18n.getMessage("noSearchResult"));
    }
    html += `</ul></div>`;
    let resultEle = document.getElementById("search-result");
    resultEle.style.display = "block";
    resultEle.innerHTML = html;
    this.initMouseLeaveListener();
  }
}
