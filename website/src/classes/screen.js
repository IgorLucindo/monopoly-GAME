// Class for controlling match
class Screen {
  constructor() {
    this.el = document.getElementById("game-container");
    this.overlayEl = document.getElementById("overlay");

    const rect = this.el.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.scale = 1;
    this.pan = {x: 0, y: 0};
  }


  showOverlay() {
    this.overlayEl.classList.add("visible");
  }


  hideOverlay() {
    this.overlayEl.classList.remove("visible");
  }


  grab() {
    this.el.style.cursor = "grabbing";
  }


  ungrab() {
    this.el.style.cursor = null;
  }


  zoomIn(e) {
    this.scale = 1.5;
    const point = isTouch ? e.touches[0] : e;
    const offset = (this.scale-1) * 0.5;
    this.pan.x = this.width*offset - point.clientX*(this.scale-1);
    this.pan.y = this.height*offset - point.clientY*(this.scale-1);

    this.el.style.transition = "transform 0.4s ease";
    this.transform();
  }


  zoomMove(e) {
    const point = isTouch ? e.touches[0] : e;
    const offset = (this.scale-1) * 0.5;
    this.pan.x = this.width*offset - point.clientX*(this.scale-1);
    this.pan.y = this.height*offset - point.clientY*(this.scale-1);

    this.el.style.transition = null;
    this.transform();
  }

  
  zoomOut() {
    this.scale = 1;
    this.pan = {x: 0, y: 0};

    this.el.style.transition = null;
    this.transform();
  }


  transform() {
    // this.el.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
    this.el.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
  }
}