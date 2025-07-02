class Actions {
  constructor() {
    this.state = null;

    // Button click triggers turn control
    window._takeAction = (action) => match.takeAction(action);
    window._auction = () => match.startAuction();
    window._bid = () => localPlayer.takeBid();
    window._mortgage = () => match.startMortgage();
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
      <input type="number" name="quantity" value="${match.smallBlind}">
      <button onclick="_bid()">Bid</button>
    `;
  }


  hideAuctionOptions() {
    const player = match.players[match.currentPlayerIndex];
    const tile = board.tiles[player.position];
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    
    deedActions.innerHTML = `
      <button onclick="_takeAction(1)">Buy</button>
      <button onclick="_auction()">Auction</button>
    `;
  }


  createMortgageEvent() {
    this.state = "mortgage";
    
    // Click event
    const click = (e) => {
      const tileEl = e.target.closest(".tile");
      const tile = board.getTileFromElement(tileEl);

      match.handleMortgage(tile);
      match.endMortgage(click);
    };

    // Create event
    if (!isTouch) document.addEventListener("mousedown", click);
    else document.addEventListener("touchstart", click);
  }


  removeMortgageEvent(click) {
    this.state = null;

    // Remove event
    if (!isTouch) document.removeEventListener("mousedown", click);
    else document.removeEventListener("touchstart", click);
  }
}