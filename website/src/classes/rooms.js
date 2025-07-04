import { getCompleteDate } from "../utils/calculationUtils.js";


export class Rooms {
  constructor() {
    this.roomsEl = document.querySelector(".rooms");

    this.roomMap = {};
    this.joined = null;
    this.isOwner = false;

    this.maxPlayers = 6;
    this.loadTime = 5;
    this.deleteTime = 300;
  }


  init(variables) {
    this.getVariables(variables);
    this.keepUpdating();
  }


  getVariables(variables) {
    this.database = variables.database;
    this.lobby = variables.lobby;
  }


  async keepUpdating() {
    await this.load();
    this.createEls();
    
    setInterval(async () => {
      await this.load();
      this.lobby.tryJoinGame();
      this.updateduration();
      this.createEls();
    }, this.loadTime * 1000);
  }


  async load() {
    const rooms = await this.database.getCollection("rooms");

    this.roomMap = {};
    for (const roomName of Object.keys(rooms)) {
      this.roomMap[roomName] = rooms[roomName];
    }
  }


  updateduration() {
    if (!this.isOwner) return;

    const roomName = this.joined;
    this.roomMap[roomName].duration += this.loadTime;
    const duration = this.roomMap[roomName].duration;

    if (duration >= this.deleteTime) this.delete(roomName);
    else this.database.setField("rooms", roomName, { duration });
  }


  createEls() {
    this.roomsEl.innerHTML = "";
    for (const roomName of Object.keys(this.roomMap)) {
      if (this.lobby.searchRoomName && !roomName.includes(this.lobby.searchRoomName)) continue;
      this.createEl(roomName, this.roomMap[roomName]);
    }
  }


  createEl(roomName, roomData) {
    // Create element
    const roomEl = document.createElement("div");
    roomEl.classList.add("room");
    roomEl.innerHTML = `
      <div class="room-name">${roomName}</div>
      <div class="room-players">
        <div class="room-player" onclick="_joinRoom('${roomName}')" id="join">
          <img src="website/assets/images/icons/plus.svg">
        </div>
      </div>
    `;

    // Append players to element
    const playersEl = roomEl.querySelector(".room-players");
    roomData.players.forEach((playerName) => {
      this.appendPlayerEl(playersEl, playerName);
    });

    // Handle join button
    const joinBtn = roomEl.querySelector("#join");
    if (this.joined === roomName || roomData.players.length === this.maxPlayers) {
      joinBtn.classList.add("disable");
    }

    // Append element
    if (this.joined === roomName) {
      roomEl.classList.add("joined");
      this.roomsEl.prepend(roomEl);
    }
    else this.roomsEl.appendChild(roomEl);
  }


  appendPlayerEl(playersEl, playerName) {
    const el = document.createElement("div");
    el.classList.add("room-player");
    el.innerHTML = `
      <img src="website/assets/images/icons/user.svg">
      <p>${playerName}</p>
    `;
    playersEl.prepend(el);
  }


  async create() {
    const date = getCompleteDate();

    let roomName = document.getElementById("roomName").value.trim();
    if (!roomName) roomName = `Room ${date}`;
    const password = document.getElementById("password").value.trim();

    const existingRoom = await this.database.getDocument("rooms", roomName);
    if (existingRoom) {
      alert("Room already exists");
      return;
    }

    const roomData = {
      players: [this.lobby.playerName],
      password: password,
      duration: 0,
      startedGame: false
    }

    // Exit previous room
    this.exit();

    // Join new room
    this.roomMap[roomName] = roomData;
    this.database.setDocument("rooms", roomName, roomData);

    // Update
    this.joined = roomName;
    this.isOwner = true;
    this.createEls();
  }


  join(roomName) {
    // Exit previous room
    this.exit();

    // Join new room
    this.roomMap[roomName].players.push(this.lobby.playerName);
    const newPlayers = this.roomMap[roomName].players;
    this.database.setField("rooms", roomName, { players: newPlayers });

    // Update
    this.joined = roomName;
    this.createEls(this.roomMap[roomName]);
  }


  exit() {
    if (!this.joined) return;

    const oldPlayers = this.roomMap[this.joined].players;
    const newPlayers = oldPlayers.filter(p => p !== this.lobby.playerName);
    this.roomMap[this.joined].players = newPlayers;

    this.isOwner = false;

    if (newPlayers.length !== 0) {
      this.database.setField("rooms", this.joined, { players: newPlayers });
    }
    else this.delete(this.joined);
  }


  delete(roomName) {
    delete this.roomMap[roomName];
    if (this.joined === roomName) this.joined = null;
    this.database.deleteDocument("rooms", roomName);
  }
}