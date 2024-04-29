import {cursors} from "./cursors";
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
      </div>`;
    ownerElement.appendChild(element);
    return element;
  }

  addListeners() {
    this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.element.addEventListener("mouseover", this.onMouseOver.bind(this));
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.element.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.element.addEventListener("mouseout", this.onMouseOut.bind(this));
  }

  onMouseDown(event) {
    this.draggingFlag = true;
  }

  onMouseOver(event) {
    this.element.style.cursor = cursors.pointer;
  }

  onMouseMove(event) {
    if (this.draggingFlag) {
      this.startDragging(event);
    }
  }

  onMouseUp(event) {
    this.draggingFlag = false;
  }

  onMouseOut(event) {
    this.element.style.cursor = "";
  }

  startDragging(event) {
    this.updateDraggingCoordinates(event);
    if (!this.element.classList.contains("dragging")) {
      this.element.classList.add("dragging");
    }
    this.updateDraggingPosition();
  }

  updateDraggingCoordinates(event) {
    if (!this.draggingCoordinates) {
      this.draggingCoordinates = new DraggingCoordinates(new Point(event.x, event.y), this.element.getBoundingClientRect());
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
}
