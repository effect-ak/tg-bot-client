import type { WebApp } from "#dist/webapp";

interface Telegram {
  WebApp: WebApp
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