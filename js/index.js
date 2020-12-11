// content-script无权限获取目录，需要和background通信
chrome.runtime.sendMessage({}, function (response) {
  render(JSON.parse(response))
})

//注册监听器
function initEvenListener() {
  Array.from(document.querySelectorAll(".btn-collapse")).forEach((e) => {
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
  let curFolder = e.target.parentNode.parentNode
  let curUl = curFolder.querySelector("ul")
  curUl.style.display = curUl.style.display == "none" ? "flex" : "none"
  e.target.classList.toggle("btn-collapse--act")
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
  if (!data.children) {
    return `
    <li class="bookmark-item bookmark-li" data-url="${data.url}" data-title="${data.title}">
    <svg t="1607478049457" class="icon collect-icon" data-url="${data.url}" data-title="${data.title}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3881"><path d="M458.752 81.237333c16.768-51.413333 89.728-51.413333 106.453333 0L650.24 342.186667h275.072c54.186667 0 76.757333 69.205333 32.853333 100.992l-222.464 161.28 84.992 260.906666c16.725333 51.456-42.24 94.208-86.144 62.421334L512 766.464l-222.506667 161.28c-43.861333 31.786667-102.869333-10.965333-86.144-62.421333l84.992-260.906667-222.506666-161.28c-43.861333-31.786667-21.333333-100.992 32.896-100.992H373.76l84.992-260.906667z" p-id="3882" fill="#f4ea2a"></path></svg>
      <div class="bookmark-item-title">
        <img src="https://www.google.com/s2/favicons?domain=${data.url}" alt="" />
        <p class="ellipsis">${data.title}</p>
      </div>
      <p class="bookmark-item-url ellipsis">
        ${data.url}
      </p>
    </li>`
  }
  let html = `<div class="bookmark-folder">
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


// 获取storage数据
// chrome.storage.sync.remove('collect')
chrome.storage.sync.get('collect',(res)=>{
  if(res.collect){
    renderCollect(res.collect)
  } else {
    chrome.storage.sync.set({'collect':[]})
  }
})

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
      <svg t="1607673472483" class="icon del-icon" data-url="${item.url}" viewBox="0 0 1089 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3290"><path d="M1040.670958 144.278983H47.293044a47.325042 47.325042 0 0 0 0 94.650084h109.689145V820.172739A203.987251 203.987251 0 0 0 360.617461 1024h366.697082a203.987251 203.987251 0 0 0 203.667271-203.827261V238.801075h109.689144a47.293044 47.293044 0 1 0 0-94.55409zM484.16174 724.658709a47.293044 47.293044 0 1 1-94.586088 0v-297.261421a47.293044 47.293044 0 1 1 94.586088 0v297.261421z m214.066621 0a47.293044 47.293044 0 1 1-94.586089 0v-297.261421a47.293044 47.293044 0 1 1 94.586089 0v297.261421zM362.857321 94.71408h362.217362a47.35704 47.35704 0 0 0 0-94.682082H362.857321a47.35704 47.35704 0 0 0 0 94.682082z m0 0" p-id="3291"></path></svg>
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