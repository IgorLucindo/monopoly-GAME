// Player class
class Player {
  constructor(name) {
    this.name = name;
    this.position = 0;
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
    this.position = (this.position + number) % board.tiles.length;
    this.updatePosition();
  }

  updatePosition() {
    const tile = board.tiles[this.position];
    tile.element.appendChild(this.token);
  }
}