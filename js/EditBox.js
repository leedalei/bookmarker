export class EditBox {
  constructor(option) {
    this.type = option.type
    this.title = option.title
    this.link = option.link
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
        <input id="link-input" name="link-input" placeholder="title" value="${this.link}">
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
      console.log("取消编辑")
      this.hide()
    })
    document.querySelector("#edit-box .btn-confirm").addEventListener("click",()=>{
      if (this.type == 'edit') {
        console.log('确认编辑')
      } else {
        console.log('确认添加')
      }
      console.log("title", this.title)
      console.log("link", this.link)
      this.hide()
    })
  }
}