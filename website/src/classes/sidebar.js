export class Sidebar {
  constructor() {
    this.playerList = document.getElementById("player-list");
    this.playerTurn = document.getElementById("player-turn");

    this.playerContainers = {};
    this.chatBubbleTime = 3;
  }


  init(variables) {
    this.getVariables(variables);
    this.create();
  }


  getVariables(variables) {
    this.match = variables.match;
  }


  create() {
    this.playerList.innerHTML = "";

    this.match.players.forEach((p) => {
      // Create container for each player
      const playerContainer = document.createElement("div");
      playerContainer.className = "player-container";
      playerContainer.innerHTML = `
        <div class="player-token" style="--color: ${p.tokenColor}">${p.name.charAt(0)}</div>
        <span class="player-name">${p.name}</span>
        <span class="player-money">$${p.money}</span>
        <div class="message-wrapper">
          <div class="message"></div>
        </div>
      `;

      // Append player container
      this.playerContainers[p.name] = playerContainer;
      this.playerList.appendChild(playerContainer);
    });

    this.updateTurn();
  }


  update(player) {
    this.updatePlayerStatus(player);
    this.updateTurn();
  }

  
  updatePlayerStatus(player) {
    const playerContainer = this.playerContainers[player.name];
    const moneyElement = playerContainer.querySelector(".player-money");
    const changeType = (player.money < player.prevMoney)
      ? "decreased"
      : (player.money > player.prevMoney)
        ? "increased"
        : null;

    moneyElement.textContent = `$${player.money}`;
    if (changeType) {
      moneyElement.classList.add(changeType);
      setTimeout(() => {
        moneyElement.classList.remove(changeType);
      }, 300);
    }
  }


  updateTurn() {
    const player = this.match.players[this.match.currentPlayerIndex];
    this.playerTurn.textContent = player.name;
  }


  chat(player, message) {
    const playerContainer = this.playerContainers[player.name];
    const messageWrapper = playerContainer.querySelector(".message-wrapper");
    const messageElement = messageWrapper.querySelector(".message");

    messageElement.textContent = message;
    messageWrapper.classList.add("visible");

    setTimeout(() => {
      messageWrapper.classList.remove("visible");
    }, this.chatBubbleTime * 1000);
  }


  updateTimer(seconds) {
    const timerElement = document.getElementById("timer");
    const secondsStr = String(Math.floor(seconds)).padStart(2, '0');
    const deciseconds = (seconds*10) % 10;
    timerElement.textContent = `${secondsStr}:${deciseconds}0`;
  }
}