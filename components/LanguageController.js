export class LanguageController {
  constructor(){
    let i18n = chrome.i18n
    this.languageObj = {
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
      cardDelete: i18n.getMessage('cardDelete'),
      editBoxTitle:i18n.getMessage('editBoxTitle'),
      editBoxLink:i18n.getMessage('editBoxLink'),
      editBoxCancel:i18n.getMessage('editBoxCancel'),
      editBoxConfirm:i18n.getMessage('editBoxConfirm')
    }
    this.init()
  }
  init(){
    document.querySelector("#search-input").setAttribute("placeholder",this.languageObj.searchPlaceholder)
    for(let key in this.languageObj){
      this.matchLanguageText(key, this.languageObj[key])
    }
  }
  //匹配需要多语言的文本
  matchLanguageText(key,value){
    let ele = document.querySelector(`*[data-lang-text='${key}']`)
    if(ele){
      ele.innerText = value
    }
  }
}