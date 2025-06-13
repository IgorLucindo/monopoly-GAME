// Create board
const board = new Board("gameBoard");

// Create match
const match = new Match();

// Add players
match.addPlayer("Alice");
match.addPlayer("Bob");

// Start match
match.start();

// Button click triggers turn control
window.takeTurn = () => match.nextTurn();