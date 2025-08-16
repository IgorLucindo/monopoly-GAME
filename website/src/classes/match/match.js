import { Player } from "../player.js";


export class Match {
  constructor() {
    this.players = [];
    this.gameData = {};
    this.localPlayer = null;
    this.turn = 0;
    this.myTurn = false;
    this._currentPlayerIndex = 0;
    this.state = "dice";
    this.doubles = false;
    this.extraTurn = 0;
    this.auctionCount = 0;
    this.showingCard = false;

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


  init(variables) {
    this.getVariables(variables);
    this.getGameData();
    this.addPlayers(variables);
    this.myTurn = this.localPlayer.name === this.players[this.currentPlayerIndex].name;
  }


  getVariables(variables) {
    this.database = variables.database;
    this.dices = variables.dices;
    this.chanceDeck = variables.chanceDeck;
    this.communityDeck = variables.communityDeck;
    this.board = variables.board;
    this.deedDeck = variables.deedDeck;
    this.actions = variables.actions;
    this.sidebar = variables.sidebar;
    this.screen = variables.screen;
    this.auctionTimer = variables.auctionTimer;
    this.matchsv = variables.matchsv;
  }


  getGameData() {
    this.gameData = JSON.parse(localStorage.getItem('gameData'));
  }


  addPlayers(variables) {
    const playerNames = this.gameData.roomData.players;

    playerNames.forEach((name, index) => {
      const player = new Player(name);

      player.init(variables, index);
      this.players.push(player);

      if (name === this.gameData.playerName) this.localPlayer = player;
    });
  }


  playDiceTurn(numbers) {
    if (this.state === "action") return;
    this.state = "action";

    this.setDoubles(numbers);

    const player = this.players[this.currentPlayerIndex];
    const number = this.getNumber(player, numbers);

    // Handle movement
    this.moveTime = player.tokenSpeed * number;
    this.handleJail(player);
    player.move(number);
    this.checkPassGO(player);

    const tile = this.board.tiles[player.position];

    // Wait for token to move
    setTimeout(() => {
      if (!tile.owner && ["property", "railroad", "utility"].includes(tile.type)) {
        if (!this.myTurn) return;
        // Show deed
        this.showingCard = true;
        this.screen.showOverlay();
        this.deedDeck.showCard(tile);
        this.actions.showDeedOptions(tile);
      }
      else {
        // Pass turn
        this.takeAction(0);
      }
    }, this.moveTime * 1000);
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
    if (player.money < 0) this.currentPlayerIndex %= this.players.length;
    else this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    this.turn++;

    // Check if is turn of local player
    this.myTurn = this.localPlayer.name === this.players[this.currentPlayerIndex].name;
  }


  checkMonopoly(color, player) {
    return player && this.board.groups[color]?.every(t => t.owner === player)
  }


  startAuction() {
    this.bidder = null;
    this.bid = this.smallBlind - 1;

    this.auctionTimer.start();
    this.actions.showAuctionOptions();

    this.auctionCount++;
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

    const roomName = this.gameData.roomName;
    const serverData = {
      mortgage: {tileIdx: tile.index, value: true},
      player: this.localPlayer.name
    };
    
    if (tile.mortgaged && tile.owner.money >= tile.unmortgageValue) {
      // Unmortgage
      tile.owner.unmortgage(tile);
      serverData.mortgage.value = false;
      this.database.setField("rooms", roomName, serverData);
    }
    else if (!tile.mortgaged) {
      // Mortgage
      tile.owner.mortgage(tile);
      serverData.mortgage.value = true;
      this.database.setField("rooms", roomName, serverData);
    }
  }
}