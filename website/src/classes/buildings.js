export class Buildings {
  constructor(buildingData) {
    this.type = buildingData.type;
    this.number = buildingData.number;
    this.imgSrc = buildingData.imgSrc;
    this.buildingSize = this.type === "house" ? 2.5 : 3.5; // Size in vmin

    this.list = [];
    this.el = null;
    this.buildingEl = null;
    this.sellingEl = null;
  }

  
  init(variables) {
    this.getVariables(variables);
    this.create();
    this.createBuildings();
    this.createBuildEvent();
  }


  getVariables(variables) {
    this.cfg = variables.cfg;
    this.board = variables.board;
    this.houses = variables.houses;
    this.match = variables.match;
    this.screen = variables.screen;
  }


  create() {
    const buildings = document.createElement("div");
    buildings.classList.add("buildings");
    document.querySelector(".buildings-container").appendChild(buildings)
    this.el = buildings;
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

      const building = this.list.at(-1);
      this.liftBuilding(building, e);
      if (this.cfg.mobile) this.screen.zoomIn(e);
      this.buildingEl = building;
    }

    // Mouse move event
    const mousemove = (e) => {
      if (!this.buildingEl) return;
      
      const building = this.buildingEl;
      this.moveBuildingToEvent(building, e);
      if (this.cfg.mobile) this.screen.zoomMove(e);
    }

    // Mouse up event
    const mouseup = (e) => {
      if (!this.buildingEl) return;

      const building = this.buildingEl;
      this.unLiftBuilding(building);
      if (this.cfg.mobile) this.screen.zoomOut();
      this.buildingEl = null;

      // Get closest tile
      const point = this.cfg.touch ? e.changedTouches[0] : e;
      const tileEl = document.elementFromPoint(point.clientX, point.clientY).closest(".tile");
      const tile = this.board.getTileFromElement(tileEl);

      // check if can build
      if (this.isBuildable(tile)) {
        tile.owner.build(tile);
        if (this.type === "hotel") {
          while (tile.buildings.length > 0) {
            const b = tile.buildings.pop();
            this.houses.unLiftBuilding(b);
            this.houses.list.push(b);
            this.houses.el.appendChild(b);
            this.houses.setInitialBuildingPosition(b, this.houses.list.length - 1);
            this.houses.removeSellEvent(b);
          }
        }
        this.list.pop();
        tile.buildings.push(building);
        this.board.el.appendChild(building);

        const point = this.cfg.touch ? e.changedTouches[0] : e;
        this.moveBuilding(building, point.clientX, point.clientY);
        
        // Create event for selling
        this.createSellEvent(tile, building);
      }
    }

    // Create events
    if (!this.cfg.touch) {
      this.el.addEventListener("mousedown", mousedown);
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }
    else {
      this.el.addEventListener("touchstart", mousedown, { passive: true });
      document.addEventListener("touchmove", mousemove, { passive: true });
      document.addEventListener("touchend", mouseup);
    }
  }


  createSellEvent(tile, building) {
    // Mouse down event
    const mousedown = (e) => {
      if (this.match.localPlayer.name !== tile.owner.name) return;
      
      this.liftBuilding(building, e);
      if (this.cfg.mobile) this.screen.zoomIn(e);
      this.sellingEl = building;

      const point = this.cfg.touch ? e.touches[0] : e;
      building._pos = {x: point.clientX, y: point.clientY};
    }

    // Mouse move event
    const mousemove = (e) => {
      if (this.match.localPlayer.name !== tile.owner.name) return;
      if (!this.sellingEl || this.sellingEl !== building) return;
      
      this.moveBuildingToEvent(building, e);
      if (this.cfg.mobile) this.screen.zoomMove(e);
    }

    // Mouse up event
    const mouseup = (e) => {
      if (this.match.localPlayer.name !== tile.owner.name) return;
      if (!this.sellingEl || this.sellingEl !== building) return;

      this.unLiftBuilding(building);
      if (this.cfg.mobile) this.screen.zoomOut();
      
      // Get closest tile
      const point = this.cfg.touch ? e.changedTouches[0] : e;
      const closestEl = document.elementFromPoint(point.clientX, point.clientY)
      const newTileEl = closestEl.closest(".tile");
      const newTile = this.board.getTileFromElement(newTileEl);

      this.sellingEl = null;

      // Sell if drag to buildings container
      if (closestEl === this.el && this.isSellable(tile)) {
        tile.owner.sell(tile);
        this.list.push(building);
        tile.buildings.pop();
        this.el.appendChild(building);
        this.setInitialBuildingPosition(building, this.list.length-1);
        this.removeSellEvent(building);

        // If hotel, move houses back to houses container
        if (this.type === "hotel") {
          for (let i = 0; i < 4 && this.houses.list.length > 0; i++) {
            const b = this.houses.list.pop();
            tile.buildings.push(b);
            this.board.el.appendChild(b);
            this.createSellEvent(tile, b);
          };
          this.resetBuildingsPosInTile(tile);

          const numOfSell = 4 - this.houses.list.length;
          for (let i = 0; i < numOfSell; i++) tile.owner.sell(tile);
        }
      }
      // Go back to tile if outside
      else if (newTile !== tile) this.moveBuilding(building, building._pos.x, building._pos.y); 
      // Move if inside own tile
      else {
        const point = this.cfg.touch ? e.changedTouches[0] : e;
        this.moveBuilding(building, point.clientX, point.clientY);
      }
    }

    // Store handlers on the element to be accessed later
    building._sellHandlers = {mousedown, mousemove, mouseup};

    // Create events
    if (!this.cfg.touch) {
      building.addEventListener("mousedown", mousedown);
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }
    else {
      building.addEventListener("touchstart", mousedown, { passive: true });
      document.addEventListener("touchmove", mousemove, { passive: true });
      document.addEventListener("touchend", mouseup);
    }
  }


  removeSellEvent(building) {
    if (!building._sellHandlers) return;

    const {mousedown, mousemove, mouseup} = building._sellHandlers;

    // Create events
    if (!this.cfg.touch) {
      building.removeEventListener("mousedown", mousedown);
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }
    else {
      building.removeEventListener("touchstart", mousedown, { passive: true });
      document.removeEventListener("touchmove", mousemove, { passive: true });
      document.removeEventListener("touchend", mouseup);
    }

    // Clean up the stored handlers
    delete building._sellHandlers;
  }

  moveBuildingToEvent(building, e) {
    const point = this.cfg.touch ? e.touches[0] : e;
    building.style.top = `${point.clientY}px`;
    building.style.left = `${point.clientX}px`;
  }


  moveBuilding(building, posX, posY) {
    building.style.position = "fixed";
    building.style.top = `${posY}px`;
    building.style.left = `${posX}px`;
    building.style.transform = "translate(-50%, -50%)";
  }


  liftBuilding(building, e) {
    const point = this.cfg.touch ? e.touches[0] : e;
    building.style.position = "fixed";
    building.style.top = `${point.clientY}px`;
    building.style.left = `${point.clientX}px`;
    building.style.transform = "translate(-50%, -50%) scale(1.1)";
    building.classList.add("lift");
  }


  unLiftBuilding(building) {
    building.style.position = null;
    building.style.top = null;
    building.style.left = null;
    building.style.transform = null;
    building.classList.remove("lift");
  }


  isBuildable(tile) {
    if(!tile || !tile.owner) return false;

    const isProperty = tile.type === "property";
    const isOwner = this.match.localPlayer.name === tile.owner.name;
    const isMonopoly = this.match.checkMonopoly(tile.color, tile.owner);
    const hasSpace = this.type === "house" ? tile.houses < 4 : tile.houses === 4;
    const isBalanced = tile.houses === Math.min(...this.board.groups[tile.color].map(t => t.houses));
    const hasMoney = tile.owner.money >= tile.buildCost;

    return isProperty && isOwner && isMonopoly && hasSpace && isBalanced && hasMoney;
  }


  isSellable(tile) {
    const isBalanced = tile.houses === Math.max(...this.board.groups[tile.color].map(t => t.houses));

    return isBalanced;
  }

  
  resetBuildingsPosInTile(tile) {
    // Get all buildings currently on the tile (including the one being placed)
    const buildings = tile.buildings;
    const buildingRect = buildings[0].getBoundingClientRect();
    const tileRect = tile.element.getBoundingClientRect();

    // Set position for each building
    buildings.forEach((b, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const posX = tileRect.left + buildingRect.width/2 + buildingRect.width*0.1 + col * buildingRect.width;
      const posY = tileRect.top + buildingRect.height/2 + buildingRect.height*0.1 + row * buildingRect.height;
      this.moveBuilding(b, posX, posY);
    });
  }
}