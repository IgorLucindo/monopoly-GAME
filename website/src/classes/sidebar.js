export class Sidebar {
  constructor() {
    this.playerList = document.getElementById("player-list");
    this.chatInput = document.getElementById("chat-input");

    this.messageCount = 0;
    this.playerContainers = {};
    this.messageWrappers = {};
    this.messageTimeout = {};

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
    this.sounds = variables.sounds;
  }


  createPlayerList() {
    this.playerList.innerHTML = "";

    this.match.players.forEach((p) => {
      // Create container for each player
      const playerWrapperContainer = document.createElement("div");
      playerWrapperContainer.className = "player-wrapper-container";
      playerWrapperContainer.innerHTML = `
        <div class="player-container">
          <div class="player-token" style="--color: ${p.tokenColor}">${p.name.charAt(0)}</div>
          <span class="player-name">${p.name}</span>
          <span class="player-money">$${p.money}</span>
        </div>
        <div class="message-wrapper">
          <div class="message"></div>
        </div>
      `;
      const playerContainer = playerWrapperContainer.querySelector(".player-container");
      const messageWrapper = playerWrapperContainer.querySelector(".message-wrapper");

      // Append player container
      this.playerContainers[p.name] = playerContainer;
      this.messageWrappers[p.name] = messageWrapper;
      this.messageTimeout[p.name] = null;
      this.playerList.appendChild(playerWrapperContainer);
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

    // Remove all other highlights
    for (const container of Object.values(this.playerContainers)) {
      container.classList.remove("highlight");
    }
    
    // Highlight current player
    const playerContainer = this.playerContainers[player.name];
    playerContainer.classList.add("highlight");
    // void playerContainer.offsetWidth;
    this.chat(player.name, "My Turn!");
  }


  chat(playerName, message) {
    const messageWrapper = this.messageWrappers[playerName];
    const messageElement = messageWrapper.querySelector(".message");

    messageElement.textContent = message;
    messageWrapper.classList.add("visible");
    this.sounds.play("chat_pop");

    // Reset timeout
    if (this.messageTimeout[playerName]) {
      clearTimeout(this.messageTimeout[playerName]);
    }

    // start timeout
    this.messageTimeout[playerName] = setTimeout(() => {
      messageWrapper.classList.remove("visible");
      this.messageTimeout[playerName] = null;
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