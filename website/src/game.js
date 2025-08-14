import { Debug } from "./classes/debug.js";
import { Database } from "./classes/database.js";
import { Board } from "./classes/board.js";
import { Deck } from "./classes/deck/deck.js";
import { Dices } from "./classes/dice/dices.js";
import { DeedDeck } from "./classes/deck/deedDeck.js";
import { Buildings } from "./classes/buildings.js";
import { Actions } from "./classes/actions.js";
import { Sidebar } from "./classes/sidebar.js";
import { Timer } from "./classes/timer/timer.js";
import { Match } from "./classes/match/match.js";
import { MatchServer } from "./classes/match/matchServer.js";
import { Screen } from "./classes/screen.js";
import { Sounds } from "./classes/sounds.js";

import { tileData } from "../data/tiles.js";
import { chanceDeckData } from "../data/chanceDeck.js";
import { communityDeckData } from "../data/communityDeck.js";
import { housesData } from "../data/houses.js";
import { hotelsData } from "../data/hotels.js";
import { soundsData } from "../data/sounds.js";


const cfg = {
  mobile: window.matchMedia("(max-width: 768px)").matches,
  touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
}
const debug = new Debug(true);
const database = new Database();
const board = new Board();
const chanceDeck = new Deck(chanceDeckData);
const communityDeck = new Deck(communityDeckData);
const dices = new Dices();
const deedDeck = new DeedDeck();
const houses = new Buildings(housesData);
const hotels = new Buildings(hotelsData);
const actions = new Actions();
const match = new Match();
const matchsv = new MatchServer();
const sidebar = new Sidebar();
const auctionTimer = new Timer(() => {match.endAuction();}, 30000);
const screen = new Screen();
const sounds = new Sounds(soundsData);


const variables = {
  cfg, debug, database, board, chanceDeck, communityDeck,
  dices, deedDeck, houses, hotels, actions, match, matchsv,
  sidebar, auctionTimer, screen, sounds
}


debug.init(variables);
database.init();
board.init(variables, tileData);
dices.init(variables, 2);
deedDeck.init(variables);
houses.init(variables);
hotels.init(variables);
actions.init(variables);
match.init(variables);
matchsv.init(variables);
chanceDeck.init(variables);
communityDeck.init(variables);
sidebar.init(variables);
auctionTimer.init(variables);
screen.init(variables);