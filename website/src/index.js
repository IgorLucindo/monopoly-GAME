import { Lobby } from "./classes/lobby.js";
import { Database } from "./classes/database.js";


const cfg = {
  mobile: window.matchMedia("(max-width: 768px)").matches,
  touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
}
const database = new Database();
const lobby = new Lobby();


const variables = { cfg, database }


lobby.init(variables);