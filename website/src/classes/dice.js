class Dice {
  constructor() {
    this.el = document.getElementById("dice");

    this.isDragging = false;
    this.animating = false;

    this.pos = {x: 0, y: 0};
    this.vel = {x: 0, y: 0};
    this.last = {x: 0, y: 0};
    this.rot = {x: 0, y: 0};
    this.size = this.el.parentElement.offsetWidth;
    this.halfSize = this.size / 2;

    this.lastTime = 0;
    this.spinTime = 1;

    this.tiltForce = 15;

    this.baseRotations = {
      1: { x: 0, y: 0 },
      2: { x: -90, y: 0 },
      3: { x: 0, y: -90 },
      4: { x: 0, y: 90 },
      5: { x: 90, y: 0 },
      6: { x: 180, y: 0 }
    };

    this.initEvents();
  }


  initEvents() {
    this.el.addEventListener("mousedown", (e) => {
      if (match.state !== "dice") return;

      this.isDragging = true;
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
      this.lastTime = Date.now();
      this.vel = {x: 0, y: 0}

      const wrapper = this.el.parentElement;
      wrapper.style.left = `${this.pos.x - this.halfSize}px`;
      wrapper.style.top = `${this.pos.y - this.halfSize}px`;

      // Add lift effect
      wrapper.classList.add("lift");

      this.last.x = this.pos.x;
      this.last.y = this.pos.y;
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;

      const now = Date.now();
      const dt = now - this.lastTime || 1;
      this.pos.x = e.clientX
      this.pos.y = e.clientY
      this.vel.x = (this.pos.x - this.last.x) / dt;
      this.vel.y = (this.pos.y - this.last.y) / dt;

      // Center dice on cursor
      const wrapper = this.el.parentElement;
      wrapper.style.left = `${this.pos.x - this.halfSize}px`;
      wrapper.style.top = `${this.pos.y - this.halfSize}px`;

      // Add tilt based on velocity
      const { x: rx, y: ry } = this.rot;
      const tiltX = this.vel.y * this.tiltForce;
      const tiltY = this.vel.x * this.tiltForce;
      let transform = "";
      if (rx === 180 && ry === 0) {
        transform = `rotateX(${rx - tiltX}deg) rotateY(${ry - tiltY}deg)`;
      } else if (rx === -90 && ry === 0) {
        transform = `rotateX(${rx - tiltX}deg) rotateZ(${ry + tiltY}deg)`;
      } else if (rx === 90 && ry === 0) {
        transform = `rotateX(${rx - tiltX}deg) rotateZ(${ry - tiltY}deg)`;
      } else {
        transform = `rotateX(${rx - tiltX}deg) rotateY(${ry + tiltY}deg)`;
      }
      this.el.style.transform = transform;
      

      this.last.x = this.pos.x;
      this.last.y = this.pos.y;
      this.lastTime = now;
    });

    document.addEventListener("mouseup", () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const wrapper = this.el.parentElement;
      wrapper.classList.remove("lift");

      // Roll face and begin animation
      match.rollDice();
      this.rollToFace(match.diceNumber);
      this.startMotion();
    });
  }


  rollToFace(value) {
    this.rot = this.baseRotations[value];
    const spins = {
      x: Math.round(Math.max(-1, Math.min(-this.vel.y/4, 1))),
      y: Math.round(Math.max(-1, Math.min(this.vel.x/4, 1)))
    };
    const finalX = 360 * spins.x + this.rot.x;
    const finalY = 360 * spins.y + this.rot.y;

    // Apply spin
    this.el.style.transition = `transform ${this.spinTime}s ease-out`;
    this.el.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;

    // Reset rotation at the end
    setTimeout(() => {
      this.el.style.transition = "none";
      this.el.style.transform = `rotateX(${this.rot.x}deg) rotateY(${this.rot.y}deg)`;
    }, this.spinTime * 1000);

    // Bounce using the wrapper
    const bounceWrapper = this.el.parentElement;
    bounceWrapper.classList.add("bounce");
    setTimeout(() => bounceWrapper.classList.remove("bounce"), this.spinTime * 1000);
  }


  startMotion() {
    if (this.animating) return;
    this.animating = true;

    const wrapper = this.el.parentElement;
    const boardEl = document.getElementById("gameBoard");
    const boardRect = boardEl.getBoundingClientRect();
    const offset = 10;
    const minX = boardRect.left + offset;
    const maxX = boardRect.right - this.size - offset;
    const minY = boardRect.top + offset;
    const maxY = boardRect.bottom - this.size - offset;

    // Get start time
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      if (elapsed > this.spinTime * 1000) {
        this.animating = false;
        return;
      }
      // Apply friction
      const friction = 0.02;
      this.vel.x -= Math.sign(this.vel.x) * friction * Math.abs(this.vel.x);
      this.vel.y -= Math.sign(this.vel.y) * friction * Math.abs(this.vel.y);

      // Update position
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      // Clamp to board
      if (this.pos.x < minX) {
        this.pos.x = minX;
        this.vel.x *= -1;
      }
      else if (this.pos.x > maxX) {
        this.pos.x = maxX;
        this.vel.x *= -1;
      }
      if (this.pos.y < minY) {
        this.pos.y = minY;
        this.vel.y *= -1;
      }
      else if (this.pos.y > maxY) {
        this.pos.y = maxY;
        this.vel.y *= -1;
      }

      wrapper.style.left = `${this.pos.x}px`;
      wrapper.style.top = `${this.pos.y}px`;

      requestAnimationFrame(animate);
    };

    animate();
  }
}