export class MatchServer {
  constructor() {
  }


  init(variables){
    this.getVariables(variables);
    this.createEvents();
  }


  getVariables(variables){
    this.database = variables.database;
    this.match = variables.match;
    this.dices = variables.dices;
    this.sidebar = variables.sidebar;
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

    // Play
    this.match.playDiceTurn(numbers);
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
}