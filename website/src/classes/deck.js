class Deck {
  constructor(deckData) {
    this.original = deckData.cards;
    this.cards = [...deckData.cards];
    this.index = 0;
    this.label = deckData.label;
    this.color = deckData.color;
    this.pos = deckData.pos;
    this.pileElement = this.createPileElement();
    this.shuffle();
  }


  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  
  drawCard(player) {
    const card = this.cards[this.index];
    this.showCard(card);
    card.effect(player);
    this.index = (this.index + 1) % this.cards.length;
  }


  reset() {
    this.cards = [...this.original];
    this.index = 0;
    this.shuffle();
  }


  showCard(card) {
    const flyCard = document.getElementById("flyCard");
    const titleEl = document.getElementById("flyCardTitle");
    const textEl = document.getElementById("flyCardText");
    const backEl = flyCard.querySelector(".card-back");

    // Apply pile color and label to card back
    flyCard.style.setProperty("--pile-color", this.color);
    backEl.textContent = this.label;
    titleEl.textContent = card.type || this.label;
    textEl.textContent = card.text;

    const rect = this.pileElement.getBoundingClientRect();
    flyCard.style.left = `${rect.left + rect.width / 2}px`;
    flyCard.style.top = `${rect.top + rect.height / 2}px`;
    flyCard.style.width = `${rect.width}px`;
    flyCard.style.height = `${rect.height}px`;
    flyCard.classList.remove("hidden", "flipping");

    void flyCard.offsetWidth;

    // Move to center and flip
    setTimeout(() => {
      flyCard.style.left = "50%";
      flyCard.style.top = "50%";
      flyCard.classList.add("flipping");
    }, 50);

    // Hide after delay
    setTimeout(() => {flyCard.classList.add("hidden");}, 3000);
  }


  createPileElement() {
    const pile = document.createElement("div");
    pile.classList.add("card-pile");
    pile.style.setProperty("--pile-color", this.color);
    pile.textContent = this.label;

    // Use absolute positioning instead of grid
    pile.style.top = this.pos.top;
    pile.style.left = this.pos.left;
    
    // DEGUB
    if (DEBUG) pile.onclick = () => {this.drawCard(match.players[match.currentPlayerIndex]);};

    return pile;
  }
}