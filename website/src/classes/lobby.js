import { getCompleteDate } from "../utils/calculationUtils.js";


export class Lobby {
  constructor() {
    const date = getCompleteDate();

    this.createEl = document.querySelector(".create-wrapper");
    this.playerNameEl = document.getElementById("playerName");
    this.searchEl = document.getElementById("searchRoom");

    this.playerName = `Player ${date}`;
    this.searchRoomName = null;
  }


  init(variables) {
    this.getVariables(variables);
    this.createEvents();
    window._createRoom = () => this.rooms.create();
    window._joinRoom = (roomName) => this.rooms.join(roomName);
    window._createGame = () => this.createGame();
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
    this.rooms = variables.rooms;
  }


  createEvents() {
    // Show createEl event
    const openCreateEl = (e) => {
      const el = e.target.closest(".create-container");
      if (el) this.showCreateEl();
      else this.hideCreateEl();
    };

    // Get player name event
    const getPlayerName = (e) => {
      this.playerName = e.target.value.trim();
    };

    // Search room event
    const searchRoom = (e) => {
      this.searchRoomName = e.target.value.trim();
      this.rooms.createEls();
    };

    // Unload page event
    const unload = () => {
      this.rooms.exit();
    };
    
    // Create events
    this.playerNameEl.addEventListener("input", getPlayerName);
    this.searchEl.addEventListener("input", searchRoom);
    window.addEventListener("beforeunload", unload);
    if (!this.cfg.touch) document.addEventListener("mousedown", openCreateEl);
    else document.addEventListener("touchstart", openCreateEl, { passive: true });
  }

  
  showCreateEl() {
    this.createEl.classList.add("visible");
  }


  hideCreateEl() {
    this.createEl.classList.remove("visible");
  }


  createGame() {
    const roomData = this.rooms.roomMap[this.rooms.joined];

    if (!this.rooms.isOwner) {
      alert("Need to be the creator of a room.");
      return;
    }

    roomData.startedGame = true;
    this.rooms.database.setField("rooms", this.rooms.joined, { startedGame: true });

    this.startGame();
  }


  tryJoinGame() {
    if (this.rooms.isOwner || !this.rooms.joined) return;

    const roomData = this.rooms.roomMap[this.rooms.joined];

    if (!roomData.startedGame) return;

    this.startGame();
  }

  
  startGame(){
    window.location.href = "website/pages/game.html";
  }
}