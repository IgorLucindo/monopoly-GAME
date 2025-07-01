class Timer {
  constructor(effect, duration) {
    this.effect = effect;
    this.duration = duration;

    this.startTime = 0;
    this.elapsed = 0;

    this.interval = null;
  }


  start() {
    this.startTime = Date.now();

    this.interval = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;

      const remaining = this.duration - this.elapsed;
      const remainingRounded = Math.ceil(remaining/100) / 10;
      sidebar.updateTimer(remainingRounded);
      
      if (this.elapsed >= this.duration) {
        this.effect();
        this.reset();
      }
    }, 100);
  }


  reset() {
    clearInterval(this.interval);
    this.elapsed = 0;
    this.startTime = 0;
  }


  restart() {
    this.reset();
    this.start();
  }
}