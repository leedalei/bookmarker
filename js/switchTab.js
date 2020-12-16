function initSwitchTabEventListener(){
  Array.from(document.querySelectorAll('.switch-tab')).forEach(e=>{
    e.addEventListener('click',switchTabTo)
  })
  document.querySelector('.form-item').addEventListener('click',(e) => {
    document.querySelector('.form-item').classList.toggle("mode-open")
  })
  Array.from(document.querySelectorAll('.form-item svg')).forEach(e=>{
    e.addEventListener('click',switchTabTo)
  })
}
initSwitchTabEventListener()

function switchTabTo(e){
  let {value} = e.target.dataset;
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
}

// 获取颜色模式
function getModeData() {
  chrome.storage.sync.get('mode',(res)=>{
    const {mode} = res
    console.log(mode)
    switch (mode) {
      case 'light':
        break;
      case 'dark':
        break;
      case 'auto':
        break;
      default:
        break;
    }
    if(!mode) {
      chrome.storage.sync.set({'mode': 'auto'})
      mode = 'auto'
    }
    document.querySelector('body').setAttribute("color-mode", mode)
  })
}
getModeData();

// 切换颜色模式
function switchMode(modeData) {
  chrome.storage.sync.set({'mode': modeData})
  document.querySelector('body').setAttribute("color-mode", modeData)
}