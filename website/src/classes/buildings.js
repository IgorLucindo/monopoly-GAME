class Buildings {
  constructor(buildingData) {
    this.type = buildingData.type;
    this.number = buildingData.number;
    this.imgSrc = buildingData.imgSrc;
    this.buildingSize = this.type === "house" ? 2.5 : 3.5; // Size in vmin

    this.list = [];
    this.buildingEl = null
    this.sellingEl = null
    this.prevBuildPos = {top: 0, left: 0}
    
    this.el = this.create();
    this.createBuildings();
    this.createBuildEvent();
  }


  create() {
    // Create
    const buildings = document.createElement("div");
    buildings.classList.add("buildings");

    // Append element
    document.querySelector(".buildings-container").appendChild(buildings)

    return buildings;
  }


  createBuildings() {
    for (let i = 0; i < this.number; i++) {
      const building = document.createElement("img");
      building.classList.add("building");

      // Set width via CSS variable
      building.style.setProperty('--width', `${this.buildingSize}vmin`);
      building.src = this.imgSrc;

      // Append element
      this.list.push(building);
      this.el.appendChild(building);

      // Reposition buildings
      this.setInitialBuildingPosition(building, i);
    }
  }


  setInitialBuildingPosition(building, index) {
    const containerRect = this.el.getBoundingClientRect();
    const buildingRect = building.getBoundingClientRect();

    const containerWidth = containerRect.width;
    const size = buildingRect.width;
    const containerPaddingRight = size / 4;

    // Calculate how many buildings fit per row
    const buildingsPerRow = Math.floor((containerWidth-containerPaddingRight) / size);

    // Determine row and column for current index
    const row = Math.floor(index / buildingsPerRow);
    const col = index % buildingsPerRow;

    // Calculate position
    const top = row * size * 1.1;
    const left = col * size + Math.floor(Math.random() * containerPaddingRight);

    // Set position
    building.style.setProperty('--top', `${top}px`);
    building.style.setProperty('--left', `${left}px`);
  }


  createBuildEvent() {
    // Mouse down event
    const mousedown = (e) => {
      if (!this.list.length) return;

      // Get last building
      const building = this.list.at(-1);

      // Move building
      building.style.position = "fixed";
      building.style.top = `${e.clientY}px`;
      building.style.left = `${e.clientX}px`;
      building.style.transform = "translate(-50%, -50%) scale(1.1)";
      building.classList.add("lift");

      this.buildingEl = building;
    }

    // Mouse move event
    const mousemove = (e) => {
      if (!this.buildingEl) return;

      const building = this.buildingEl;
      
      // Move building
      building.style.top = `${e.clientY}px`;
      building.style.left = `${e.clientX}px`;
    }

    // Mouse up event
    const mouseup = (e) => {
      if (!this.buildingEl) return;

      const building = this.buildingEl;

      // Reset positon
      building.style.position = null;
      building.style.top = null;
      building.style.left = null;
      building.style.transform = null;
      building.classList.remove("lift");

      this.buildingEl = null;

      // Get closest tile
      const tileEl = document.elementFromPoint(e.clientX, e.clientY).closest(".tile");
      const tile = board.getTileFromElement(tileEl);

      // DEBUG
      debug.setMonopoly(match.players[0], tile.color);

      // check if can build
      if (this.isBuildable(tile)) {
        tile.owner.build(tile);
        this.list.pop();
        board.el.appendChild(building);

        // Move building
        building.style.position = "fixed";
        building.style.top = `${e.clientY}px`;
        building.style.left = `${e.clientX}px`;
        building.style.transform = "translate(-50%, -50%)";
        
        // Create event for selling
        this.createSellEvent(tile, building);
      }
    }

    // Create events
    if (!isTouch) {
      this.el.addEventListener("mousedown", mousedown);
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }
  }


  createSellEvent(tile, building) {
    // Mouse down event
    const mousedown = (e) => {
      if (!localPlayers.includes(tile.owner.name)) return;
      
      // Move building
      building.style.top = `${e.clientY}px`;
      building.style.left = `${e.clientX}px`;
      building.style.transform = "translate(-50%, -50%) scale(1.1)";
      building.classList.add("lift");

      this.sellingEl = building;
      this.prevBuildPos.top = e.clientY;
      this.prevBuildPos.left = e.clientX;
    }

    // Mouse move event
    const mousemove = (e) => {
      if (!localPlayers.includes(tile.owner.name)) return;
      if (!this.sellingEl || this.sellingEl !== building) return;
      
      // Move building
      building.style.top = `${e.clientY}px`;
      building.style.left = `${e.clientX}px`;
    }

    // Mouse up event
    const mouseup = (e) => {
      if (!localPlayers.includes(tile.owner.name)) return;
      if (!this.sellingEl || this.sellingEl !== building) return;

      // Reset position
      building.style.position = null;
      building.style.top = null;
      building.style.left = null;
      building.style.transform = null;
      building.classList.remove("lift");
      
      // Get closest tile
      const closestEl = document.elementFromPoint(e.clientX, e.clientY)
      const newTileEl = closestEl.closest(".tile");
      const newTile = board.getTileFromElement(newTileEl);

      this.sellingEl = null;

      // Sell if drag to buildings container
      if (closestEl === this.el && this.isSellable(tile)) {
        tile.owner.sell(tile);
        this.list.push(building);
        this.el.appendChild(building);
        this.setInitialBuildingPosition(building, this.list.length-1);
        this.removeSellEvent(building, mousedown, mousemove, mouseup);
      }
      // Go back to tile if outside
      else if (newTile !== tile) {
        building.style.position = "fixed";
        building.style.top = `${this.prevBuildPos.top}px`;
        building.style.left = `${this.prevBuildPos.left}px`;
        building.style.transform = "translate(-50%, -50%)";
      }
      // Move if inside own tile
      else {
        building.style.position = "fixed";
        building.style.top = `${e.clientY}px`;
        building.style.left = `${e.clientX}px`;
        building.style.transform = "translate(-50%, -50%)";
      }
    }

    // Create events
    if (!isTouch) {
      building.addEventListener("mousedown", mousedown);
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }
  }


  removeSellEvent(building, mousedown, mousemove, mouseup) {
    // Create events
    if (!isTouch) {
      building.removeEventListener("mousedown", mousedown);
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }
  }


  isBuildable(tile) {
    if(!tile || !tile.owner) return false;

    const isProperty = tile.type === "property";
    const isOwner = localPlayers.includes(tile.owner.name);
    const isMonopoly = match.checkMonopoly(tile.color, tile.owner);
    const hasSpace = this.type === "house" ? tile.houses < 4 : tile.houses === 4;
    const isBalanced = tile.houses === Math.min(...board.groups[tile.color].map(t => t.houses));
    const hasMoney = tile.owner.money >= tile.buildCost;

    return isProperty && isOwner && isMonopoly && hasSpace && isBalanced && hasMoney;
  }


  isSellable(tile) {
    const isBalanced = tile.houses === Math.max(...board.groups[tile.color].map(t => t.houses));

    return isBalanced;
  }
}