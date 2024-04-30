import CardWidget from "./CardWidget";

export default class AddingCardWidget {
  constructor(trelloWidget, ownerElement) {
    this.element = this.createElement(ownerElement);
    this.trelloWidget = trelloWidget;
    this.ownerElement = ownerElement;
    this.addListeners();
  }

  createElement(ownerElement) {
    const element = document.createElement("div");
    element.classList.add("card");
    element.innerHTML = `
      <textarea class="adding-card-area"></textarea>
      <div class="adding-card-toolbar">
        <input type="button" class="card-add-button" value="Add card"/>
        <a href="#" class="card-cancel-button">&#215;</a>
      </div>`;
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
    const addButtonElement = this.element.querySelector(".card-add-button")
    addButtonElement.addEventListener("click", this.onClickAddButton.bind(this));

    const cancelButtonElement = this.element.querySelector(".card-cancel-button")
    cancelButtonElement.addEventListener("click", this.onClickCancelButton.bind(this));
  }

  onClickAddButton(event) {
    const textAreaElement = event.target.closest(".card").querySelector(".adding-card-area");
    const data = {
      text: textAreaElement.value,
    }
    const columnNum = this.ownerElement.closest(".column").dataset["num"];
    this.trelloWidget.addCard(columnNum, data, true);
    this.close();
  }

  onClickCancelButton(event) {
    this.close();
  }

  close() {
    this.trelloWidget.showColumnToolbar(this.ownerElement);
    this.ownerElement.removeChild(this.element)
  }

  setFocus() {
    this.element.querySelector(".adding-card-area").select();
  }
}
