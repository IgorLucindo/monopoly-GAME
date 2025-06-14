// Class for controlling match
class Sidebar {
  constructor() {
    this.playerList = document.getElementById("playerList");
    this.playerTurn = document.getElementById("player-turn");
  }

  
  updatePlayerStatus() {
    this.playerList.innerHTML = "";
    match.players.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} ($${p.money})`;
      this.playerList.appendChild(li);
    });
  }


  showTurn() {
    const player = match.players[match.currentPlayerIndex];
    this.playerTurn.textContent = player.name;
  }
}