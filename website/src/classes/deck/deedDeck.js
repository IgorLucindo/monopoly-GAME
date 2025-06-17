class DeedDeck {
  constructor(tiles) {
    this.tiles = tiles.filter(t => ["property", "railroad", "utility"].includes(t.type));
    this.cards = {};
    this.animationTime = 0.5;

    this.el = this.create();
    this.createAllCards();
  }


  create() {
    const el = document.createElement("div");
    document.body.appendChild(el);
    return el;
  }


  createAllCards() {
    this.tiles.forEach(tile => {
      if (tile.type === "property"){
        const card = document.createElement("div");
        card.className = "deed-card";

        card.innerHTML = `
          <div class="deed-inner">
            <div class="deed-header" style="background-color: ${board.colorMap[tile.color]}">${tile.label}</div>
            <div class="deed-body">
              <p>Rent: $${tile.rent[0]}</p>
              <p>With 1 House: $${tile.rent[1]}</p>
              <p>With 2 Houses: $${tile.rent[2]}</p>
              <p>With 3 Houses: $${tile.rent[3]}</p>
              <p>With 4 Houses: $${tile.rent[4]}</p>
              <p>With Hotel: $${tile.rent[5]}</p>
              <hr/>
              <p>House Cost: $${tile.buildCost} each</p>
              <p>Mortgage Value: $${tile.mortgageCost}</p>
              <h6>If a player owns ALL the Lots of any Color-Group, the rent is Doubled on Unimproved Lots in that group.</h6>
            </div>
          </div>
        `;
        card.style.transition = `left ${this.animationTime}s ease, top ${this.animationTime}s ease, transform ${this.animationTime}s ease`;

        this.el.appendChild(card);
        this.cards[tile.index] = card;
      }
    });
  }


  showCard(tile) {
    const card = this.cards[tile.index];

    // Hide all others
    Object.values(this.cards).forEach(card => card.classList.remove("visible"));

    // Position over tile
    const rect = tile.element.getBoundingClientRect();
    card.style.left = `${rect.left + rect.width / 2}px`;
    card.style.top = `${rect.top + rect.height / 2}px`;
    card.style.transform = "translate(-50%, -50%) scale(0.2)";
    card.classList.add("visible");

    // Force reflow for animation
    void card.offsetWidth;

    // Animate over center
    card.style.left = "50%";
    card.style.top = "50%";
    card.style.transform = "translate(-50%, -50%) scale(1.5)";
  }


  hideCard(tile) {
    const card = this.cards[tile.index];
    card.classList.remove("visible");
  }
}