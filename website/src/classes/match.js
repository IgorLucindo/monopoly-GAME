// Class for controlling match
class Match {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.state = "dice";
    this.diceNumber = 0;
  }


  addPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
    sidebar.updatePlayerStatus();
  }


  start() {
    sidebar.showTurn();
  }


  rollDice() {
    if (this.state === "action") return;

    // Get dice number
    this.diceNumber = Math.floor(Math.random() * 6) + 1;
    
    // Move player
    const player = this.players[this.currentPlayerIndex];
    player.move(this.diceNumber);

    // Change match state
    this.state = "action";

    const tile = board.tiles[player.position];
    const isBuyable = ["property", "railroad", "utility"].includes(tile.type);

    // If can take action
    if (isBuyable && !tile.owner) {
      setTimeout(() => {
        document.getElementById("actionBar").classList.add("visible");
        document.getElementById("actionMessage").textContent = `Do you want to buy ${tile.label} for $${tile.price}?`;
      }, dice.spinTime * 1000);
    }
    // If cannot take action
    else this.takeAction(1);
  };


  takeAction(action) {
    if (this.state === "dice") return;

    const player = this.players[this.currentPlayerIndex];
    const tile = board.tiles[player.position];
    this.resolveTile(tile, player, action);
    
    // Hide action bar
    document.getElementById("actionBar").classList.remove("visible");

    // Check game states
    this.checkBankruptcy(player)
    this.checkGameOver()

    // End turn
    this.endTurn(player)
    sidebar.showTurn();
    sidebar.updatePlayerStatus();
  }


  resolveTile(tile, player, action) {
    switch (tile.type) {
      case "property":
      case "railroad":
      case "utility":
        // If there is no owner
        if (!tile.owner) {
          if (action === 0) player.buyProperty(tile);
        }
        // If not the owner
        else if (tile.owner !== player) {
          const rent = tile.price * 0.1;
          player.money -= rent;
          tile.owner.money += rent;
        }
        // If player is the owner
        else {
          // -- Action to sell or build residence or hotel --
        }
        break;

      case "tax":
        player.money -= tile.amount || 100;
        break;

      case "goto-jail":
        player.position = 10; // Jail index
        player.updatePosition();
        break;
    }
  }


  checkBankruptcy(player) {
    if (player.money >= 0) return;

    alert(`${player.name} is bankrupt!`);

    // Optionally remove ownership from their properties
    player.properties.forEach(t => t.owner = null);

    this.players.splice(this.currentPlayerIndex, 1);
  }


  checkGameOver() {
    // If no players left, stop the game
    if (this.players.length === 1) {
      alert("Game over! " + this.players[0].name + " is the winner!");
      return;
    }
  }

  
  endTurn(player) {
    // Proceed to next player
    if (player.money < 0) {
      this.currentPlayerIndex %= this.players.length;
    } else {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    // Change match state
    this.state = "dice"
  }
}