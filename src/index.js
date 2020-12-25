import { Render } from "./assets/components/Render";
import { SearchBar } from "./assets/components/SearchBar";
import { Setting } from "./assets/components/Setting";
import { LanguageController } from "./assets/components/LanguageController";
import { GlobalListener } from "./assets/components/GlobalListener";
import { ThemeMode } from "./assets/components/ThemeMode";
import { Bookmark } from "./assets/components/Bookmark";
(function () {
  new Render(true);
  new Bookmark();
  new GlobalListener(); //然后注册所有的事件监听器
  new SearchBar();
  new Setting();
  new ThemeMode();
  new LanguageController();
})();
