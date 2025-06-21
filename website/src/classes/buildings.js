class Buildings {
  constructor(buildingData) {
    this.number = buildingData.number;
    
    this.el = this.create();
  }


  create() {
    const buildings = document.createElement("div");
    buildings.classList.add("buildings");

    document.querySelector(".buildings-container").appendChild(buildings)

    return buildings;
  }
}