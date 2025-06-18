// Class for controlling match
class Match {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.state = "dice";
    this.extraTurn = 0;
  }


  addPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
    sidebar.update();
  }


  playDiceTurn(numbers) {
    if (this.state === "action") return;
    this.state = "action";

    const player = this.players[this.currentPlayerIndex];
    const number = this.getNumber(player, numbers);
    
    player.move(number);

    const tile = board.tiles[player.position];

    // Show action options
    if (!tile.owner && tile.type === "property") {
      setTimeout(() => {
        showOverlay();
        deedDeck.showCard(tile);
        actionOptions.showDeedOptions(tile);
      }, (dices.list[0].spinTime+0.3) * 1000);
    }
    // Otherwise pass turn
    else this.takeAction(0);
  }


  takeAction(action) {
    if (this.state === "dice") return;

    const player = this.players[this.currentPlayerIndex];
    const tile = board.tiles[player.position];

    // Resolve action taken
    this.resolveTile(tile, player, action);

    // Hide action bar for buy/auction
    if (action) {
      hideOverlay();
      deedDeck.hideCard(tile);
      actionOptions.hideDeedOptions(tile);
    }

    // Check game states
    this.checkBankruptcy(player);
    this.checkGameOver();

    // End turn
    this.endTurn(player);

    // Update sidebar
    sidebar.update();
  }


  getNumber(player, numbers) {
    // Handle double numbers
    if (numbers.every(el => el === numbers[0])) this.extraTurn += 1;
    else this.extraTurn = 0;

    // If double numbers three times, then go to jail
    if (this.extraTurn === 3) {
      this.extraTurn = 0;
      player.getArrested();
      return 0;
    }
    else return numbers.reduce((acc, curr) => acc + curr, 0)
  }


  resolveTile(tile, player, action) {
    switch (tile.type) {
      case "property":
      case "railroad":
      case "utility":
        // If there is no owner
        if (!tile.owner) {
          if (action === 1) player.buy(tile);
        }
        // If not the owner
        else if (tile.owner !== player) player.payRent(tile);
        break;

      case "tax":
        player.money -= tile.price;
        break;

      case "goto-jail":
        player.getArrested();
        break;

      case "chance":
        chanceDeck.drawCard(player);
        break;

      case "community":
        communityDeck.drawCard(player);
        break;
    }

    player.updatePosition();
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
    this.state = "dice"

    // If player as extra turns
    if (this.extraTurn > 0) return;

    // Proceed to next player
    if (player.money < 0) {
      this.currentPlayerIndex %= this.players.length;
    } else {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
  }
}