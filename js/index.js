// chrome.storage.sync.remove('collect')
let storageData = ''

// 获取storage数据
function getStorageData(){
  chrome.storage.sync.get('collect',(res)=>{
    if(res.collect){
      renderCollect(res.collect)
      storageData = JSON.stringify(res.collect)
      // content-script无权限获取目录，需要和background通信
      chrome.runtime.sendMessage({}, function (response) {
        render(JSON.parse(response))
      })
    } else {
      chrome.storage.sync.set({'collect':[]})
    }
  })
}

getStorageData()

//注册监听器
function initEvenListener() {
  Array.from(document.querySelectorAll(".bookmark-header")).forEach((e) => {
    e.addEventListener("click", handleCollapse)
  })
  Array.from(document.querySelectorAll(".bookmark-li")).forEach((e) => {
    e.addEventListener("click", handleJump)
  })
  Array.from(document.querySelectorAll(".collect-icon")).forEach((e) => {
    e.addEventListener("click", handleCollect)
  })
  Array.from(document.querySelectorAll(".del-icon")).forEach((e) => {
    e.addEventListener("click", handleDelCollect)
  })
  document.querySelector("input").onkeypress = (e) => {
    search(e)
  }
}
// 搜索
function search(e) {
  if (event.which === 13) {
    var obj = document.querySelectorAll('.search-select')[0];
    var index = obj.selectedIndex;
    var value = obj.options[index].value;
    const inputValue = e.target.value
    let url = ''
    switch(value){
      case 'baidu':
        url = 'https://baidu.com/s?wd='
        break;
      case 'google':
        url = 'https://www.google.com/search?q='
        break;
      case 'bing':
        url = 'https://www.bing.com/search?q='
        break;
    }
    window.open(`${url}${inputValue}`, "_blank")
  }
}
// 收藏
function handleCollect(e){
  const {url,title} = e.target.dataset
  chrome.storage.sync.get('collect',(res)=>{
    let data = JSON.parse(JSON.stringify(res.collect))
    data.push({url,title})
    chrome.storage.sync.set({collect:data})
    // renderCollect(data)
    getStorageData()
  })
  e.stopPropagation()
}
// 删除收藏

function handleDelCollect(e){
  const {url} = e.target.dataset
  chrome.storage.sync.get('collect',(res)=>{
    let data = JSON.parse(JSON.stringify(res.collect))
    data.forEach((item,index)=>{
      if(item.url === url){
        data.splice(index,1)
      }
    })
    chrome.storage.sync.set({collect:data})
    getStorageData()
  })
  e.stopPropagation()
}
// 跳转
function handleJump(e) {
  let url = e.currentTarget.dataset.url
  if(url){
    window.open(url, "_blank")
  }
}
// 折叠
function handleCollapse(e) {
  let curFolder = e.target.parentNode
  let curUl = curFolder.querySelector("ul")
  curUl.style.display = curUl.style.display == "none" ? "flex" : "none"
  let icon = e.target.querySelector(".btn-collapse")
  icon.classList.toggle("btn-collapse--act")
}

// 渲染
function render(data) {
  let main = document.getElementById('bookmark')
  main.innerHTML = ''
  let folderList = data[0].children
  for (let item of folderList) {
    main.innerHTML += backTrack(item)
  }
  document.body.appendChild(main)
  initEvenListener()
}
// 递归构造目录
function backTrack(data) {
  let html = ''
  if (!data.children) {
    html += `<li class="bookmark-li" data-url="${data.url}" data-title="${data.title}">`
    html += `
      <div class="bookmark-item">
        <div class="bookmark-item-bg"></div>
        <img class="iconTop" data-url="${data.url}" data-title="${data.title}" src="${storageData.search(data.url) === -1 ?'./img/collect2.svg':'./img/collected2.svg'}" />
        <div class="bookmark-item-title">
            <img src="https://www.google.com/s2/favicons?domain=${data.url}" alt="" />
            <p class="ellipsis">${data.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis">
            ${data.url}
          </p>
          <div class="bookmark-info">
            <p>${storageData.search(data.url) === -1 ?'未收藏':'已收藏'}</p>
            <img class="icon ${storageData.search(data.url) === -1 ?'collect-icon':''}" data-url="${data.url}" data-title="${data.title}" src="${storageData.search(data.url) === -1 ?'./img/collect.svg':'./img/collected.svg'}" />
          </div>
        </div>
      </li>`
    return html
  }
  html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse btn-collapse--act"></span>
    <h3 class="bookmark-title">${data.title}</h3>
  </div>
  <ul class="bookmark-ul">`
  //先把无children的处理完
  if (data.children.length) {
    for (let item of data.children) {
      if (!item.children) {
        html += backTrack(item)
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
      html += backTrack(item)
    }
  }
  return html
}

// 渲染收藏
function renderCollect(data){
  let html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse"></span>
    <h3 class="bookmark-title">收藏夹</h3>
  </div>
  <ul class="bookmark-ul">`
  if(data.length>0){
    for (let item of data) {
      html += `
      <li class="bookmark-li" data-url="${item.url}">
        <div class="bookmark-item">
          <div class="bookmark-item-bg"></div>
          <img class="iconTop" src="./img/collected2.svg" />
          <!-- <img class="menu" src="./img/menu.svg" /> -->
          <div class="bookmark-item-title">
            <img src="https://www.google.com/s2/favicons?domain=${item.url}" alt="" />
            <p class="ellipsis">${item.title}</p>
          </div>
          <p class="bookmark-item-url ellipsis">
            ${item.url}
          </p>
          <div class="bookmark-info">
            <p>已收藏</p>
            <img class="icon del-icon" data-url="${item.url}" src="./img/del.svg" />
          </div>
        </div>
      </li>`
    }
  } else {
    html += `
    <li class="no-data">
      <img src="./img/empty.svg">
      <p>暂无数据嗷，铁汁</p>
    </li>`
  }
  html += `</ul></div>`
  let collectEl = document.getElementById('collect')
  collectEl.innerHTML = html
  initEvenListener()
}