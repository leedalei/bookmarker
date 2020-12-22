import { Render } from "../components/Render"
import { SearchBar } from "../components/SearchBar"
import { Setting } from "../components/Setting"
import { LanguageController } from "../components/LanguageController"
import { initAllListener } from "./event"
import { ThemeMode } from "../components/ThemeMode"
async function main() {
  new Render(true)
  initAllListener() //然后注册所有的事件监听器
  new SearchBar()
  new Setting()
  new ThemeMode()
  new LanguageController()
}

main()
