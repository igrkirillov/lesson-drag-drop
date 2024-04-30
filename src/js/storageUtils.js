import {deserializeFromJsonText, serializeToJsonText} from "./serializeUtils";

export function saveToLocalStorage(cards) {
  if (cards) {
    window.localStorage.setItem("cards", serializeToJsonText(cards));
  }
}

export function getFromLocalStorage() {
  const jsonText = window.localStorage.getItem("cards");
  return jsonText ? deserializeFromJsonText(jsonText) : [];
}
