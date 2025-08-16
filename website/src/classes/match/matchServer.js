export class MatchServer {
  constructor() {
  }


  init(variables){
    this.getVariables(variables);
    this.createEvents();
  }


  getVariables(variables){
    this.database = variables.database;
    this.board = variables.board;
    this.deedDeck = variables.deedDeck;
    this.houses = variables.houses;
    this.hotels = variables.hotels;
    this.actions = variables.actions;
    this.match = variables.match;
    this.dices = variables.dices;
    this.sidebar = variables.sidebar;
    this.screen = variables.screen;
    this.sounds = variables.sounds;
  }


  createEvents() {
    const roomName = this.match.gameData.roomName;

    // Play dices event
    this.database.createFieldListener("rooms", roomName, "dices", (data) => {
      this.receivePlayDiceTurn(data);
    });

    // Take action event
    this.database.createFieldListener("rooms", roomName, "action", (data) => {
      this.receiveTakeAction(data);
    });

    // Chat event
    this.database.createFieldListener("rooms", roomName, "chat", (data) => {
      this.receiveChat(data);
    });

    // Mortgage event
    this.database.createFieldListener("rooms", roomName, "mortgage", (data) => {
      this.receiveMortgage(data);
    });

    // Start auction event
    this.database.createFieldListener("rooms", roomName, "auction", (data) => {
      this.receiveStartAuction(data);
    });

    // Take bid event
    this.database.createFieldListener("rooms", roomName, "bid", (data) => {
      this.receiveTakeBid(data);
    });

    // Build event
    this.database.createFieldListener("rooms", roomName, "build", (data) => {
      this.receiveBuild(data);
    });

    // Sell event
    this.database.createFieldListener("rooms", roomName, "sell", (data) => {
      this.receiveSell(data);
    });
  }


  receivePlayDiceTurn(data) {
    if (this.match.localPlayer.name === data.player) return;

    const dicesData = data.dices.value;
    const numbers = [];

    // Roll each dragging dice
    this.dices.list.forEach((dice, index) => {
      dice.number = dicesData[index].number;
      dice.pos.x = dicesData[index].pos.x;
      dice.pos.y = dicesData[index].pos.y;
      dice.vel.x = dicesData[index].vel.x;
      dice.vel.y = dicesData[index].vel.y;

      dice.wrapper.style.transition = "none";
      dice.lift();
      void dice.wrapper.offsetWidth;
      dice.wrapper.style.transition = null;
      dice.unlift();
      dice.roll(index);
      numbers.push(dice.number);
    });

    this.sounds.play("roll_dice");

    // Wait for dice roll to play
    setTimeout(() => {
      this.match.playDiceTurn(numbers);
    }, this.dices.spinTime * 1000);
  }


  receiveTakeAction(data) {
    if (this.match.localPlayer.name === data.player) return;

    this.match.takeAction(data.action.value);
  }


  chat(message) {
    const playerName = this.match.localPlayer.name;
    this.sidebar.chat(playerName, message);

    const roomName = this.match.gameData.roomName;
    const serverData = {
      chat: {message, messageCount: this.sidebar.messageCount},
      player: playerName
    };
    this.database.setField("rooms", roomName, serverData);
  }


  receiveChat(data) {
    if (this.match.localPlayer.name === data.player) return;

    this.sidebar.chat(data.player, data.chat.message);
  }


  receiveMortgage(data) {
    if (this.match.localPlayer.name === data.player) return;

    const tile = this.board.tiles[data.mortgage.tileIdx];
    if (data.mortgage.value) tile.owner.mortgage(tile);
    else tile.owner.unmortgage(tile);
  }


  startAuction() {
    this.match.startAuction();

    const roomName = this.match.gameData.roomName;
    const serverData = {
      auction: {auctionCount: this.match.auctionCount},
      player: this.match.localPlayer.name
    };
    this.database.setField("rooms", roomName, serverData);
  }


  receiveStartAuction(data) {
    if (this.match.localPlayer.name === data.player) return;

    const currentPlayer = this.match.players[this.match.currentPlayerIndex];
    const tile = this.board.tiles[currentPlayer.position];

    this.match.showingCard = true;
    this.screen.showOverlay();
    this.deedDeck.showCard(tile);
    this.actions.showDeedOptions(tile);
    this.match.startAuction();
  }


  receiveTakeBid(data) {
    if (this.match.localPlayer.name === data.player) return;

    const player = this.match.players.find(p => p.name === data.player);
    player.takeBid(data.bid.value);
  }


  receiveBuild(data) {
    if (this.match.localPlayer.name === data.player) return;

    const tile = this.board.tiles[data.build.tileIdx];
    const buildings = data.build.buildingType === "house" ? this.houses : this.hotels;
    const building = buildings.allList[data.build.buildingIdx];

    buildings.build(tile, building, data.build.pos);
  }


  receiveSell(data) {
    if (this.match.localPlayer.name === data.player) return;

    const tile = this.board.tiles[data.sell.tileIdx];
    const buildings = data.sell.buildingType === "house" ? this.houses : this.hotels;
    const building = buildings.allList[data.sell.buildingIdx];

    buildings.unLiftBuilding(building);
    buildings.sell(tile, building);
  }
}