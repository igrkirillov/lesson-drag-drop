import CardWidget from "./CardWidget";
import AddingCardWidget from "./AddingCardWidget";
import CardSketchWidget from "./CardSketchWidget";

export default class TrelloWidget {
  constructor(ownerElement) {
    this.element = this.createElement(ownerElement);
    this.cardWidgets = [];
    this.addListeners();
    this.cardSketch = null;
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("columns-container");
    element.innerHTML = `
      <div class="column">
        <div class="cards">
        
        </div>
        <div class="column-toolbar">
          <a href="#" class="add-card">&#43; Add another card</a>
        </div>
      </div>
      <div class="column">
        <div class="cards">
        
        </div>
        <div class="column-toolbar">
          <a href="#" class="add-card">&#43; Add another card</a>
        </div>
      </div>
      <div class="column">
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

  loadData(data) {
    const element1 = this.getColumnElements()[0];
    for (const cardData of data) {
      this.cardWidgets.push(new CardWidget(this, element1, cardData));
    }
  }

  getColumnElements() {
    return Array.from(this.element.querySelectorAll(".column"));
  }

  addCard(cardsElement, data) {
    this.cardWidgets.push(new CardWidget(this, cardsElement, data));
  }

  processDragging(cardElement, draggingCoordinates) {
    for (const columnElement of this.getColumnElements()) {
      const rect = columnElement.getBoundingClientRect();
      const dcx = draggingCoordinates.elementPoint.x;
      if (dcx >= rect.x && dcx <= (rect.x + rect.width)) {
        if (!this.cardSketch) {
          this.cardSketch = new CardSketchWidget(this, columnElement.querySelector(".cards"), draggingCoordinates);
          break;
        } else if (!this.cardSketch.isApplicable(draggingCoordinates)) {
          this.cardSketch.remove();
          this.cardSketch = new CardSketchWidget(this, columnElement.querySelector(".cards"), draggingCoordinates);
          break;
        }
      }
    }
  }
}
