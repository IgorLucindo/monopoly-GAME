export class Screen {
  constructor() {
    this.el = document.getElementById("game-container");
    this.overlayEl = document.getElementById("overlay");

    const rect = this.el.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.scale = 1;
    this.pan = {x: 0, y: 0};
  }


  init(variables) {
    this.getVariables(variables);
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
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
    const point = this.cfg.touch ? e.touches[0] : e;
    const offset = (this.scale-1) * 0.5;
    this.pan.x = (this.width- point.clientX*2) * offset;
    this.pan.y = (this.height- point.clientY*2) * offset;

    this.el.style.transition = "transform 0.3s ease";
    this.transform();
  }


  zoomMove(e) {
    const point = this.cfg.touch ? e.touches[0] : e;
    const offset = (this.scale-1) * 0.5;
    this.pan.x = (this.width- point.clientX*2) * offset;
    this.pan.y = (this.height- point.clientY*2) * offset;

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