export class EditBox {
  constructor(option, type) {
    this.type = type
    this.title = option.title
    this.url = option.url
    this.id = option.id
  }
  // 显示
  show() {
    let box = document.querySelector('#edit-box')
    if(!box) {
      box = document.createElement("div")
      box.id = "edit-box"
      box.className = "edit-box"
      document.body.appendChild(box)
    }
    box.classList.add("confirm-animation")
    box.style.display = 'block'
    box.innerHTML = `
      <div class="box-li">
        <p>标题</p>
        <input id="title-input" name="itle-input" placeholder="title" value="${this.title}">
      </div>
      <div class="box-li">
        <p>链接</p>
        <input id="url-input" name="url-input" placeholder="title" value="${this.url}">
      </div>
      <div class="box-footer">
        <button class="edit-button btn-cancel">取消</button>
        <button class="edit-button btn-confirm">确认</button>
      </div>
    `
    setTimeout(()=>{
      this.initEventListener()
    })
  }
  //隐藏
  hide(){
    let box = document.querySelector("#edit-box")
    box.style.display = "none"
    box.classList.remove("eitd-box-animation")
  }
  initEventListener(){
    document.querySelector("#edit-box .btn-cancel").addEventListener("click",()=>{
      this.hide()
    })
    document.querySelector("#edit-box .btn-confirm").addEventListener("click",()=>{
      if (this.type == 'edit') {
        const title = document.querySelector("#edit-box #title-input").value
        const url = document.querySelector("#edit-box #url-input").value
        const data = { title, url }
        chrome.bookmarks.update(this.id, data, res => {
          console.log(res)
        })
      } else {
      }
      this.hide()
    })
  }
}