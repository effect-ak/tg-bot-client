import { TgWebApp } from "#/index";

interface Telegram {
  WebApp: TgWebApp
}

declare const Telegram: Telegram;

const saveData = () => {

  Telegram.WebApp.CloudStorage.setItem("key1", "some data", (error) => {
    if (error == null) {
      console.log("Saved!")
    }
  })

}

const exit = () => {
  Telegram.WebApp.close();
}