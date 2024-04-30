import CardWidget from "./CardWidget";
import AddingCardWidget from "./AddingCardWidget";
import CardSketchWidget from "./CardSketchWidget";
import {getFromLocalStorage, saveToLocalStorage} from "./storageUtils";

export default class TrelloWidget {
  constructor(ownerElement) {
    this.element = this.createElement(ownerElement);
    this.cards = [];
    this.addListeners();
    this.cardSketch = null;
    this.loadData(getFromLocalStorage());
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("columns-container");
    element.innerHTML = `
      <div class="column" data-num="1">
        <div class="cards">
        
        </div>
        <div class="column-toolbar">
          <a href="#" class="add-card">&#43; Add another card</a>
        </div>
      </div>
      <div class="column" data-num="2">
        <div class="cards">
        
        </div>
        <div class="column-toolbar">
          <a href="#" class="add-card">&#43; Add another card</a>
        </div>
      </div>
      <div class="column" data-num="3">
        <div class="cards">
        
        </div>
        <div class="column-toolbar">
          <a href="#" class="add-card">&#43; Add another card</a>
        </div>
      </div>
      `;
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
    for (const columnElement of this.element.querySelectorAll(".column")) {
      const addingCardLink = columnElement.querySelector(".add-card");
      addingCardLink.addEventListener("click", this.onClickAddCard.bind(this));
    }
  }

  onClickAddCard(event) {
    event.preventDefault();
    const columnElement = event.target.closest(".column");
    const addWidget = new AddingCardWidget(this, columnElement.querySelector(".cards"));
    addWidget.setFocus();
    this.hideColumnToolbar(columnElement);
  }

  hideColumnToolbar(cardsElement) {
    cardsElement
      .closest(".column")
      .querySelector(".column-toolbar").classList.add("display-none");
  }

  showColumnToolbar(cardsElement) {
    cardsElement
      .closest(".column")
      .querySelector(".column-toolbar").classList.remove("display-none")
  }

  loadData(cardDtoArray) {
    for (const cardDto of cardDtoArray) {
      this.addCard(cardDto.column, cardDto.data, false);
    }
  }

  getColumnElements() {
    return Array.from(this.element.querySelectorAll(".column"));
  }

  addCard(columnNum, data, notify) {
    const cardsElement = this.getColumnElements()[columnNum - 1].querySelector(".cards");
    const card = new CardWidget(this, cardsElement, data);
    this.cards.push(card);
    if (notify) {
      this.notifyCardAdded();
    }
    return card;
  }

  startDragging(cardElement, draggingCoordinates) {
    for (const columnElement of this.getColumnElements()) {
      const cardsElement = columnElement.querySelector(".cards");
      const rect = columnElement.getBoundingClientRect();
      const dcx = draggingCoordinates.elementPoint.x;
      if (dcx >= rect.x && dcx <= (rect.x + rect.width)) {
        if (!this.cardSketch) {
          this.cardSketch = new CardSketchWidget(this, cardsElement, draggingCoordinates);
          break;
        } else if (!this.cardSketch.isApplicable(cardsElement, draggingCoordinates)) {
          this.cardSketch.remove();
          this.cardSketch = new CardSketchWidget(this, cardsElement, draggingCoordinates);
          break;
        }
      }
    }
  }

  stopDragging(card, draggingCoordinates) {
    if (this.cardSketch) {
      card.remove();
      const columnNum = this.cardSketch.ownerElement.closest(".column").dataset["num"];
      const newCard = this.addCard(columnNum, card.data, true);
      this.cardSketch.element.replaceWith(newCard.element);
      this.cardSketch = null;
    }
  }

  notifyCardRemoved(card) {
    const index = this.cards.indexOf(card);
    if (index >= 0) {
      this.cards.splice(index, 1);
    }
    saveToLocalStorage(this.cards);
  }

  notifyCardAdded() {
    saveToLocalStorage(this.cards);
  }
}
