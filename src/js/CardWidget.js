import { cursors } from "./cursors";
import DraggingCoordinates from "./DraggingCoordinates";
import Point from "./Point";

export default class CardWidget {
  constructor(trelloWidget, ownerElement, data) {
    this.trelloWidget = trelloWidget;
    this.ownerElement = ownerElement;
    this.element = this.createElement(ownerElement, data);
    this.data = data;
    this.draggingFlag = false;
    this.draggingCoordinates = null;
    this.addListeners();
  }

  createElement(ownerElement, data) {
    const element = document.createElement("div");
    element.classList.add("card");
    element.innerHTML = `
      <span>${data.text}</span>
      <div class="card-toolbar">
        <a href="#" class="card-edit">🖹</a>        
      </div>
      <a href="#" class="card-remove display-none">&#215;</a>`;
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
    this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.element.addEventListener("mouseover", this.onMouseOver.bind(this));
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.element.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.element.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.getCardRemoveButtonElement().addEventListener("click", this.onClickRemoveButton.bind(this));
  }

  onMouseDown(event) {
    this.draggingFlag = true;
    this.hideRemoveButton();
  }

  onMouseOver(event) {
    this.element.style.cursor = cursors.pointer;
    this.showRemoveButton();
  }

  onMouseMove(event) {
    if (this.draggingFlag) {
      this.hideRemoveButton();
      this.startDragging(event);
    }
  }

  onMouseUp(event) {
    this.draggingFlag = false;
    this.stopDragging(event);
  }

  onMouseOut(event) {
    this.element.style.cursor = "";
    this.hideRemoveButton();
  }

  onClickRemoveButton(event) {
    event.preventDefault();
    this.remove();
  }

  startDragging(mouseEvent) {
    this.updateDraggingCoordinates(mouseEvent);
    if (!this.element.classList.contains("dragging")) {
      this.element.classList.add("dragging");
    }
    this.updateDraggingPosition();
    this.trelloWidget.startDragging(this, this.draggingCoordinates);
  }

  stopDragging(mouseEvent) {
    this.updateDraggingCoordinates(mouseEvent);
    this.updateDraggingPosition();
    this.element.classList.remove("dragging");
    const draggingCoordinates = this.draggingCoordinates;
    this.draggingCoordinates = null;
    this.trelloWidget.stopDragging(this, draggingCoordinates);
  }

  updateDraggingCoordinates(event) {
    if (!this.draggingCoordinates) {
      this.draggingCoordinates = new DraggingCoordinates(
        new Point(event.x, event.y),
        this.element.getBoundingClientRect()
      );
    } else {
      this.draggingCoordinates.update(event);
    }
  }

  updateDraggingPosition() {
    this.element.style.left = this.draggingCoordinates.elementPoint.x + "px";
    this.element.style.top = this.draggingCoordinates.elementPoint.y + "px";
    this.element.style.width = this.draggingCoordinates.elementSize.x + "px";
    this.element.style.height = this.draggingCoordinates.elementSize.y + "px";
  }

  remove() {
    this.ownerElement.removeChild(this.element);
    this.trelloWidget.notifyCardRemoved(this);
  }

  getCardRemoveButtonElement() {
    return this.element.querySelector(".card-remove");
  }

  showRemoveButton() {
    const buttonElement = this.getCardRemoveButtonElement();
    if (buttonElement.classList.contains("display-none")) {
      buttonElement.classList.remove("display-none");
    }
    // Здесь у меня не получилось сделать через css, потому что
    // при position=relative у класса card вся моя система DnD на основе
    // getBoundingClientRect начинает ломаться, поэтому я вручную устанавливаю координаты позиций
    const rect = this.element.getBoundingClientRect();
    buttonElement.style.left = rect.left + rect.width - 14 + "px";
    buttonElement.style.top = rect.top + 2 + "px";
  }

  hideRemoveButton() {
    const buttonElement = this.getCardRemoveButtonElement();
    if (!buttonElement.classList.contains("display-none")) {
      buttonElement.classList.add("display-none");
    }
  }
}
