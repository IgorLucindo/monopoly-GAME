// Player class
class Player {
  constructor(name) {
    this.name = name;
    this.position = 0;
    this.money = 1500;
    this.turnsArrested = 0;
    this.exitJailCard = false;
    this.properties = [];
    
    this.token = this.createToken();
    this.updatePosition();
  }


  createToken() {
    const token = document.createElement("div");
    token.classList.add("player-token");
    token.textContent = this.name.charAt(0);
    return token;
  }


  move(number) {
    if (this.turnsArrested) return;

    this.position = (this.position + number) % board.tiles.length;
    this.updatePosition();
  }


  updatePosition() {
    const tile = board.tiles[this.position];
    tile.element.appendChild(this.token);
  }


  buy(tile) {
    if (tile.price && this.money >= tile.price && !tile.owner) {
      this.money -= tile.price;
      tile.owner = this;
      this.properties.push(tile);
    }
  }

  
  build(tile) {
    if (tile.owner !== this || tile.houses >= 5) return;

    if (this.money < tile.buildCost) return;

    this.money -= tile.buildCost;
    tile.houses += 1;

    updateActionBar(tile, this)
    this.updateBuildings(tile);
  }


  payRent(tile) {
    if (tile.mortgaged) return;

    let rent = tile.rent[tile.houses]

    if (
      tile.type === "property" &&
      tile.houses === 0 &&
      board.groups[tile.color]?.every(t => t.owner === tile.owner)
    ) {
      rent *= 2;
    }

    this.money -= rent;
    tile.owner.money += rent;
  }


  mortgage(tile) {
    if (tile.owner !== this || tile.mortgaged) return;

    tile.mortgaged = true;
    this.money += value = Math.floor(tile.price / 2);

    updateActionBar(tile, this);
  }


  unmortgage(tile) {
    if (tile.owner !== this || !tile.mortgaged) return;

    const cost = Math.floor(tile.price / 2 * 1.1);
    if (this.money < cost) return;

    tile.mortgaged = false;
    this.money -= cost;

    updateActionBar(tile, this);
  }


  updateBuildings(tile) {
    tile.element.querySelectorAll(".building").forEach(e => e.remove());

    if (tile.houses === 5) {
      const hotel = document.createElement("div");
      hotel.classList.add("building", "hotel");
      tile.element.appendChild(hotel);
    } else {
      for (let i = 0; i < tile.houses; i++) {
        const house = document.createElement("div");
        house.classList.add("building", "house");
        tile.element.appendChild(house);
      }
    }
  }


  getArrested() {
    this.turnsArrested = 1;
    this.position = board.jailPos;
  }


  exitJail() {
    if (!this.exitJailCard) this.money -= 50;
    this.turnsArrested = 0;
  }
}