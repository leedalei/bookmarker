import { getStorageData, setStorageData } from "../js/util";
import { Render } from "./Render";
import { Confirm } from "./Confirm";
import { EditBox } from "./EditBox";

let renderer = new Render(false);
// 跳转
export function handleJump(e) {
  const url = e.target.dataset.url;
  if (url) {
    window.open(url, "_blank");
  }
}
// 折叠
export function handleCollapse(e) {
  let $curFolder = e.target.parentNode;
  let $curUl = $curFolder.querySelector("ul");
  $curUl.style.display = $curUl.style.display == "none" ? "flex" : "none";
  let $icon = e.target.querySelector(".btn-collapse");
  $icon.classList.toggle("btn-collapse--act");
}

// 删除收藏
export async function delCollect(url) {
  let res = await getStorageData("collect");
  let collect = JSON.parse(JSON.stringify(res.collect));
  collect.forEach((item, index) => {
    if (item.url === url) {
      collect.splice(index, 1);
    }
  });
  chrome.storage.sync.set({ collect });
}
// 添加收藏
export async function addCollect(data) {
  const { id, url, title, category } = data;
  let res = await getStorageData("collect");
  let collect = JSON.parse(JSON.stringify(res.collect));
  collect.push({ id, url, title, category });
  chrome.storage.sync.set({ collect });
}
// 更新收藏数据
export async function updateCollectData(value) {
  let res = await getStorageData("collect");
  let collect = JSON.parse(JSON.stringify(res.collect));
  collect.forEach((item, index) => {
    if (item.id === value.id) {
      const category = { category: item.category };
      const result = Object.assign({}, value, category);
      collect.splice(index, 1, result);
    }
  });
  setStorageData({ collect });
}
// 更新Item的DOM
export function updateItemDOM(ele, value) {
  const { title, url } = value;
  const item = ele.querySelector(".bookmark-item").dataset;
  const menuBox = ele.querySelector(".menu-box").dataset;
  const iconCollect = ele.querySelector(".icon-collect").dataset;
  item.url = menuBox.url = iconCollect.url = url;
  menuBox.title = iconCollect.title = title;
  ele.querySelector(".bookmark-item-title p").innerText = title;
  ele.querySelector(".bookmark-item-url").innerText = url;
  ele.querySelector(".bookmark-item-title img").src = `chrome://favicon/${url}`;
}
// 更新收藏的状态
export async function updateCollectStatus(isAddCollect, url) {
  let storageData = await getStorageData("collect");
  if (!isAddCollect) {
    document.querySelector(`.icon-top[data-url='${url}']`).src =
      "./img/collect2.svg";
    document.querySelector(`.icon-collect[data-url='${url}']`).src =
      "./img/collect.svg";
    document
      .querySelector(`.icon-collect[data-url='${url}']`)
      .classList.remove("icon-collect--act");
    return;
  }
  storageData.collect.forEach((obj) => {
    // 更新icon-top src
    Array.from(
      document.querySelectorAll(`.icon-top[data-url='${obj.url}']`)
    ).forEach((ele) => {
      ele.src = "./img/collected2.svg";
    });
    // 更新icon-collect class以及src
    Array.from(
      document.querySelectorAll(`.icon-collect[data-url='${obj.url}']`)
    ).forEach((ele) => {
      ele.src = "./img/collected.svg";
      ele.classList.add("icon-collect--act");
    });
  });
}

//彻底移除bookmark
export function removeBookmark(id) {
  return new Promise((resolve) => {
    chrome.bookmarks.remove(id, (res) => {
      resolve(res);
    });
  });
}

// 添加收藏
function handleCollect(e) {
  addCollect(e.target.dataset).then(() => {
    renderer.initFavorite();
    updateCollectStatus(true);
  });
  e.stopPropagation();
}
// 删除收藏
function handleDelCollect(e) {
  const { url } = e.target.dataset;
  delCollect(url).then(() => {
    renderer.initFavorite(); //重新渲染
    updateCollectStatus(false, url);
  });
  e.stopPropagation();
}

// 卡片菜单
function handleCardMenu(e) {
  e.target.parentNode.querySelector(".menu-box").classList.toggle("menu--open");
  e.stopPropagation();
}
// 卡片Li点击
function handleMenuLiClick(e) {
  const { type } = e.target.dataset;
  const option = e.target.parentNode.dataset;
  const classList = Array.from(e.currentTarget.classList);
  const ele = e.target.parentNode.parentNode.parentNode;
  switch (type) {
    case "edit":
      let editBox = new EditBox(option, type, (value) => {
        const result = Object.assign({}, value, { id: option.id });
        if (classList.includes("collect")) {
          resetItemData(result, classList);
        } else {
          updateItemDOM(ele, value);
          resetItemData(result, classList);
        }
      });
      e.target.parentNode.classList.remove("menu--open");
      editBox.show();
      break;
    case "remove":
      let confirm = new Confirm(
        { text: chrome.i18n.getMessage("cardDeleteWarning"), type: "warning" },
        () => {
          delCollect(option.url)
            .then(() => {
              return removeBookmark(option.id);
            })
            .then(() => {
              if (classList.includes("bookmark")) {
                renderer.initFavorite();
              }
              if (classList.includes("search-result")) {
                renderer.initFavorite();
                renderer.initCollect();
                renderer.initSearchResult();
              }
              if (classList.includes("collect")) {
                renderer.initCollect();
              }
              ele.remove();
            });
        }
      );
      e.target.parentNode.classList.remove("menu--open");
      confirm.show();
      break;
  }
  e.stopPropagation();
}
// 修改收藏数据
function resetItemData(value, classList) {
  updateCollectData(value).then(() => {
    if (classList.includes("collect") || classList.includes("search-result")) {
      renderer.initCollect();
    }
    renderer.initFavorite();
  });
}

export const bookmarkEventDelegation = (e) => {
  let classList = Array.from(e.target.classList);
  if (classList.includes("icon-collect")) {
    if (classList.includes("icon-collect--act")) {
      return handleDelCollect(e);
    }
    return handleCollect(e);
  }
  if (classList.includes("icon-menu")) {
    return handleCardMenu(e);
  }
  if (classList.includes("menu-li")) {
    return handleMenuLiClick(e);
  }
  if (classList.includes("del-icon")) {
    return handleDelCollect(e);
  }
  if (classList.includes("bookmark-header")) {
    return handleCollapse(e);
  }
  if (classList.includes("bookmark-item")) {
    return handleJump(e);
  }
};

export class Bookmark {
  constructor() {
    this.init();
  }
  init() {
    Array.from(document.querySelectorAll("#bookmark,#collect")).forEach(
      (ele) => {
        ele.addEventListener("click", bookmarkEventDelegation);
      }
    );
  }
}
