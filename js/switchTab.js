function initSwitchTabEventListener(){
  Array.from(document.querySelectorAll('.switch-tab')).forEach(e=>{
    e.addEventListener('click',switchTabTo)
  })
}
initSwitchTabEventListener()

function switchTabTo(e){
  let {idx} = e.target.dataset;
  let thumb = document.querySelector(".switch-tab-thumb")
  thumb.style.transform = `translateX(${idx*(100+4)}px)`
}