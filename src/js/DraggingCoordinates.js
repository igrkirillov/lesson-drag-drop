import Point from "./Point";

export default class DraggingCoordinates {
  constructor(cursorPoint, elementRect) {
    this.cursorPoint = cursorPoint;
    this.elementPoint = new Point(elementRect.left, elementRect.top);
    this.elementSize = new Point(elementRect.width, elementRect.height);
  }

  update(mouseEvent) {
    const dx = mouseEvent.x - this.cursorPoint.x;
    const dy = mouseEvent.y - this.cursorPoint.y;
    this.cursorPoint.x = mouseEvent.x;
    this.cursorPoint.y = mouseEvent.y;
    this.elementPoint.x = this.elementPoint.x + dx;
    this.elementPoint.y = this.elementPoint.y + dy;
  }

  get elementMiddleY() {
    return this.elementPoint.y + this.elementSize.y / 2;
  }
}
