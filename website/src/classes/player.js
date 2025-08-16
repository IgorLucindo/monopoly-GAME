export class Player {
  constructor(name) {
    this.name = name;
    this._money = 1500;
    this.prevMoney = this.money;
    this._position = 0;
    this.prevPosition = 0;
    this.turnsArrested = 0;
    this.properties = [];
    this.token = null;
    this.tokenColor = null;
    this.tokenStepTime = 0.25;
    this.isCreator = false;
    this.exitJailCard = false;

    this.colorMap = [
      "#8b4513", "#add8e6", "#ff69b4", "#ffa500",
      "#ff0000", "#f1d500", "#008000", "#00008b"
    ]
  }


  // Defining setter and getter
  set money(value) {
    this._money = value;

    this.sidebar.updatePlayerStatus(this);
    
    const delay = 300;
    if (value < this.prevMoney) this.sounds.play("lose_money", delay);
    else this.sounds.play("gain_money", delay);

    this.prevMoney = value;
  }
  get money() {
    return this._money;
  }
  set position(value) {
    this.prevPosition = this._position; 
    this._position = value;
    this.renderPosition();
  }
  get position() {
    return this._position;
  }


  init(variables, index) {
    this.getVariables(variables);
    this.createToken(index);
    this.renderFixedPosition();
    if (index === 0) this.isCreator = true;
  }


  getVariables(variables) {
    this.board = variables.board;
    this.deedDeck = variables.deedDeck;
    this.match = variables.match;
    this.sidebar = variables.sidebar;
    this.auctionTimer = variables.auctionTimer;
    this.sounds = variables.sounds;
  }


  createToken(index) {
    const color = this.colorMap[index];
    const token = document.createElement("div");

    token.classList.add("player-token");
    token.style.setProperty("--color", color);

    this.token = token;
    this.tokenColor = color;
  }


  move(number) {
    if (this.turnsArrested) return;

    this.position = (this.position + number) % this.board.numOfTiles;
  }


  renderFixedPosition() {
    const tilePlayersEl = this.board.tiles[this.position].element.querySelector(".tile-players");
    tilePlayersEl.appendChild(this.token);
  }


  async renderPosition() {
    let currRect = this.token.getBoundingClientRect();
    let currPosition = this.prevPosition;

    while (currPosition !== this.position) {
      currPosition = (currPosition + 1) % this.board.numOfTiles;
      currRect = await this.animateTokenStep(currRect, currPosition);
    }
  }


  async animateTokenStep(currRect, currPosition) {
    const tilePlayersEl = this.board.tiles[currPosition].element.querySelector(".tile-players");
    tilePlayersEl.appendChild(this.token);
    const nextRect = this.token.getBoundingClientRect();

    this.token.style.visibility = "hidden";

    // Create a clone for animation
    const clone = this.token.cloneNode(true);
    document.body.appendChild(clone);
    clone.classList.add("token-clone");
    clone.style.visibility = "visible";
    clone.style.setProperty("--moveTime", this.tokenStepTime + "s");

    // Animate
    clone.style.left = currRect.left + "px";
    clone.style.top = currRect.top + "px";
    void clone.offsetWidth;
    clone.style.left = nextRect.left + "px";
    clone.style.top = nextRect.top + "px";

    // Play sound
    this.sounds.play("token_step");

    // Return a promise that resolves after transition ends
    return new Promise(resolve => {
      clone.addEventListener("transitionend", () => {
        clone.remove();
        this.token.style.visibility = null;
        resolve(nextRect);
      }, { once: true });
    });
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


  takeBid(amount) {
    if (!amount || isNaN(amount) || amount <= this.match.bid) {
      alert("Not a valid bid amount.");
      return;
    }

    this.match.bid = amount;
    this.match.bidder = this;

    this.sidebar.chat(this.name, `I bid $${amount}.`);

    this.auctionTimer.restart();
  }
}