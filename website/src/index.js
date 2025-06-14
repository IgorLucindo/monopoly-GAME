// Create board
const board = new Board("gameBoard");
const match = new Match();
const dice = new Dice();
const sidebar = new Sidebar();

// Add players
match.addPlayer("Alice");
match.addPlayer("Bob");

// Start match
match.start();

// Button click triggers turn control
window._takeAction = (action) => match.takeAction(action);