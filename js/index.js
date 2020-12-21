import { Render } from "./Render";
import { SearchBar } from "./SearchBar";
import { getModeData } from "./function";
import { Setting } from "./Setting";
import { initI18n } from "./i18n";
import { initAllListener } from "./event";

async function main() {
  getModeData();
  new Render(true);
  initAllListener(); //然后注册所有的事件监听器
  new SearchBar();
  new Setting();
  initI18n(); 
}

main();
