import TrelloWidget from "./TrelloWidget";

document.addEventListener("DOMContentLoaded", () => {
  const mainElement = document.querySelector("main");
  new TrelloWidget(mainElement);
});
