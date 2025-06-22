class Buildings {
  constructor(buildingData) {
    this.number = buildingData.number;
    this.imgSrc = buildingData.imgSrc;
    this.size = buildingData.type === "house" ? 2.7 : 4; // width in vmin
    
    this.el = this.create();
    this.createBuildings();
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
      building.style.setProperty('--width', `${this.size}vmin`);
      building.src = this.imgSrc;

      // Append first to measure
      this.el.appendChild(building);

      // Reposition buildings
      this.setInitialBuildingPosition(building)
    }
  }


  setInitialBuildingPosition(building) {
    // Random horizontal position
    let left = Math.random() * (100 - this.size);
    building.style.left = `${left}%`;

    // Check for overflow
    const buildingRect = building.getBoundingClientRect();
    const containerRect = this.el.getBoundingClientRect();

    const isOverflowing = buildingRect.right > containerRect.right;

    if (isOverflowing) {
      // Move it upward (e.g., into a second row visually)
      building.style.top = "-50px"; // Or any negative/relative value you like

      // Re-randomize horizontal position
      left = Math.random() * (100 - this.size);
      building.style.left = `${left}%`;
    }
    else {
      building.style.top = "0px"; // Align to the base level
    }
  }
}