export class Debug {
  constructor(active) {
    this.active = active;
  }


  init(variables) {
    this.getVariables(variables);
  }


  getVariables(variables) {
    this.board = variables.board;
  }


  showCardOnClick(deck) {
    if (!this.active) return;
    
    deck.pileEl.onclick = () => {deck.showCard(deck.cards[deck.index]);}
  }


  setMonopoly(player, color) {
    if (!this.active) return;

    this.board.groups[color].forEach(t => t.owner = player);
  }
}