export class Confirm {
  constructor(option, confirmClick, cancelClick) {
    this.text = option.text;
    this.confirmText = option.confirmText || "确定";
    this.cancelText = option.cancelText || "取消";
    this.type = option.type || "warning"; // info warning  warning下确认是红色
    this.cancelClick = cancelClick;
    this.confirmClick = confirmClick;
  }
  //显示
  show() {
    // 保持单例
    let $box = document.querySelector("#confirm");
    if (!$box) {
      $box = document.createElement("div");
      $box.id = "confirm";
      $box.className = "confirm";
      document.body.appendChild($box);
    }
    $box.classList.add("confirm-animation");
    $box.style.display = "block";
    $box.innerHTML = `
      <p class="confirm-text">${this.text}</p>
      <div class="confirm-footer">
        <button class="confirm-btn btn-cancel" data-lang-text="confirmBoxCancel">${
          this.cancelText
        }</button>
        <button class="confirm-btn btn-confirm ${
          this.type === "warnging" ? "" : "btn-confirm--warning"
        }" data-lang-text="confirmBoxConfirm">${this.confirmText}</button>
      </div>
    `;
    setTimeout(() => {
      this.initEventListener();
    });
  }
  //隐藏
  hide() {
    let $box = document.querySelector("#confirm");
    $box.style.display = "none";
    $box.classList.remove("confirm-animation");
  }
  initEventListener() {
    document
      .querySelector("#confirm .btn-cancel")
      .addEventListener("click", () => {
        if (typeof this.cancelClick === "function") {
          this.cancelClick();
        }
        this.hide();
      });
    document
      .querySelector("#confirm .btn-confirm")
      .addEventListener("click", () => {
        if (typeof this.confirmClick === "function") {
          this.confirmClick();
        }
        this.hide();
      });
  }
}
