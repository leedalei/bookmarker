function initI18n() {
  let i18n = chrome.i18n
  this.i18n = {
    searchPlaceholder: i18n.getMessage('searchPlaceholder'),
    noStickyData: i18n.getMessage('noStickyData'),
    noData: i18n.getMessage('noData'),
    noSearchResult: i18n.getMessage('noSearchResult'),
    stickyFolderName: i18n.getMessage('stickyFolderName'),
    settingOpenFolder: i18n.getMessage('settingOpenFolder'),
    settingBlockCSDN: i18n.getMessage('settingBlockCSDN'),
    settingEngine: i18n.getMessage('settingEngine'),
    settingLanguage: i18n.getMessage('settingLanguage'),
    cardEdit: i18n.getMessage('cardEdit'),
    cardDelete: i18n.getMessage('cardDelete')
  }
}