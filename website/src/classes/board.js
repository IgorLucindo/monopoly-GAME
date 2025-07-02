class Board {
  constructor(tileData) {
    this.el = document.getElementById("gameBoard");
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;

    this.tiles = [];
    this.jailPos = 0;
    this.numOfTiles = tileData.length;

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
      "yellow": "#f1d500",
      "green": "#008000",
      "dark-blue": "#00008b"
    };
    
    this.getRect();
    this.create(tileData);
  }


  getRect() {
    const rect = this.el.getBoundingClientRect();
    this.top = rect.top;
    this.left = rect.left;
    this.width = rect.width;
    this.height = rect.height;
  }


  create(tileData) {
    // Create the center tile (middle area)
    this.el.innerHTML = `<div class="center-tile" style="grid-row: 2 / 11; grid-column: 2 / 11;"></div>`;

    // Loop through all tiles and create their DOM + data structure
    tileData.forEach((tileInfo) => {
      const tile = this.createTile(tileInfo);
      this.el.appendChild(tile);

      // Create internal tile object
      const tileObject = {
        ...tileInfo,
        element: tile,
        rotation: 0,
        owner: null,
        houses: 0,
        buildings: [],
        mortgaged: false,
        mortgageValue: Math.floor(tileInfo.price / 2),
        unmortgageValue: Math.floor(tileInfo.price / 2 * 1.1),
      };

      // Register property tiles into their color group
      if (tileInfo.type === "property") this.groups[tileInfo.color].push(tileObject);
      // Register jail position
      else if (tileInfo.type === "jail") this.jailPos = tileInfo.index;
      
      // Add to global tile list
      this.tiles.push(tileObject);
    });

    // Rotate tiles
    this.rotateTiles();

    // Create hover event
    this.createTileHover();
  }


  createTile(tileInfo) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    if (tileInfo.corner) tile.classList.add("corner");

    // Set position
    tile.style.gridRow = tileInfo.row;
    tile.style.gridColumn = tileInfo.col;

    // Create inner html
    if (tileInfo.type === "property") {
      tile.innerHTML = `
        <div class="tile-content">
          <div class="color-stripe" style="background-color: ${this.colorMap[tileInfo.color]}"></div>
          <div class="tile-label">${tileInfo.label}</div>
          <div class="tile-price" style="margin-top: auto;">$${tileInfo.price}</div>
          <div class="tile-players"></div>
          <div class="tile-timer"></div>
          <div class="tile-mortgaged">
            <h4>Mortgaged</h4>
            <h5>Pay $${Math.floor(tileInfo.price / 2 * 1.1)} to unmortgage.</h5>
          </div>
        </div>
      `;
    }
    else if (tileInfo.type === "railroad") {
      tile.innerHTML = `
        <div class="tile-content">
          <div class="tile-label">${tileInfo.label}</div>
          <img style="width: 70%" src="../assets/images/tiles/${tileInfo.type}.png">
          <div class="tile-price">$${tileInfo.price}</div>
          <div class="tile-players"></div>
          <div class="tile-timer"></div>
          <div class="tile-mortgaged">
            <h4>Mortgaged</h4>
            <h5>Pay $${Math.floor(tileInfo.price / 2 * 1.1)} to unmortgage.</h5>
          </div>
        </div>
      `;
    }
    else if (tileInfo.type === "utility") {
      tile.innerHTML = `
        <div class="tile-content">
          <div class="tile-label">${tileInfo.label}</div>
          <img style="width: ${tileInfo.label === "Water Works" ? 90 : 65}%" src="../assets/images/tiles/${tileInfo.label}.svg">
          <div class="tile-price">$${tileInfo.price}</div>
          <div class="tile-players"></div>
          <div class="tile-timer"></div>
          <div class="tile-mortgaged">
            <h4>Mortgaged</h4>
            <h5>Pay $${Math.floor(tileInfo.price / 2 * 1.1)} to unmortgage.</h5>
          </div>
        </div>
      `;
    }
    else if (tileInfo.type === "chance" || tileInfo.type === "community") {
      tile.innerHTML = `
        <div class="tile-content">
          <div class="tile-label">${tileInfo.label}</div>
          <img style="width: ${tileInfo.type === "chance" ? 120 : 90}%" src="../assets/images/tiles/${tileInfo.type}.svg">
          <div class="tile-players"></div>
        </div>
        `;
    }
    else {
      tile.innerHTML = `
        <div class="tile-content">
          <div class="tile-label">${tileInfo.label}</div>
          <div class="tile-players"></div>
        </div>
      `;
    }

    return tile;
  }


  rotateTiles() {
    this.tiles.forEach((tile, index) => {
      // Get rotation
      tile.rotation = Math.floor(index / this.numOfTiles * 4) * 90;
      if (tile.rotation === 270) tile.rotation = -90;

      if (!tile.corner) {
        const tileChild = tile.element.firstElementChild;

        // Rotate
        if (tile.rotation) tileChild.classList.add(`rotate-${tile.rotation}`);
        
        // Fix sizes
        const rect = tileChild.getBoundingClientRect();
        tileChild.style.width = rect.width + "px";
        tileChild.style.height = rect.height + "px";
      }
    });
  }


  createTileHover() {
    // Create timer
    const hoverTimer = new TileHoverTimer(this.showDeed);

    let currentTile = null;

    // Mouse over event
    const mouseover = (e) => {
      if (match.state === "action" || dices.draggingCount > 0 || actions.state === "mortgage") return;

      const tileEl = e.target.closest(".tile");
      const tile = this.getTileFromElement(tileEl);

      if (!tile || !["property", "railroad", "utility"].includes(tile.type)) return;

      hoverTimer.attachToTile(tile);
    };

    // Touch start event
    const touchstart = (e) => {
      if (match.state === "action" || dices.draggingCount > 0 || actions.state === "mortgage") return;

      const tileEl = e.target.closest(".tile");
      const tile = this.getTileFromElement(tileEl);

      if (currentTile && tile !== currentTile) {
        this.hideDeed(currentTile);
        currentTile = null;
        return;
      }
      if (!tile || !["property", "railroad", "utility"].includes(tile.type)) return;

      currentTile = tile

      this.showDeed(tile);
    }

    // Mouse out event
    const mouseout = (e) => {
      const tileEl = e.target.closest(".tile");
      const tile = this.getTileFromElement(tileEl);

      if (!tile || !["property", "railroad", "utility"].includes(tile.type)) return;

      if (hoverTimer.completed) this.hideDeed(tile);
      hoverTimer.reset();
    };

    // Create events
    if (!isTouch) {
      document.addEventListener("mouseover", mouseover);
      document.addEventListener("mouseout", mouseout);
    }
    else document.addEventListener("touchstart", touchstart, { passive: true });
  }


  getTileFromElement(el) {
    return this.tiles.find(tile => tile.element === el) || null;
  }


  showDeed(tile) {
    screen.showOverlay();
    deedDeck.showCard(tile);
    tile.element.classList.add("highlight");
  }


  hideDeed(tile) {
    screen.hideOverlay();
    deedDeck.hideCard(tile);
    tile.element.classList.remove("highlight");
  }


  highlightOwnedTiles() {
    this.tiles.forEach((tile) => {
      if (tile.owner && localPlayer.name === tile.owner.name) {
        tile.element.classList.add("highlight");

        if (tile.mortgaged) {
          const mortgageEl = tile.element.querySelector(".tile-mortgaged");
          mortgageEl.classList.add("visible");
        }
      }
    });
  }

  
  unhighlightOwnedTiles() {
    this.tiles.forEach((tile) => {
      if (tile.owner && localPlayer.name === tile.owner.name) {
        tile.element.classList.remove("highlight");
        
        const mortgageEl = tile.element.querySelector(".tile-mortgaged");
        if (mortgageEl.classList.contains("visible")) {
          mortgageEl.classList.remove("visible");
        }
      }
    });
  }
}