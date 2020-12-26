export class GlobalListener {
  constructor() {
    this.init();
  }
  init() {
    document.body.addEventListener("click", () => {
      document
        .querySelector(".setting-icon")
        .classList.remove("setting-icon--act");
      document.querySelector(".setting-box").classList.remove("setting--open");
      document.querySelector(".form-item").classList.remove("mode--open");
      Array.from(document.querySelectorAll(".select-container")).forEach(
        (ele) => {
          ele.classList.remove("show");
        }
      );
    });
  }
}
