class Debug {
  constructor(active) {
    this.active = active;
  }


  showCardOnClick(deck) {
    if (!this.active) return;
    
    deck.pileEl.onclick = () => {deck.showCard(deck.cards[deck.index]);}
  }


  setMonopoly(player, color) {
    if (!this.active) return;

    board.groups[color].forEach(t => t.owner = player);
  }
}