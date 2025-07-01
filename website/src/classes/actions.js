class Actions {
  constructor() {
    // Button click triggers turn control
    window._takeAction = (action) => match.takeAction(action);
    window._auction = () => this.showAuctionOptions();
    window._bid = () => match.players[match.currentPlayerIndex].takeBid();
  }


  showDeedOptions(tile) {
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    const buyBtn = deedActions.querySelector("button");
    const player = match.players[match.currentPlayerIndex];

    if (player.money < tile.price) buyBtn.classList.add("disabled");

    setTimeout(() => {
      deedActions.classList.add("visible");
    }, (deedDeck.animationTime+0.1) * 1000)
  }


  hideDeedOptions(tile) {
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    const buyBtn = deedActions.querySelector("button");

    deedActions.classList.remove("visible");
    buyBtn.classList.remove("disabled");
  }


  showAuctionOptions() {
    const player = match.players[match.currentPlayerIndex];
    const tile = board.tiles[player.position];
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");

    deedActions.innerHTML = `
      <input type="number" name="quantity">
      <button onclick="_bid()">Bid</button>
    `
  }


  hideAuctionOptions(tile) {
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    
    deedActions.innerHTML = `
      <button onclick="_takeAction(1)">Buy</button>
      <button onclick="_auction()">Auction</button>
    `
  }
}