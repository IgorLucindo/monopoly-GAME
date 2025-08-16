export class Deck {
  constructor(deckData) {
    this.type = deckData.type;
    this.cards = [...deckData.cards];
    this.color = deckData.color;
    this.pos = deckData.pos;
    this.imgSrc = `../assets/images/icons/${this.type}.svg`;

    this.index = 0;
    this.showCardDuration = 3;

    this.pileEl = null;
    this.cardEl = null;
  }


  init(variables) {
    this.getVariables(variables);
    this.pileEl = this.createPileElement();
    this.cardEl = this.createCardElement();
    
    this.handleShuffle();

    this.debug.showCardOnClick(this);
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
    this.database = variables.database;
    this.debug = variables.debug;
    this.board = variables.board;
    this.match = variables.match;
    this.sounds = variables.sounds;
  }


  createPileElement() {
    const el = document.createElement("div");
    el.classList.add("card-pile");
    el.style.background = this.color;
    el.innerHTML = `<img src="${this.imgSrc}">`;

    // Set position
    el.style.top = this.pos.top;
    el.style.left = this.pos.left;
    
    // Append to board
    this.board.el.appendChild(el);

    return el;
  }


  createCardElement() {
    const el = document.createElement("div");
    el.classList.add("card-wrapper");
    el.innerHTML = `
      <div class="card-3d">
        <div class="card-back" style="background-color: ${this.color}">
          <img src="${this.imgSrc}">
        </div>
        <div class="card-front">
          <p>Card text goes here</p>
        </div>
      </div>
    `
    
    // Set position
    el.style.top = this.pos.top;
    el.style.left = this.pos.left;

    // Append to deck
    this.board.el.appendChild(el);

    return el;
  }


  async handleShuffle() {
    const roomName = this.match.gameData.roomName;
    let cardsIdxs = [];

    // Setting shuffle
    if (this.match.localPlayer.isCreator) {
      // If creator
      cardsIdxs = Array.from({ length: this.cards.length }, (_, i) => i);

      for (let i = cardsIdxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [cardsIdxs[i], cardsIdxs[j]] = [cardsIdxs[j], cardsIdxs[i]];
      };
      
      this.database.setField("rooms", roomName, {[this.type]: cardsIdxs});
    }
    else {
      // If not creator
      const docData = await this.database.getDocument("rooms", roomName);
      cardsIdxs = docData[this.type];
    }

    // Shuflle
    this.shuffle(cardsIdxs);
  }


  shuffle(cardsIdxs) {
    let shuffledCards = [];
    cardsIdxs.forEach((i) => {
      shuffledCards.push(this.cards[i]);
    });
    this.cards = shuffledCards;
  }

  
  drawCard(player) {
    const card = this.cards[this.index];

    // Play card
    card.effect(player);
    this.index = (this.index + 1) % this.cards.length;

    // Show card
    setTimeout(() => {
      this.showCard(card);
    }, this.match.showCardDelay * 1000);
  }


  showCard(card) {
    const textEl = this.cardEl.querySelector('.card-front p');

    // Set content
    textEl.innerHTML = card.text;

    // Force reflow for animation
    void this.cardEl.offsetWidth;

    // Animate over center and flip
    this.cardEl.style.left = this.cfg.mobile ? "50%" : `${this.board.left + this.board.width/2}px`;
    this.cardEl.style.top = this.cfg.mobile ? "50%" : `${this.board.top + this.board.height/2}px`;
    this.cardEl.classList.add("visible");
    this.sounds.play("flip_card");

    // Hide after delay
    setTimeout(() => {
      this.cardEl.style.top = this.pos.top;
      this.cardEl.style.left = this.pos.left;
      this.cardEl.classList.remove("visible");
      this.sounds.play("flip_card");
    }, this.showCardDuration * 1000);
  }
}