import { clamp } from "../../utils/calculationUtils.js";


export class Dice {
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
    this.tiltMaxAngle = 20;
    this.maxThrowVel = 20;
    this.friction = 0.025;

    this.baseRotations = {
      1: { x: 0, y: 0 },
      2: { x: -90, y: 0 },
      3: { x: 0, y: -90 },
      4: { x: 0, y: 90 },
      5: { x: 90, y: 0 },
      6: { x: 180, y: 0 }
    };
  }


  init(variables) {
    this.getVariables(variables);
    this.maxThrowVel *= this.cfg.mobile ? 0.5 : 1;
    this.createEvents();
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
    this.board = variables.board;
    this.dices = variables.dices;
    this.match = variables.match;
    this.screen = variables.screen;
  }


  createEvents() {
    // Mouse down event
    const mousedown = (e) => {
      if (this.match.state !== "dice") return;

      this.isDragging = true;
      this.dices.draggingCount += 1;
      this.lift();
      this.updateMovement(e);
      this.screen.grab();
      this.dices.prevDraggingCount = this.dices.draggingCount;
    }

    // Mouse move event
    const mousemove = (e) => {
      if (!this.dices.draggingCount || this.isDragging) return;

      // handle touch
      if (this.cfg.touch) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const newDiceEl = target?.closest('.dice-wrapper:not(.lift)');
        if (!newDiceEl) return;
      }

      this.isDragging = true;
      this.dices.draggingCount += 1;
      this.lift();
    }

    // Create events
    if (!this.cfg.touch) {
      this.el.addEventListener("mousedown", mousedown);
      this.el.addEventListener("mousemove", mousemove);
    }
    else {
      this.el.addEventListener("touchstart", mousedown, { passive: true });
      document.addEventListener("touchmove", mousemove, { passive: true });
    }
  }


  updateMovement(e, index=0) {
    const point = this.cfg.touch ? e.touches[0] : e;

    // Update velocity and position
    this.vel.x = point.clientX - this.prevPos.x;
    this.vel.y = point.clientY - this.prevPos.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.prevPos.x = point.clientX;
    this.prevPos.y = point.clientY;

    // Adjust layout for grouped dragging
    if (this.dices.prevDraggingCount !== this.dices.draggingCount) {
      const gap = this.size * 0.7;
      const totalWidth = this.dices.draggingCount * this.size + (this.dices.draggingCount - 1) * gap;
      const offsetX = index * (this.size + gap);
      this.pos.x = point.clientX + offsetX - totalWidth / 2;
      this.pos.y = point.clientY - this.halfSize;
      this.vel.x = 0;
      this.vel.y = 0;
    }

    // Apply position to element
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
    const tiltX = clamp(this.vel.y * this.tiltForce, this.tiltMaxAngle);
    const tiltY = clamp(this.vel.x * this.tiltForce, this.tiltMaxAngle);

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
      x: Math.round(clamp(-this.vel.y/10, 1)),
      y: Math.round(clamp(this.vel.x/10, 1))
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
    const total = this.dices.draggingCount;
    const newIndex = index - Math.floor(total / 2) + (total % 2 === 0 && index >= total / 2 ? 1 : 0);
    const angleOffset = newIndex * 5 * Math.PI / 180;
    const scale = this.board.width/921;
    const velx = clamp(this.vel.x * scale, this.maxThrowVel);
    const vely = clamp(this.vel.y * scale, this.maxThrowVel);
    const cos = Math.cos(angleOffset);
    const sin = Math.sin(angleOffset);
    this.vel.x = Math.round(velx * cos - vely * sin);
    this.vel.y = Math.round(velx * sin + vely * cos);
  }


  startMotion() {
    if (this.animating) return;
    this.animating = true;

    const offset = 10;
    const minX = this.board.left + offset;
    const maxX = this.board.left + this.board.width - this.size - offset;
    const minY = this.board.top + offset;
    const maxY = this.board.top + this.board.height - this.size - offset;

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