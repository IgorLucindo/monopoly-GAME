class Board {
  constructor(tileData) {
    this.el = document.getElementById("gameBoard");
    this.size = 11;
    this.tiles = [];
    this.jailPos = 0;
    this.groups = {
      "brown": [], "light-blue": [], "pink": [], "orange": [],
      "red": [], "yellow": [], "green": [], "dark-blue": []
    };
    this.colorMap = {
      "brown": "#8b4513",
      "light-blue": "#add8e6",
      "pink": "#ff69b4",
      "orange": "#ffa500",
      "red": "#ff0000",
      "yellow": "#ffff00",
      "green": "#008000",
      "dark-blue": "#00008b"
    };
    this.createBoard(tileData);
  }


  createBoard(tileData) {
    this.el.innerHTML = "";

    // Create the center tile (middle area)
    const centerTile = document.createElement("div");
    centerTile.classList.add("center-tile");
    centerTile.style.gridRow = "2 / 11";
    centerTile.style.gridColumn = "2 / 11";
    this.el.appendChild(centerTile);

    // Loop through all tiles and create their DOM + data structure
    tileData.forEach(tileInfo => {
      const tile = this.createTile(tileInfo);
      this.el.appendChild(tile);

      // Create internal tile object
      const tileObject = {
        ...tileInfo,
        element: tile,
        owner: null,
        houses: 0,
        mortgaged: false,
        mortgageCost: Math.floor(tileInfo.price / 2)
      };

      // Register property tiles into their color group
      if (tileInfo.type === "property") this.groups[tileInfo.color].push(tileObject);
      // Register jail position
      else if (tileInfo.type === "jail") this.jailPos = tileInfo.index;
      
      // Add to global tile list
      this.tiles.push(tileObject);
    });

    // Append decks elements
    this.el.appendChild(chanceDeck.pileElement);
    this.el.appendChild(communityDeck.pileElement);
  }


  createTile(tileInfo) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    if (tileInfo.corner) tile.classList.add("corner");

    tile.style.gridRow = tileInfo.row;
    tile.style.gridColumn = tileInfo.col;

    // Property color stripe
    if (tileInfo.type === "property" && tileInfo.color) {
      const stripe = document.createElement("div");
      stripe.classList.add("color-stripe");
      stripe.style.backgroundColor = this.colorMap[tileInfo.color];
      tile.appendChild(stripe);
    }

    // Base label
    const label = document.createElement("div");
    label.classList.add("tile-label");
    label.textContent = tileInfo.label;
    tile.appendChild(label);

    // Building container
    if (tileInfo.type === "property") {
      const buildingContainer = document.createElement("div");
      buildingContainer.classList.add("tile-buildings");
      tile.buildingContainer = buildingContainer; // store reference
      tile.appendChild(buildingContainer);
    }

    // Price label
    if (tileInfo.price) {
      const price = document.createElement("div");
      price.classList.add("tile-price");
      price.textContent = `$${tileInfo.price}`;
      tile.appendChild(price);
    }

    return tile;
  }
}