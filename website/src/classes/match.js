// Class for controlling match
class Match {
  constructor() {
    this.players = [];
    this._currentPlayerIndex = 0;
    this.state = "dice";
    this.doubles = false;
    this.extraTurn = 0;
    this.showingCard = false;

    this.smallBlind = 10;
    this.bid = this.smallBlind - 1;
    this.bidder = null;

    this.showCardDelay = dices.list[0].spinTime + 0.3;
  }

  
  // Defining setter and getter
  set currentPlayerIndex(value) {
    this._currentPlayerIndex = value;
    sidebar.updateTurn();
  }
  get currentPlayerIndex() {
    return this._currentPlayerIndex;
  }


  addPlayers(names) {
    names.forEach((name) => {
      const player = new Player(name);
      this.players.push(player);
      sidebar.create();
    });
  }


  playDiceTurn(numbers) {
    if (this.state === "action") return;
    this.state = "action";

    this.setDoubles(numbers);

    const player = this.players[this.currentPlayerIndex];
    // const number = this.getNumber(player, numbers);
    const number = 1

    // Handle movement
    this.handleJail(player);
    player.move(number);
    this.checkPassGO(player);

    const tile = board.tiles[player.position];

    // Show action options
    if (!tile.owner && ["property", "railroad", "utility"].includes(tile.type)) {
      setTimeout(() => {
        this.showingCard = true;
        screen.showOverlay();
        deedDeck.showCard(tile);
        actions.showDeedOptions(tile);
      }, this.showCardDelay * 1000);
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
    if (this.showingCard) {
      this.showingCard = false;
      screen.hideOverlay();
      deedDeck.hideCard(tile);
      actions.hideDeedOptions(tile);
    }

    // Check game states
    this.checkBankruptcy(player);
    this.checkGameOver();

    // End turn
    this.endTurn(player);
  }


  setDoubles(numbers) {
    this.doubles = numbers.every(el => el === numbers[0]);
  }


  getNumber(player, numbers) {
    // Handle double numbers
    if (this.doubles) this.extraTurn += 1;
    else this.extraTurn = 0;

    // If double numbers three times, then go to jail
    if (this.extraTurn === 3) {
      this.extraTurn = 0;
      player.getArrested();
      return 0;
    }
    else return numbers.reduce((acc, curr) => acc + curr, 0);
  }


  handleJail(player) {
    if (!player.turnsArrested) return;

    // Exit jail if hit doubles
    if (this.doubles) {
      player.turnsArrested = 0;
      this.extraTurn = 0;
    }
    else player.turnsArrested += 1;

    // Exit jail after 3 turns
    if (player.turnsArrested === 4) player.exitJail();
  }


  checkPassGO(player) {
    if (!player.turnsArrested && player.position - player.prevPosition < 0) player.money += 200;
    player.prevPosition = player.position; 
  }


  resolveTile(tile, player, action) {
    switch (tile.type) {
      case "property":
      case "railroad":
      case "utility":
        // If there is no owner
        if (!tile.owner) {
          if (action === 1) player.buy(tile);
          else if (action === 2) this.bidder.buyAuction(tile, this.bid);
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

    this.checkPassGO(player);
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
    }
    else {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
  }


  checkMonopoly(color, player) {
    return player && board.groups[color]?.every(t => t.owner === player)
  }


  startAuction() {
    this.bidder = null;
    this.bid = this.smallBlind - 1;

    auctionTimer.start();
    actions.showAuctionOptions();
  }


  endAuction() {
    actions.hideAuctionOptions();
    if (this.bidder) this.takeAction(2);
    else this.takeAction(0);
  }
}