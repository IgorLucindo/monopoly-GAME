import { Database } from "./classes/database.js";
import { Lobby } from "./classes/lobby.js";
import { Rooms } from "./classes/rooms.js";


const cfg = {
  mobile: window.matchMedia("(max-width: 768px)").matches,
  touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
}
const database = new Database();
const lobby = new Lobby();
const rooms = new Rooms();


const variables = { cfg, database, lobby, rooms }

database.init();
lobby.init(variables);
rooms.init(variables);