const DEBUG = true

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const board = new Board(tileData);
const chanceDeck = new Deck(chanceDeckData);
const communityDeck = new Deck(communityDeckData);
const dices = new Dices(2);
const deedDeck = new DeedDeck(board.tiles);
const match = new Match();
const sidebar = new Sidebar();
const actionOptions = new ActionOptions();

// Add players
match.addPlayer("Alice");
match.addPlayer("Bob");

// Button click triggers turn control
window._takeAction = (action) => match.takeAction(action);