class TileHoverTimer {
  constructor(onComplete) {
    this.duration = 1;
    this.onComplete = onComplete;

    this.timeout = null;
    this.timerElement = null;

    this.completed = false;
  }


  attachToTile(tile) {

    if (!tile || !tile.element) return;

    this.timerElement = tile.element.querySelector(".tile-timer");
    this.timerElement.classList.remove("hidden");
    this.timerElement.style.transition = `height ${this.duration}s ease-in, opacity 0.1s ease`;
    this.timerElement.style.height = "100%";

    this.timeout = setTimeout(() => {
      this.completed = true;
      this.onComplete(tile);
      this.timerElement.classList.add("hidden");
    }, this.duration * 1000);
  }


  reset() {
    clearTimeout(this.timeout);
    if (this.timerElement) {
      this.timerElement.style.transition = "none";
      this.timerElement.style.height = "0%";
    }
    this.completed = false;
    this.timerElement = null;
    this.startTime = Date.now();
  }
}
