// Class for controlling match
class Sidebar {
  constructor() {
    this.playerList = document.getElementById("player-list");
    this.playerTurn = document.getElementById("player-turn");

    this.playerContainers = {};
  }


  create() {
    this.playerList.innerHTML = "";

    match.players.forEach((p) => {
      // Create container for each player
      const playerContainer = document.createElement("div");
      playerContainer.className = "player-container";
      playerContainer.innerHTML = `
        <div class="player-token">${p.name.charAt(0)}</div>
        <span class="player-name">${p.name}</span>
        <span class="player-money">$${p.money}</span>
        <div class="message-wrapper">
          <div class="message">
            <p>Hello</p>
          </div>
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
    const player = match.players[match.currentPlayerIndex];
    this.playerTurn.textContent = player.name;
  }
}