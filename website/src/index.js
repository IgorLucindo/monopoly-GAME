const DEBUG = true

const chanceDeck = new Deck(chanceDeckData);
const communityDeck = new Deck(communityDeckData);
const dices = new Dices(2);
const board = new Board(tileData);
const deedDeck = new DeedDeck(board.tiles);
const match = new Match();
const sidebar = new Sidebar();

// Add players
match.addPlayer("Alice");
match.addPlayer("Bob");

// Start match
match.start();

// Button click triggers turn control
window._takeAction = (action) => match.takeAction(action);