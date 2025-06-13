class Board {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.size = 11;
    this.tiles = [];
    this.createBoard();
  }

  
  createBoard() {
    this.container.innerHTML = "";
    const totalCells = this.size * this.size;

    // Create 121 grid cells visually
    for (let i = 0; i < totalCells; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      this.container.appendChild(tile);
    }

    // Define the 40 playable tiles manually in clockwise order
    const pathOrder = [
      // Bottom row (left to right)
      [10, 10], [10, 9], [10, 8], [10, 7], [10, 6], [10, 5], [10, 4], [10, 3], [10, 2], [10, 1], [10, 0],
      // Left column (bottom to top)
      [9, 0], [8, 0], [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
      // Top row (left to right)
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
      // Right column (top to bottom)
      [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10]
    ];

    // Set up playable tiles (with labels)
    pathOrder.forEach(([row, col], index) => {
      const gridIndex = row * this.size + col;
      const tile = this.container.children[gridIndex];
      tile.textContent = this.getTileLabel(index);
      if (this.isCorner(index)) tile.classList.add("corner");
      this.tiles.push({ row, col, element: tile });
    });
  }


  isCorner(index) {
    // Corners: 0 (GO), 10, 20, 30
    return index % 10 === 0;
  }


  getTileLabel(index) {
    // Optional: give custom names
    const labels = {
      0: "GO",
      10: "Jail",
      20: "Free Parking",
      30: "Go to Jail"
    };
    return labels[index] || `Tile ${index}`;
  }
}