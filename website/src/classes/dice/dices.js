class Dices {
  constructor(n) {
    this.list = [];
    this.draggingCount = 0;
    this.prevDraggingCount = 0;
    this.pos = {x: 0, y: 0};

    this.createDices(n);
    this.setInitialPos();
    this.initEvents();
  }


  createDices(n) {
    for (let i = 0; i < n; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = "dice-wrapper";
      wrapper.innerHTML = `<div class="dice-3d"><div class="face one"><span class="dot center"></span></div><div class="face two"><span class="dot top-left"></span><span class="dot bottom-right"></span></div><div class="face three"><span class="dot top-left"></span><span class="dot center"></span><span class="dot bottom-right"></span></div><div class="face four"><span class="dot top-left"></span><span class="dot top-right"></span><span class="dot bottom-left"></span><span class="dot bottom-right"></span></div><div class="face five"><span class="dot top-left"></span><span class="dot top-right"></span><span class="dot center"></span><span class="dot bottom-left"></span><span class="dot bottom-right"></span></div><div class="face six"><span class="dot top-left"></span><span class="dot top-right"></span><span class="dot mid-left"></span><span class="dot mid-right"></span><span class="dot bottom-left"></span><span class="dot bottom-right"></span></div></div>`;
      document.body.appendChild(wrapper);
      this.list.push(new Dice(wrapper));
    }
  }


  setInitialPos() {
    const offsetX = board.left + board.width*0.4;
    const offsetY = board.top + board.height*0.4;
    const gap = this.list[0].size / 2;
    this.list.forEach((dice, index) => {
      dice.wrapper.style.left = `${offsetX + index*(dice.size + gap)}px`;
      dice.wrapper.style.top = `${offsetY}px`;
    });
  }


  initEvents() {
    // Mouse move event
    const mousemove = (e) => {
      if (!this.draggingCount) return;
      
      let index = 0;
      this.list.forEach((dice) => {
        if (!dice.isDragging) return;

        dice.updateMovement(e, index);
        dice.tilt();
        index += 1;
      });
      this.prevDraggingCount = this.draggingCount;
    }

    // Mouse up event
    const mouseup = () => {
      if (!this.draggingCount) return;
      ungrab();

      let index = 0;
      const numbers = [];
      this.list.forEach((dice) => {
        if (!dice.isDragging) return;
        dice.isDragging = false;
        
        dice.unlift();

        // Roll face and begin animation
        dice.roll();
        numbers.push(dice.number);
        dice.rollToFace();
        dice.bounce();
        dice.twistVel(index);
        dice.startMotion();
        index += 1;
      });

      if (this.draggingCount === this.list.length) match.playDiceTurn(numbers);
      this.draggingCount = 0;
      this.prevDraggingCount = this.draggingCount;
    }


    // Create events
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("touchmove", mousemove, { passive: false });
    document.addEventListener("touchend", mouseup);
  }
}