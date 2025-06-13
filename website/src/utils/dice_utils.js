function rollDice() {
  const number = Math.floor(Math.random() * 6) + 1;
  document.getElementById("diceResult").textContent = `You rolled a ${number}`;

  return number
};