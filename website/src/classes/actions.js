export class Actions {
  constructor() {
    this.state = null;
  }


  init(variables) {
    this.getVariables(variables);
    window._takeAction = (action) => this.takeAction(action);
    window._auction = () => this.match.startAuction();
    window._bid = () => this.match.localPlayer.takeBid();
    window._mortgage = () => this.match.startMortgage();
    window._chat = (message) => this.matchsv.chat(message);
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
    this.database = variables.database;
    this.board = variables.board;
    this.deedDeck = variables.deedDeck;
    this.match = variables.match;
    this.matchsv = variables.matchsv;
  }


  showDeedOptions(tile) {
    const deedActions = this.deedDeck.cards[tile.index].querySelector(".deed-actions");
    const buyBtn = deedActions.querySelector("button");
    const player = this.match.players[this.match.currentPlayerIndex];

    if (player.money < tile.price) buyBtn.classList.add("disabled");

    setTimeout(() => {
      deedActions.classList.add("visible");
    }, (this.deedDeck.animationTime+0.1) * 1000)
  }


  hideDeedOptions(tile) {
    const deedActions = this.deedDeck.cards[tile.index].querySelector(".deed-actions");
    const buyBtn = deedActions.querySelector("button");

    deedActions.classList.remove("visible");
    buyBtn.classList.remove("disabled");
  }


  showAuctionOptions() {
    const player = this.match.players[this.match.currentPlayerIndex];
    const tile = this.board.tiles[player.position];
    const deedActions = this.deedDeck.cards[tile.index].querySelector(".deed-actions");

    deedActions.innerHTML = `
      <input type="number" name="quantity" value="${this.match.smallBlind}">
      <button onclick="_bid()">Bid</button>
    `;
  }


  hideAuctionOptions() {
    const player = this.match.players[this.match.currentPlayerIndex];
    const tile = this.board.tiles[player.position];
    const deedActions = this.deedDeck.cards[tile.index].querySelector(".deed-actions");
    
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
      const tile = this.board.getTileFromElement(tileEl);

      this.match.handleMortgage(tile);
      this.match.endMortgage(click);
    };

    // Create event
    if (!this.cfg.touch) document.addEventListener("mousedown", click);
    else document.addEventListener("touchstart", click);
  }


  removeMortgageEvent(click) {
    this.state = null;

    // Remove event
    if (!this.cfg.touch) document.removeEventListener("mousedown", click);
    else document.removeEventListener("touchstart", click);
  }


  takeAction(action) {
    this.match.takeAction(action);

    const roomName = this.match.gameData.roomName;
    const serverData = {
      action: {value: action, turn: this.match.turn},
      player: this.match.localPlayer.name
    };
    this.database.setField("rooms", roomName, serverData);
  }
}