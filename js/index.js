// content-script无权限获取目录，需要和background通信
chrome.runtime.sendMessage({}, function (response) {
  render(JSON.parse(response))
})

//注册监听器
function initEvenListener() {
  Array.from(document.querySelectorAll(".bookmark-header")).forEach((e) => {
    e.addEventListener("click", handleCollapse)
  })
  Array.from(document.querySelectorAll(".bookmark-li")).forEach((e) => {
    e.addEventListener("click", handleJump)
  })
}
// 跳转
function handleJump(e) {
  let url = e.target.parentNode.dataset.url
  window.open(url, "_blank")
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
    <li class="bookmark-item bookmark-li" data-url="${data.url}">
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
