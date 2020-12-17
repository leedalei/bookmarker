import { getStorageData } from "./store"
// 递归构造收藏的列表dom结构
async function createCollect(data) {
  let storageData = await getStorageData("collect")
  storageData = JSON.stringify(storageData)
  let html = ""
  if (!data.children) {
    html += `<li class="bookmark-li">`
    html += `
      <div class="bookmark-item" data-url="${data.url}">
        <div class="bookmark-item-bg unclick"></div>
        <img class="icon-top unclick" data-url="${data.url}" src="${
      storageData.search(data.url) === -1
        ? "./img/collect2.svg"
        : "./img/collected2.svg"
    }" />
        <div class="bookmark-item-title unclick">
            <img src="https://www.google.com/s2/favicons?domain=${
              data.url
            }" alt="" />
            <p class="ellipsis">${data.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${data.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">${
              storageData.search(data.url) === -1 ? "未收藏" : "已收藏"
            }</p>
            <img class="icon-collect ${
              storageData.search(data.url) === -1 ? "" : "icon-collect--act"
            }" data-url="${data.url}" data-title="${data.title}" src="${
      storageData.search(data.url) === -1
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
        html += await createCollect(item)
      }
    }
  } else {
    html += `
    <li class="no-data">
      <img src="./img/empty.svg">
      <p>暂无数据嗷，铁汁</p>
    </li>`
  }
  html += `</ul></div>`
  for (let item of data.children) {
    if (item.children) {
      html += await createCollect(item)
    }
  }
  return html
}

// 构造我的最爱的dom结构
function createFavorite(data) {
  let html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse unclick"></span>
    <h3 class="bookmark-title unclick">置顶收藏</h3>
  </div>
  <ul class="bookmark-ul">`
  if (data.length > 0) {
    for (let item of data) {
      html += `
      <li class="bookmark-li">
        <div class="bookmark-item" data-url="${item.url}">
          <div class="bookmark-item-bg unclick"></div>
          <img class="icon-top unclick" src="./img/collected2.svg" />
          <div class="bookmark-item-title unclick">
            <img src="https://www.google.com/s2/favicons?domain=${item.url}" alt="" />
            <p class="ellipsis">${item.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis unclick">
            ${item.url}
          </p>
          <div class="bookmark-info">
            <p class="unclick">已收藏</p>
            <img class="icon del-icon" data-url="${item.url}" src="./img/del.svg" />
          </div>
        </div>
      </li>`
    }
  } else {
    html += `
    <li class="no-data">
      <img src="./img/empty.svg">
      <p>暂无置顶嗷，铁汁</p>
    </li>`
  }
  html += `</ul></div>`
  let collectEl = document.getElementById("collect")
  collectEl.innerHTML = html
}

// 渲染我的最爱、置顶
export const renderFavorite = async () => {
  let res = await getStorageData("collect")
  if (res.collect) {
    createFavorite(res.collect)
  } else {
    chrome.storage.sync.set({ collect: [] })
  }
}

// 渲染收藏列表
export const renderCollect = () =>
  new Promise((resolve, reject) => {
    // content-script无权限获取目录，需要和background通信
    chrome.runtime.sendMessage({}, async function (response) {
      let data = JSON.parse(response)
      let main = document.getElementById("bookmark")
      main.innerHTML = ""
      let folderList = data[0].children
      for (let item of folderList) {
        main.innerHTML += await createCollect(item)
      }
      document.body.appendChild(main)
      resolve()
    })
  })
