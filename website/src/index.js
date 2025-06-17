const DEBUG = true

const chanceDeck = new Deck(chanceDeckData);
const communityDeck = new Deck(communityDeckData);
const board = new Board(tileData);
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