// Player class
class Player {
  constructor(name) {
    this.name = name;
    this._position = 0;
    this.prevPosition = 0;
    this._money = 1500;
    this.prevMoney = this.money;
    this.turnsArrested = 0;
    this.exitJailCard = false;
    this.properties = [];
    
    this.token = this.createToken();
    this.renderPosition();
  }


  // Defining setter and getter
  set money(value) {
    this._money = value;
    sidebar.update(this);
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


  createToken() {
    const token = document.createElement("div");
    token.classList.add("player-token");
    token.textContent = this.name.charAt(0);
    return token;
  }


  move(number) {
    if (this.turnsArrested) return;

    this.position = (this.position + number) % board.numOfTiles;
  }


  renderPosition() {
    const tilePlayersEl = board.tiles[this.position].element.querySelector(".tile-players");
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

    if (tile.type === "property" && tile.houses === 0 && match.checkMonopoly(tile.color, tile.owner)) {
      rent *= 2;
    }

    this.money -= rent;
    tile.owner.money += rent;
  }


  mortgage(tile) {
    if (tile.owner !== this || tile.mortgaged) return;

    tile.mortgaged = true;
    this.money += value = Math.floor(tile.price / 2);
  }


  unmortgage(tile) {
    if (tile.owner !== this || !tile.mortgaged) return;

    const cost = Math.floor(tile.price / 2 * 1.1);
    if (this.money < cost) return;

    tile.mortgaged = false;
    this.money -= cost;
  }


  getArrested() {
    this.turnsArrested = 1;
    this.position = board.jailPos;
  }


  exitJail() {
    if (!this.exitJailCard) this.money -= 50;
    this.turnsArrested = 0;
  }


  takeBid() {
    const currentPlayer = match.players[match.currentPlayerIndex];
    const tile = board.tiles[currentPlayer.position];
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    const inputValue = deedActions.querySelector("input[name='quantity']").value;

    if (!inputValue || isNaN(inputValue) || inputValue <= match.bid) {
      alert("Not a valid bid amount.");
      return;
    }

    match.bid = inputValue;
    match.bidder = this;

    sidebar.chat(this, `I bid $${inputValue}.`);

    auctionTimer.restart();
  }
}