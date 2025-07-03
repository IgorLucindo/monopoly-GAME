import { getCompleteDate } from "../utils/calculationUtils.js";


export class Lobby {
  constructor() {
    this.createRoomEl = document.querySelector(".create-room");
    this.showTabBtn = document.getElementById("show-tab-btn");
    this.roomsEl = document.querySelector(".rooms");
  }


  init(variables) {
    this.getVariables(variables);
    this.createTabEvents();
    this.loadRooms();
    window._createRoom = () => this.createRoom();
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
    this.database = variables.database;
  }


  createTabEvents() {
    // Mouse down event
    const mousedown = (e) => {
      const el = e.target.closest(".create-room");
      if (el !== this.createRoomEl) {
        this.hideTab();
        return;
      }
      this.showTab();
    };
    
    // Create events
    if (!this.cfg.touch) document.addEventListener("mousedown", mousedown);
    else document.addEventListener("touchstart", mousedown, { passive: true });
  }


  async loadRooms() {
    const rooms = await this.database.getAllDocument("rooms");

    for (const roomName of Object.keys(rooms)) {
      this.createRoomTab(roomName, rooms[roomName]);
    }
  }


  createRoomTab(roomName, roomData) {
    const roomEl = document.createElement("div");
    roomEl.classList.add("room");
    roomEl.innerHTML = `
      <div class="room-name">${roomName}</div>
      <div class="room-players"></div>
    `;
    this.roomsEl.appendChild(roomEl);
  }

  
  showTab() {
    [...this.createRoomEl.children].forEach((el) => {el.classList.add("visible");});
    this.createRoomEl.classList.add("visible");
    this.showTabBtn.classList.remove("visible");
  }


  hideTab() {
    [...this.createRoomEl.children].forEach((el) => {el.classList.remove("visible");});
    this.createRoomEl.classList.remove("visible");
    this.showTabBtn.classList.add("visible");
  }


  async createRoom() {
    const date = getCompleteDate();

    let roomName = document.getElementById("roomName").value.trim();
    if (!roomName) roomName = `Room (${date})`;
    const password = document.getElementById("password").value.trim();

    const existingRoom = await this.database.getDocument("rooms", roomName);
    if (existingRoom) {
      alert("Room already exists");
      return;
    }

    this.database.setDocument("rooms", roomName, {players: ["igor", "lucindo"], password: password});
  };
}