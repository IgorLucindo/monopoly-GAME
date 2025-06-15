// Class for controlling match
class Match {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.state = "dice";
  }


  addPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
    sidebar.updatePlayerStatus();
  }


  start() {
    sidebar.showTurn();
  }


  playDiceTurn(number) {
    if (this.state === "action") return;

    const player = this.players[this.currentPlayerIndex];
    player.move(number);

    this.state = "action";

    const tile = board.tiles[player.position];

    // DEBUG!!!!!!!!!!!!!!!!
    // board.groups[tile.color].forEach(_tile => {
    //   _tile.owner = player
    //   _tile.houses = 1
    // });

    // Take action
    setTimeout(() => {
      updateActionOptions(tile, player);

      // For now only show property tile
      if (tile.type === "property") deedDeck.showCard(tile);
    }, dices[0].spinTime * 1000);
  }


  takeAction(action) {
    if (this.state === "dice") return;

    const player = this.players[this.currentPlayerIndex];
    const tile = board.tiles[player.position];

    this.resolveTile(tile, player, action);

    // Hide action bar for buy/skip
    if (action <= 1) {
      document.getElementById("actionBar").classList.remove("visible");

      // Check game states
      this.checkBankruptcy(player);
      this.checkGameOver();

      // End turn
      this.endTurn(player);
      sidebar.showTurn();
    }

    sidebar.updatePlayerStatus();
  }


  resolveTile(tile, player, action) {
    switch (tile.type) {
      case "property":
      case "railroad":
      case "utility":
        // If there is no owner
        if (!tile.owner) {
          if (action === 0) player.buy(tile);
        }
        // If not the owner
        else if (tile.owner !== player) player.payRent(tile);
        // If player is the owner
        else {
          if (action === 2) player.build(tile); // Build
          else if (action === 3) player.mortgage(tile);  // Mortgage
        }
        break;

      case "tax":
        player.money -= tile.price;
        break;

      case "goto-jail":
        player.position = 10; // Jail index
        player.updatePosition();
        break;

      case "chance":
        chanceDeck.drawCard(player);
        break;

      case "community":
        communityDeck.drawCard(player);
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