const isMobile = window.matchMedia("(max-width: 768px)").matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const debug = new Debug(true);

const board = new Board(tileData);
const chanceDeck = new Deck(chanceDeckData);
const communityDeck = new Deck(communityDeckData);
const dices = new Dices(2);
const deedDeck = new DeedDeck(board.tiles);
const houses = new Buildings(housesData);
const hotels = new Buildings(hotelsData);
const actions = new Actions();
const sidebar = new Sidebar();
const match = new Match();
const screen = new Screen();

const localPlayers = ["Alice", "Bob"];

// Add players
match.addPlayers(localPlayers);