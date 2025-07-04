export class Player {
  constructor(name) {
    this.name = name;
    this._position = 0;
    this.prevPosition = 0;
    this._money = 1500;
    this.prevMoney = this.money;
    this.turnsArrested = 0;
    this.exitJailCard = false;
    this.properties = [];
    this.token = null;
    this.isCreator = false;
  }


  // Defining setter and getter
  set money(value) {
    this._money = value;
    this.sidebar.update(this);
    this.prevMoney = value;
  }
  get money() {
    return this._money;
  }
  set position(value) {
    this._position = value;
    this.renderPosition();
  }
  get position() {
    return this._position;
  }


  init(variables, index) {
    this.getVariables(variables);
    this.createToken();
    this.renderPosition();
    if (index === 0) this.isCreator = true;
  }


  getVariables(variables) {
    this.board = variables.board;
    this.deedDeck = variables.deedDeck;
    this.match = variables.match;
    this.sidebar = variables.sidebar;
    this.auctionTimer = variables.auctionTimer;
  }


  createToken() {
    const token = document.createElement("div");
    token.classList.add("player-token");
    token.textContent = this.name.charAt(0);
    this.token = token;
  }


  move(number) {
    if (this.turnsArrested) return;

    this.position = (this.position + number) % this.board.numOfTiles;
  }


  renderPosition() {
    const tilePlayersEl = this.board.tiles[this.position].element.querySelector(".tile-players");
    tilePlayersEl.appendChild(this.token);
  }


  buy(tile) {
    this.money -= tile.price;
    tile.owner = this;
    this.properties.push(tile);
  }


  buyAuction(tile, bid) {
    this.money -= bid;
    tile.owner = this;
    this.properties.push(tile);
  }

  
  build(tile) {
    this.money -= tile.buildCost;
    tile.houses += 1;
  }


  sell(tile) {
    this.money += tile.buildCost / 2;
    tile.houses -= 1;
  }


  payRent(tile) {
    if (tile.mortgaged) return;

    let rent = tile.rent[tile.houses]

    if (tile.type === "property" && tile.houses === 0 && this.match.checkMonopoly(tile.color, tile.owner)) {
      rent *= 2;
    }

    this.money -= rent;
    tile.owner.money += rent;
  }


  mortgage(tile) {
    tile.mortgaged = true;
    this.money += tile.mortgageValue;
  }


  unmortgage(tile) {
    tile.mortgaged = false;
    this.money -= tile.unmortgageValue;
  }


  getArrested() {
    this.turnsArrested = 1;
    this.position = this.board.jailPos;
  }


  exitJail() {
    if (!this.exitJailCard) this.money -= 50;
    this.turnsArrested = 0;
  }


  takeBid() {
    const currentPlayer = this.match.players[this.match.currentPlayerIndex];
    const tile = this.board.tiles[currentPlayer.position];
    const deedActions = this.deedDeck.cards[tile.index].querySelector(".deed-actions");
    const inputValue = deedActions.querySelector("input[name='quantity']").value;

    if (!inputValue || isNaN(inputValue) || inputValue <= this.match.bid) {
      alert("Not a valid bid amount.");
      return;
    }

    this.match.bid = inputValue;
    this.match.bidder = this;

    this.sidebar.chat(this, `I bid $${inputValue}.`);

    this.auctionTimer.restart();
  }
}