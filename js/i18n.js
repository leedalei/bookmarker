function initI18n() {
  let i18n = chrome.i18n
  this.i18n = {
    searchPlaceholder: i18n.getMessage('searchPlaceholder'),
  }
}