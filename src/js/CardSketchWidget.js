import { cursors } from "./cursors";
import DraggingCoordinates from "./DraggingCoordinates";
import Point from "./Point";

export default class CardSketchWidget {
  constructor(trelloWidget, ownerElement, draggingCoordinates) {
    this.trelloWidget = trelloWidget;
    this.ownerElement = ownerElement;
    this.element = this.createElement(ownerElement, draggingCoordinates);
  }

  createElement(ownerElement, draggingCoordinates) {
    const element = document.createElement("div");
    element.classList.add("card", "sketch");
    this.calcPositionAndAddElement(element, ownerElement, draggingCoordinates);
    element.style.height = draggingCoordinates.elementSize.y + "px";
    return element;
  }

  calcPositionAndAddElement(element, ownerElement, draggingCoordinates) {
    let isInserted = false;
    const cardsArray = Array.from(
      ownerElement.querySelectorAll(".card")
    ).filter((el) => !el.classList.contains("dragging"));
    for (const cardElement of cardsArray) {
      const rect = cardElement.getBoundingClientRect();
      const middleY = rect.top + rect.height / 2;
      if (draggingCoordinates.elementMiddleY <= middleY) {
        ownerElement.insertBefore(element, cardElement);
        isInserted = true;
        break;
      }
    }
    if (!isInserted) {
      ownerElement.appendChild(element);
    }
  }

  isApplicable(ownerElement, draggingCoordinates) {
    if (ownerElement !== this.ownerElement) {
      return false;
    }
    const cardsArray = Array.from(
      this.ownerElement.querySelectorAll(".card")
    ).filter((el) => !el.classList.contains("dragging"));
    const index = cardsArray.findIndex((el) => el === this.element);
    const prevCard = index > 0 ? cardsArray[index - 1] : null;
    const nextCard =
      index < cardsArray.length - 1 && index >= 0
        ? cardsArray[index + 1]
        : null;
    const y0 = prevCard ? this.calcMiddleYOfElement(prevCard) : 0;
    const y1 = nextCard
      ? this.calcMiddleYOfElement(nextCard)
      : document.body.getBoundingClientRect().bottom;
    return !!(
      draggingCoordinates.elementMiddleY >= y0 &&
      draggingCoordinates.elementMiddleY <= y1
    );
  }

  calcMiddleYOfElement(element) {
    const rect = element ? element.getBoundingClientRect() : null;
    return rect ? rect.y + rect.height / 2 : 0;
  }

  remove() {
    this.ownerElement.removeChild(this.element);
  }
}
