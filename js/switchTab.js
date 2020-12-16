function initSwitchTabEventListener(){
  Array.from(document.querySelectorAll('.switch-tab')).forEach(e=>{
    e.addEventListener('click',switchTabTo)
  })
}
initSwitchTabEventListener()

function switchTabTo(e){
  let {idx,value} = e.target.dataset;
  switch(value){
      case 'light':
        switchMode('light');
        break;
      case 'dark':
        switchMode('dark');
        break;
      case 'auto':
        switchMode('auto');
        break;
  }
  setTab(idx)
}

// 设置tab位置
function setTab(idx){
  let thumb = document.querySelector(".switch-tab-thumb")
  thumb.style.transform = `translateX(${idx*(100+4)}px)`
}

// 获取颜色模式
function getModeData() {
  chrome.storage.sync.get('mode',(res)=>{
    const {mode} = res
    switch (mode) {
      case 'light':
        setTab(0)
        break;
      case 'dark':
        setTab(1)
        break;
      case 'auto':
        setTab(2)
        break;
      default:
        setTab(2)
        break;
    }
    if(mode) {
      document.querySelector('body').setAttribute("color-mode", mode)
    } else {
      chrome.storage.sync.set({'mode': 'auto'})
      document.querySelector('body').setAttribute("color-mode", 'auto')
    }
  })
}
getModeData();

// 切换颜色模式
function switchMode(modeData) {
  switch (modeData) {
    case "dark":
      chrome.storage.sync.set({'mode': 'dark'})
      document.querySelector('body').setAttribute("color-mode", "dark")
      break
    case "light":
      chrome.storage.sync.set({'mode': 'light'})
      document.querySelector('body').setAttribute("color-mode", "light")
      break
    case "auto":
      chrome.storage.sync.set({'mode': 'auto'})
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.querySelector('body').setAttribute("color-mode", "dark")
      } else {
        document.querySelector('body').setAttribute("color-mode", "light")
      }
      break
  }
}