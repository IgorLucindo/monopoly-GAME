function updateActionOptions(tile, player) {
  const group = board.groups[tile.color] || [];

  const ownsTile = tile.owner === player;
  const fullGroupOwned = group.length > 0 && group.every(t => t.owner === player);
  const isBuyable = ["property", "railroad", "utility"].includes(tile.type);
  const anyMortgaged = group.some(t => t.mortgaged);
  const anyBuildings = group.some(t => t.houses > 0);
  const canBuildHere = ownsTile && fullGroupOwned && !anyMortgaged && tile.houses < 5;
  const canSellHere = tile.houses > 0;
  const canMortgage = ownsTile && !tile.mortgaged && !anyBuildings;
  const canUnmortgage = ownsTile && tile.mortgaged;

  const actions = [];

  // 1. Buying (only if tile is unowned and landed on)
  if (!tile.owner && isBuyable) actions.push({ type: "buy", enabled: player.money >= tile.price });

  // 2. Building
  if (canBuildHere) {
    const buildCost = tile.buildCosts[tile.houses] ?? Infinity;
    const canAfford = player.money >= buildCost;
    if (canAfford && isEvenBuild(tile, player)) {
      actions.push({ type: "build", enabled: true });
    }
  }

  // 3. Selling
  if (canSellHere && isEvenSell(tile, player)) actions.push({ type: "sell", enabled: true });

  // 4. Mortgage
  if (canMortgage) actions.push({ type: "mortgage", enabled: true });

  // 5. Unmortgage
  if (canUnmortgage) {
    const cost = Math.floor(tile.price / 2 * 1.1);
    if (player.money >= cost) {
      actions.push({ type: "unmortgage", enabled: true });
    }
  }

  // 6. Skip
  if (actions.length > 0) actions.push({ type: "skip", enabled: true });

  // Render action bar or skip
  if (actions.length > 0) renderActionBar(actions, tile, player);
  else match.takeAction(1)
}


function isEvenBuild(tile, player) {
  const group = board.groups[tile.color];
  const minHouses = Math.min(...group.map(t => t.houses));
  return tile.houses === minHouses;
}


function isEvenSell(tile, player) {
  const group = board.groups[tile.color];
  const maxHouses = Math.max(...group.map(t => t.houses));
  return tile.houses === maxHouses;
}


function renderActionBar(actions, tile, player) {
  const actionBar = document.getElementById("actionBar");

  // Ensure the action bar is visible
  actionBar.classList.add("visible");

  const allButtons = {
    buy: document.getElementById("buyBtn"),
    build: document.getElementById("buildBtn"),
    mortgage: document.getElementById("mortgageBtn"),
    unmortgage: document.getElementById("unmortgageBtn"),
    sell: document.getElementById("sellBtn"),
    skip: document.getElementById("skipBtn")
  };

  // Hide all buttons first
  Object.values(allButtons).forEach(btn => {
    btn.style.display = "none";
    btn.disabled = true;
  });

  // Show only valid actions
  actions.forEach(action => {
    const btn = allButtons[action.type];
    if (btn) {
      btn.style.display = "inline-block";
      btn.disabled = !action.enabled;
    }
  });

  // Optional message
  const message = document.getElementById("actionMessage");
  message.textContent = `${tile.label} — Choose an action.`;
}