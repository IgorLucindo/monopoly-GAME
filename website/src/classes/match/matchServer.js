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
  }


  createEvents() {
    const roomName = this.match.gameData.roomName;

    // Play dices event
    this.database.createFieldListener("rooms", roomName, "dices", (data) => {
      this.playDiceTurn(data);
    });

    // Take action event
    this.database.createFieldListener("rooms", roomName, "action", (data) => {
      this.takeAction(data);
    },
  ()=>{console.log("no action")});
  }


  playDiceTurn(data) {
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


  takeAction(data) {
    if (this.match.localPlayer.name === data.player) return;

    this.match.takeAction(data.action.value);
  }
}