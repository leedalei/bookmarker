// 获取storage数据
// chrome.storage.sync.remove('collect')
let storageData = ''
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
  const {url,title} = e.target.parentNode.dataset
  chrome.storage.sync.get('collect',(res)=>{
    let data = JSON.parse(JSON.stringify(res.collect))
    data.push({url,title})
    chrome.storage.sync.set({collect:data})
    renderCollect(data)
  })
  e.stopPropagation()
}
// 删除收藏
function handleDelCollect(e){
  const {url} = e.target.parentNode.dataset
  chrome.storage.sync.get('collect',(res)=>{
    let data = JSON.parse(JSON.stringify(res.collect))
    data.forEach((item,index)=>{
      if(item.url === url){
        data.splice(index,1)
      }
    })
    chrome.storage.sync.set({collect:data})
    renderCollect(data)
  })
  e.stopPropagation()
}
// 跳转
function handleJump(e) {
  let url = e.target.parentNode.dataset.url
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
  let main = document.createElement("div")
  main.id = "bookmark"
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
    html += `<li class="bookmark-item bookmark-li" data-url="${data.url}" data-title="${data.title}">`
    if(storageData.search(data.url) === -1){
      html += `<svg t="1607915327546" class="icon collect-icon" data-url="${data.url}" data-title="${data.title}" viewBox="0 0 1065 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3797" width="200" height="200"><path d="M964.340451 303.311757l-209.677811-30.424833a32.072845 32.072845 0 0 1-24.086326-17.62105l-93.683133-190.155209a116.755298 116.755298 0 0 0-209.424271 0l-93.683133 190.155209a32.199615 32.199615 0 0 1-24.213096 17.494279L100.02164 303.311757a116.755298 116.755298 0 0 0-64.652771 199.155889l152.124167 147.813983a31.946075 31.946075 0 0 1 9.25422 28.396511L160.364226 887.7221A116.501758 116.501758 0 0 0 329.602363 1010.435595l187.619806-98.500398a32.072845 32.072845 0 0 1 29.917753 0l187.366266 98.500398a115.994678 115.994678 0 0 0 122.967036-8.87391 115.994678 115.994678 0 0 0 46.397871-114.093125l-35.74918-208.79042a31.946075 31.946075 0 0 1 9.25422-28.396511l152.124168-147.813983a116.755298 116.755298 0 0 0-64.652771-199.155889z" fill="#ea9518" p-id="3798"></path></svg>`
    } else {
      html += `<svg t="1607916584109" class="icon" viewBox="0 0 1065 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3801" width="200" height="200"><path d="M816.966007 1021.6621a85.98275 85.98275 0 0 1-36.367326-9.351598l-249.116185-124.687975-250.934551 125.467275a76.111618 76.111618 0 0 1-80.267884-5.974632 77.929985 77.929985 0 0 1-30.652461-77.150685l51.953323-268.338914-197.682394-183.914764a84.42415 84.42415 0 0 1-21.041096-80.267885 77.929985 77.929985 0 0 1 63.383054-53.771689l273.794013-49.87519 122.609843-248.856418a77.929985 77.929985 0 0 1 68.838153-44.939625 76.111618 76.111618 0 0 1 69.09792 44.160325l122.609843 248.856418 273.794013 48.056824a73.773719 73.773719 0 0 1 61.304921 53.511923 77.929985 77.929985 0 0 1-19.222729 80.527651l-197.162862 185.73313 49.87519 269.118214a77.929985 77.929985 0 0 1-30.65246 76.371385 69.09792 69.09792 0 0 1-44.160325 15.32623z" p-id="3802" fill="#515151"></path></svg>`
      
    }
    html += `
      <div class="bookmark-item-title">
          <img src="https://www.google.com/s2/favicons?domain=${data.url}" alt="" />
          <p class="ellipsis">${data.title}</p>
        </div>
        <p class="bookmark-item-url ellipsis">
          ${data.url}
        </p>
      </li>`
    return html
  }
  html = `<div class="bookmark-folder">
  <div class="bookmark-header">
    <span class="btn-collapse"></span>
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
    html += `<li>暂无数据</li>`
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
      <li class="bookmark-item bookmark-li" data-url="${item.url}">
      <svg t="1607915525427" class="icon del-icon" data-url="${item.url}" viewBox="0 0 1089 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5265" width="200" height="200"><path d="M1040.670958 144.278983H47.293044a47.325042 47.325042 0 0 0 0 94.650084h109.689145V820.172739A203.987251 203.987251 0 0 0 360.617461 1024h366.697082a203.987251 203.987251 0 0 0 203.667271-203.827261V238.801075h109.689144a47.293044 47.293044 0 1 0 0-94.55409zM484.16174 724.658709a47.293044 47.293044 0 1 1-94.586088 0v-297.261421a47.293044 47.293044 0 1 1 94.586088 0v297.261421z m214.066621 0a47.293044 47.293044 0 1 1-94.586089 0v-297.261421a47.293044 47.293044 0 1 1 94.586089 0v297.261421zM362.857321 94.71408h362.217362a47.35704 47.35704 0 0 0 0-94.682082H362.857321a47.35704 47.35704 0 0 0 0 94.682082z m0 0" p-id="5266" fill="#d81e06"></path></svg>
        <div class="bookmark-item-title">
          <img src="https://www.google.com/s2/favicons?domain=${item.url}" alt="" />
          <p class="ellipsis">${item.title}</p>
        </div>
        <p class="bookmark-item-url ellipsis">
          ${item.url}
        </p>
      </li>`
    }
  } else {
    html += `<li>暂无数据</li>`
  }
  html += `</ul></div>`
  let collectEl = document.getElementById('collect')
  collectEl.innerHTML = html
  initEvenListener()
}