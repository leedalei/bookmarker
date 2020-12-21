import { Render } from "./Render"
import { debounce } from './util'
import { bookmarkEventDelegation } from './event'
let renderer = new Render(false)
export class SearchBar {
  constructor() {
    this.init()
    this.searchInsideDebounce = debounce(this.searchInside, 700)
  }
  init() {
    this.initSearchOutside()
    this.initSearchInside()
  }

  // 注册搜索外部
  initSearchOutside() {
    document
      .querySelector("#search-bar")
      .addEventListener("keyup", this.searchOutside)
  }
  //搜索外部实际逻辑
  searchOutside(e) {
    if (e.which === 13) {
      var obj = document.querySelectorAll(".search-select")[0]
      const { value } = obj.dataset
      const inputValue = e.target.value
      let url = ""
      if (!inputValue) {
        return
      }
      switch (value) {
        case "baidu":
          url = "https://baidu.com/s?wd="
          break
        case "google":
          url = "https://www.google.com/search?q="
          break
        case "bing":
          url = "https://www.bing.com/search?q="
          break
        case "sougou":
          url = "https://www.sogou.com/web?query="
          break
      }
      window.open(`${url}${inputValue}`, "_blank")
      e.target.value = ''
      document.querySelectorAll("#bookmark,#collect").forEach((ele) => {
        ele.style.display = "block"
      })
      document.querySelector("#search-result").style.display = "none"
    }
  }
  //注册搜索本地
  initSearchInside() {
    document
      .querySelector("#search-bar")
      .addEventListener("input", (e) => this.searchInsideDebounce(e))
  }
  //搜索本地实际逻辑
  searchInside(e) {
    let query = e.target.value
    if (query.length) {
      document.querySelectorAll("#bookmark,#collect").forEach((ele) => {
        ele.style.display = "none"
      })
      chrome.bookmarks.search(query, async (data) => {
        await renderer.initSearchResult(data)
        document.querySelector("#search-result").addEventListener('click',bookmarkEventDelegation)
      })
    } else {
      document.querySelectorAll("#bookmark,#collect").forEach((ele) => {
        ele.style.display = "block"
      })
      document.querySelector("#search-result").style.display = "none"
    }
  }
}
