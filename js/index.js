import { Render } from "../components/Render";
import { SearchBar } from "../components/SearchBar";
import { Setting } from "../components/Setting";
import { LanguageController } from "../components/LanguageController";
import { GlobalListener } from "../components/GlobalListener";
import { ThemeMode } from "../components/ThemeMode";
import { Bookmark } from "../components/Bookmark";
async function main() {
  new Render(true);
  new Bookmark();
  new GlobalListener(); //然后注册所有的事件监听器
  new SearchBar();
  new Setting();
  new ThemeMode();
  new LanguageController();
}
main();
