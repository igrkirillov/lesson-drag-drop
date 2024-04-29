import Point from "./Point";

export default class DraggingCoordinates {
  constructor(cursorPoint, elementRect) {
    this.cursorPoint = cursorPoint;
    this.elementPoint = new Point(elementRect.left, elementRect.top);
    this.elementSize = new Point(elementRect.width, elementRect.height);
  }

  update(event) {
    const dx = event.x - this.cursorPoint.x;
    const dy = event.y - this.cursorPoint.y;
    this.cursorPoint.x = event.x;
    this.cursorPoint.y = event.y;
    this.elementPoint.x = this.elementPoint.x + dx;
    this.elementPoint.y = this.elementPoint.y + dy;
  }
}
