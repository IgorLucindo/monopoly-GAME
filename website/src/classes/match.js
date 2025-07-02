import { Player } from "./player.js";


export class Match {
  constructor() {
    this.players = [];
    this.localPlayer = null;
    this._currentPlayerIndex = 0;
    this.state = "dice";
    this.doubles = false;
    this.extraTurn = 0;
    this.showingCard = false;
    this.showCardTime = 0;

    this.smallBlind = 10;
    this.bid = this.smallBlind - 1;
    this.bidder = null;
  }

  
  // Defining setter and getter
  set currentPlayerIndex(value) {
    this._currentPlayerIndex = value;
    this.sidebar.updateTurn();
  }
  get currentPlayerIndex() {
    return this._currentPlayerIndex;
  }


  init(variables, names) {
    this.getVariables(variables);
    this.showCardTime = this.dices.list[0].spinTime + 0.3;
    this.addPlayers(variables, names);
  }


  getVariables(variables) {
    this.dices = variables.dices;
    this.chanceDeck = variables.chanceDeck;
    this.communityDeck = variables.communityDeck;
    this.board = variables.board;
    this.deedDeck = variables.deedDeck;
    this.actions = variables.actions;
    this.sidebar = variables.sidebar;
    this.screen = variables.screen;
    this.auctionTimer = variables.auctionTimer;
  }


  addPlayers(variables, names) {
    names.forEach((name) => {
      const player = new Player(name);
      player.init(variables)
      this.players.push(player);
    });
    this.localPlayer = this.players[0];
  }


  playDiceTurn(numbers) {
    if (this.state === "action") return;
    this.state = "action";

    this.setDoubles(numbers);

    const player = this.players[this.currentPlayerIndex];
    const number = this.getNumber(player, numbers);

    // Handle movement
    this.handleJail(player);
    player.move(number);
    this.checkPassGO(player);

    const tile = this.board.tiles[player.position];

    // Show action options
    if (!tile.owner && ["property", "railroad", "utility"].includes(tile.type)) {
      setTimeout(() => {
        this.showingCard = true;
        this.screen.showOverlay();
        this.deedDeck.showCard(tile);
        this.actions.showDeedOptions(tile);
      }, this.showCardTime * 1000);
    }
    // Otherwise pass turn
    else this.takeAction(0);
  }


  takeAction(action) {
    if (this.state === "dice") return;

    const player = this.players[this.currentPlayerIndex];
    const tile = this.board.tiles[player.position];

    // Resolve action taken
    this.resolveTile(tile, player, action);

    // Hide action bar for buy/auction
    if (this.showingCard) {
      this.showingCard = false;
      this.screen.hideOverlay();
      this.deedDeck.hideCard(tile);
      this.actions.hideDeedOptions(tile);
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
        this.chanceDeck.drawCard(player);
        break;

      case "community":
        this.communityDeck.drawCard(player);
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
    return player && this.board.groups[color]?.every(t => t.owner === player)
  }


  startAuction() {
    this.bidder = null;
    this.bid = this.smallBlind - 1;

    this.auctionTimer.start();
    this.actions.showAuctionOptions();
  }


  endAuction() {
    this.actions.hideAuctionOptions();
    if (this.bidder) this.takeAction(2);
    else this.takeAction(0);
  }


  startMortgage() {
    if (this.actions.state === "mortgage") return;

    this.screen.showOverlay();
    this.board.highlightOwnedTiles();
    this.actions.createMortgageEvent();
  }


  endMortgage(click) {
    this.screen.hideOverlay();
    this.board.unhighlightOwnedTiles();
    this.actions.removeMortgageEvent(click);
  }


  handleMortgage(tile) {
    if (!tile || !tile.owner || this.localPlayer.name !== tile.owner.name) return;
    
    if (tile.mortgaged && tile.owner.money >= tile.unmortgageValue) {
      tile.owner.unmortgage(tile);
    }
    else if (!tile.mortgaged) tile.owner.mortgage(tile);
  }
}