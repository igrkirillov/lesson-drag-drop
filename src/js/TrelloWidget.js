import CardWidget from "./CardWidget";
import AddingCardWidget from "./AddingCardWidget";

export default class TrelloWidget {
  constructor(ownerElement) {
    this.element = this.createElement(ownerElement);
    this.cardWidgets = [];
    this.addListeners();
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
    new AddingCardWidget(this, columnElement.querySelector(".cards"));
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
    const element1 = this.element.querySelector(".column:nth-child(1)");
    const element2 = this.element.querySelector(".column:nth-child(2)");
    const element3 = this.element.querySelector(".column:nth-child(3)");
    for (const cardData of data) {
      this.cardWidgets.push(new CardWidget(this, element1, cardData));
    }
  }

  addCard(cardsElement, data) {
    this.cardWidgets.push(new CardWidget(this, cardsElement, data));
  }

  startDragging(cardWidget) {

  }
}
