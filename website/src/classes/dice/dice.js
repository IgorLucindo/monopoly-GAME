class Dice {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.el = this.wrapper.firstElementChild;

    this.isDragging = false;
    this.animating = false;
    this.number = 0;
    this.pos = {x: 0, y: 0};
    this.prevPos = {x: 0, y: 0};
    this.vel = {x: 0, y: 0};
    this.rot = {x: 0, y: 0};
    this.size = this.wrapper.offsetWidth;
    this.halfSize = this.size / 2;
    this.spinTime = 1;
    this.tiltTime = 1;
    this.tiltForce = 15;
    this.friction = 0.025;

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
      dices.draggingCount += 1;
      this.lift();
      this.updatePos(e);
      grab();
      dices.prevDraggingCount = dices.draggingCount;
    });

    this.el.addEventListener("mousemove", () => {
      if (!dices.draggingCount || this.isDragging) return;

      this.isDragging = true;
      dices.draggingCount += 1;
      this.lift();
    });
  }


  updatePos(e, index=0) {
    this.vel.x = e.clientX - this.prevPos.x;
    this.vel.y = e.clientY - this.prevPos.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.prevPos.x = e.clientX;
    this.prevPos.y = e.clientY;

    this.updateMovement(e, index);
  }


  updateMovement(e, index) {
    if (dices.prevDraggingCount !== dices.draggingCount) {
      const gap = 35;
      const totalWidth = dices.draggingCount * this.size + (dices.draggingCount - 1) * gap;
      const offsetX = index * (this.size + gap);
      this.pos.x = e.clientX + offsetX - totalWidth/2;
      this.pos.y = e.clientY - this.halfSize;
      this.vel.x = 0;
      this.vel.y = 0;
    }

    this.wrapper.style.left = `${this.pos.x}px`;
    this.wrapper.style.top = `${this.pos.y}px`;
  }


  roll() {
    this.number = Math.floor(Math.random() * 6) + 1;
  }


  lift() {
    this.wrapper.classList.add("lift");
  }

  
  unlift() {
    this.wrapper.classList.remove("lift");
  }


  tilt() {
    const { x: rx, y: ry } = this.rot;
    const tiltX = this.vel.y * this.tiltForce;
    const tiltY = this.vel.x * this.tiltForce;

    let transform = "";
    if (rx === 180 && ry === 0) transform = `rotateX(${rx - tiltX}deg) rotateY(${ry - tiltY}deg)`;
    else if (rx === -90 && ry === 0) transform = `rotateX(${rx - tiltX}deg) rotateZ(${ry + tiltY}deg)`;
    else if (rx === 90 && ry === 0) transform = `rotateX(${rx - tiltX}deg) rotateZ(${ry - tiltY}deg)`;
    else transform = `rotateX(${rx - tiltX}deg) rotateY(${ry + tiltY}deg)`;
    
    // Apply tilt immediately with no transition
    this.el.style.transition = "";
    this.el.style.transform = transform;

    void this.el.offsetWidth;

    // Untilt with transition
    this.el.style.transition = "transform 0.2s ease";
    this.el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }


  rollToFace() {
    this.rot = this.baseRotations[this.number];
    const spins = {
      x: Math.round(Math.max(-1, Math.min(-this.vel.y/10, 1))),
      y: Math.round(Math.max(-1, Math.min(this.vel.x/10, 1)))
    };
    const finalX = 360 * spins.x + this.rot.x;
    const finalY = 360 * spins.y + this.rot.y;

    // Apply spin
    this.el.style.transition = `transform ${this.spinTime}s ease-out`;
    this.el.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
  }


  bounce() {
    this.wrapper.classList.add("bounce");
    setTimeout(() => this.wrapper.classList.remove("bounce"), this.spinTime * 1000);
  }


  twistVel(index) {
    const total = dices.draggingCount;
    const newIndex = index - Math.floor(total / 2) + (total % 2 === 0 && index >= total / 2 ? 1 : 0);
    const angleOffset = newIndex * 5 * Math.PI / 180;
    const velx = this.vel.x;
    const vely = this.vel.y;
    const cos = Math.cos(angleOffset);
    const sin = Math.sin(angleOffset);
    this.vel.x = Math.round(velx * cos - vely * sin);
    this.vel.y = Math.round(velx * sin + vely * cos);
  }


  startMotion() {
    if (this.animating) return;
    this.animating = true;

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
      if (elapsed > this.spinTime * 1000 || this.isDragging) {
        this.animating = false;
        return;
      }
      // Apply friction
      this.vel.x -= Math.sign(this.vel.x) * this.friction * Math.abs(this.vel.x);
      this.vel.y -= Math.sign(this.vel.y) * this.friction * Math.abs(this.vel.y);

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

      this.wrapper.style.left = `${this.pos.x}px`;
      this.wrapper.style.top = `${this.pos.y}px`;

      requestAnimationFrame(animate);
    };

    animate();
  }
}