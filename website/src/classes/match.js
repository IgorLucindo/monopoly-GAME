// Class for controlling match
class Match {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
  }


  addPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
    this.updatePlayerList();
  }


  start() {
    this.showTurn();
  }


  nextTurn() {
    const player = this.players[this.currentPlayerIndex];
    const number = rollDice(); // uses the utility
    player.move(number);
    document.getElementById("diceResult").textContent = `🎲 ${player.name} rolled a ${number}`;

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.showTurn();
  }


  showTurn() {
    const player = this.players[this.currentPlayerIndex];
    console.log(`It's ${player.name}'s turn`);
  }

  
  updatePlayerList() {
    const ul = document.getElementById("playerList");
    ul.innerHTML = "";
    this.players.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p.name;
      ul.appendChild(li);
    });
  }
}
