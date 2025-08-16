export class Debug {
  constructor(active) {
    this.active = active;
  }


  init(variables) {
    this.getVariables(variables);
  }


  getVariables(variables) {
    this.board = variables.board;
    this.dices = variables.dices;
    this.match = variables.match;
  }


  play(numbers) {
    if (!this.active) return;

    setTimeout(() => {
      this.match.playDiceTurn(numbers);
    }, this.dices.spinTime * 1000);
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