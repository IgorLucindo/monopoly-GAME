class Board {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.tiles = [];
    this.size = 11;
      this.createBoard(tileData);
  }


  createBoard(tileData) {
    this.container.innerHTML = "";

    const centerTile = document.createElement("div");
    centerTile.classList.add("center-tile");
    centerTile.style.gridRow = "2 / 11";
    centerTile.style.gridColumn = "2 / 11";
    this.container.appendChild(centerTile);

    tileData.forEach(tileInfo => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      if (tileInfo.corner) tile.classList.add("corner");

      tile.style.gridRow = tileInfo.row;
      tile.style.gridColumn = tileInfo.col;
      tile.textContent = tileInfo.label;

      this.container.appendChild(tile);

      this.tiles.push({
        ...tileInfo,
        element: tile,
        owner: null
      });
    });
  }
}