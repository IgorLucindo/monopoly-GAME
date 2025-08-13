export class Sidebar {
  constructor() {
    this.playerList = document.getElementById("player-list");
    this.playerTurn = document.getElementById("player-turn");
    this.chatInput = document.getElementById("chat-input");

    this.messageCount = 0;
    this.playerContainers = {};
    this.messageTimeout = null;

    this.chatBubbleTime = 3;
  }


  init(variables) {
    this.getVariables(variables);
    this.createPlayerList();
    this.createEvents();
    this.updateTurn();
  }


  getVariables(variables) {
    this.match = variables.match;
    this.matchsv = variables.matchsv;
  }


  createPlayerList() {
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
  }

  createEvents() {
    // Chat input event
    this.chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const message = this.chatInput.value.trim();
        if (message) {
          this.matchsv.chat(message);
          this.chatInput.value = "";
        };
      }
    });
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


  chat(playerName, message) {
    const playerContainer = this.playerContainers[playerName];
    const messageWrapper = playerContainer.querySelector(".message-wrapper");
    const messageElement = messageWrapper.querySelector(".message");

    messageElement.textContent = message;
    messageWrapper.classList.add("visible");

    // Reset timeout
    if (this.messageTimeout) clearTimeout(this.messageTimeout);

    // start timeout
    this.messageTimeout = setTimeout(() => {
      messageWrapper.classList.remove("visible");
      this.messageTimeout = null;
    }, this.chatBubbleTime * 1000);

    this.messageCount++;
  }


  updateTimer(seconds) {
    const timerElement = document.getElementById("timer");
    const secondsStr = String(Math.floor(seconds)).padStart(2, '0');
    const deciseconds = (seconds*10) % 10;
    timerElement.textContent = `${secondsStr}:${deciseconds}0`;
  }
}