class ActionOptions {
  constructor() {
    this.deedOptionsEl = this.createdeedOptions();
  }


  createdeedOptions() {
    const el = document.createElement("div");
    el.className = "action-options";

    el.innerHTML = `
      <button onclick="_takeAction(1)">Buy</button>
      <button onclick="_takeAction(2)">Auction</button>
    `;

     return el;
  }


  showDeedOptions(tile) {
    deedDeck.cards[tile.index].appendChild(this.deedOptionsEl);
    setTimeout(() => {
      this.deedOptionsEl.classList.add("visible");
    },( deedDeck.animationTime+0.1) * 1000)
  }


  hideDeedOptions(tile) {
    deedDeck.cards[tile.index].removeChild(this.deedOptionsEl);
    this.deedOptionsEl.classList.remove("visible");
  }
}