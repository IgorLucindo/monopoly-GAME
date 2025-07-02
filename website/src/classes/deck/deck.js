export class Deck {
  constructor(deckData) {
    this.original = deckData.cards;
    this.cards = [...deckData.cards];
    this.imgSrc = `../assets/images/icons/${deckData.type}.svg`;
    this.color = deckData.color;
    this.pos = deckData.pos;

    this.index = 0;
    this.showCardDuration = 3;

    this.pileEl = null;
    this.cardEl = null;
  }


  init(variables) {
    this.getVariables(variables);
    this.pileEl = this.createPileElement();
    this.cardEl = this.createCardElement();
    
    this.shuffle();

    this.debug.showCardOnClick(this);
  }


  getVariables(variables) {
    this.debug = variables.debug;
    this.board = variables.board;
    this.match = variables.match;
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


  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  
  drawCard(player) {
    const card = this.cards[this.index];
    card.effect(player);
    this.index = (this.index + 1) % this.cards.length;

    // Show card
    setTimeout(() => {
      this.showCard(card);
    }, this.match.showCardDelay * 1000);
  }


  reset() {
    this.cards = [...this.original];
    this.index = 0;
    this.shuffle();
  }


  showCard(card) {
    const textEl = this.cardEl.querySelector('.card-front p');

    // Set content
    textEl.innerHTML = card.text;

    // Force reflow for animation
    void this.cardEl.offsetWidth;

    // Animate over center and flip
    this.cardEl.style.left = isMobile ? "50%" : `${this.board.left + this.board.width/2}px`;
    this.cardEl.style.top = isMobile ? "50%" : `${this.board.top + this.board.height/2}px`;
    this.cardEl.classList.add("visible");

    // Hide after delay
    setTimeout(() => {
      this.cardEl.style.top = this.pos.top;
      this.cardEl.style.left = this.pos.left;
      this.cardEl.classList.remove("visible");
    }, this.showCardDuration * 1000);
  }
}