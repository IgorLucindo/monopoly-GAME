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

    // Someone play dices event
    this.database.createFieldListener("rooms", roomName, "dices", this.playDiceTurn.bind(this));
  }


  playDiceTurn(dicesData) {
    if (!dicesData.length || this.match.myTurn) return;

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
}