class DeedDeck {
  constructor(tiles) {
    this.tiles = tiles.filter(t => ["property", "railroad", "utility"].includes(t.type));
    this.container = document.getElementById("deedDeck");
    this.cardMap = new Map();
    this.createAllCards();
  }


  createAllCards() {
    this.tiles.forEach(tile => {
      if (tile.type === "property"){
        const card = document.createElement("div");
        card.className = "deed-card";

        const color = board.colorMap[tile.color];
        card.style.setProperty("--group-color", color || "#666");

        const inner = document.createElement("div");
        inner.className = "deed-inner";

        const header = document.createElement("div");
        header.className = "deed-header";
        header.textContent = tile.label;

        const body = document.createElement("div");
        body.className = "deed-body";

        const houseCost = tile.buildCost;
        const mortgage = Math.floor(tile.price / 2);

        body.innerHTML = `
          <p>Rent: $${tile.rent[0]}</p>
          <p>With 1 House: $${tile.rent[1]}</p>
          <p>With 2 Houses: $${tile.rent[2]}</p>
          <p>With 3 Houses: $${tile.rent[3]}</p>
          <p>With 4 Houses: $${tile.rent[4]}</p>
          <p>With Hotel: $${tile.rent[5]}</p>
          <hr/>
          <p>House Cost: $${houseCost} each</p>
          <p>Mortgage Value: $${mortgage}</p>
          <h6>If a player owns ALL the Lots of any Color-Group, the rent is Doubled on Unimproved Lots in that group.</h6>
        `;

        inner.appendChild(header);
        inner.appendChild(body);
        card.appendChild(inner);
        this.container.appendChild(card);

        this.cardMap.set(tile, card);
      }
    });
  }


  showCard(tile) {
    const card = this.cardMap.get(tile);
    if (!card) return;

    // Hide all others
    this.cardMap.forEach(c => c.classList.remove("visible"));

    // Position over tile
    const rect = tile.element.getBoundingClientRect();
    card.style.left = `${rect.left + rect.width / 2}px`;
    card.style.top = `${rect.top + rect.height / 2}px`;
    card.style.transform = "translate(-50%, -50%) scale(1)";
    card.classList.add("visible");

    // Force reflow for animation
    void card.offsetWidth;

    // Animate to center
    setTimeout(() => {
      card.style.left = "50%";
      card.style.top = "50%";
      card.style.transform = "translate(-50%, -50%) scale(1.5)";
    }, 50);

    // Hide after delay
    setTimeout(() => {card.classList.remove("visible");}, 3000);
  }
}